// Check subscription and dynamically load premium content
async function checkSubscriptionAndLoad() {
  const user = await requireAuth();

  // Fetch subscription profile from Supabase
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching subscription:", error);
    showLockedState();
    return;
  }

  if (profile.subscription_status === 'active') {
    showPremiumState();
    await loadSecurePremiumContent();
  } else {
    showLockedState();
  }
}

// Safely fetch data restricted by Database RLS policies
async function loadSecurePremiumContent() {
  const { data, error } = await supabase
    .from('premium_content')
    .select('*');

  const contentArea = document.getElementById("premium-content-area");
  if (!contentArea) return;

  if (error || !data || data.length === 0) {
    contentArea.innerHTML = "<p>Welcome! Premium resources are successfully unlocked.</p>";
    return;
  }

  // Render premium list safely to prevent HTML injection (XSS)
  contentArea.innerHTML = data.map(item => `
    <div class="premium-item" style="border-bottom: 1px solid rgba(197, 160, 89, 0.15); padding: 1.5rem 0;">
      <h3 style="color: var(--accent-gold); font-size: 1.1rem; margin-bottom: 0.5rem;">${escapeHTML(item.title)}</h3>
      <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-body);">${escapeHTML(item.body)}</p>
    </div>
  `).join("");
}

// Trigger Stripe Checkout session through Serverless Edge Function
async function handleCheckout() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.innerText = "Connecting to Stripe...";
    checkoutBtn.disabled = true;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    if (result.url) {
      window.location.href = result.url;
    } else {
      throw new Error(result.error || "Failed to create checkout session");
    }
  } catch (error) {
    alert("Checkout error: " + error.message);
    if (checkoutBtn) {
      checkoutBtn.innerText = "Subscribe Now";
      checkoutBtn.disabled = false;
    }
  }
}

function showPremiumState() {
  const lockedView = document.getElementById("locked-view");
  const premiumView = document.getElementById("premium-view");
  if (lockedView) lockedView.style.display = "none";
  if (premiumView) premiumView.style.display = "block";
}

function showLockedState() {
  const lockedView = document.getElementById("locked-view");
  const premiumView = document.getElementById("premium-view");
  if (lockedView) lockedView.style.display = "block";
  if (premiumView) premiumView.style.display = "none";
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}