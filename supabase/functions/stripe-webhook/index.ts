import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@^14.0.0"
import { createClient } from "npm:@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature provided', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const status = subscription.status
      const subscriptionId = subscription.id

      const isSubscriptionActive = ['active', 'trialing'].includes(status)
      const dbStatus = isSubscriptionActive ? 'active' : 'inactive'

      const customer = await stripe.customers.retrieve(customerId)
      const userId = ('metadata' in customer) ? customer.metadata.supabase_user_id : null

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: dbStatus,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId
          })
          .eq('id', userId)
      } else {
        await supabase
          .from('profiles')
          .update({
            subscription_status: dbStatus,
            stripe_subscription_id: subscriptionId
          })
          .eq('stripe_customer_id', customerId)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})