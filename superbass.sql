-- 1. Create a table for user profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  subscription_status text default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create a secure table for premium content (to keep it completely hidden from unauthenticated users)
create table public.premium_content (
  id serial primary key,
  title text not null,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row-Level Security (RLS) on both tables
alter table public.profiles enable row level security;
alter table public.premium_content enable row level security;

-- 4. Create RLS policies for Profiles
create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

-- 5. Create RLS policies for Premium Content (Only accessible if subscription_status is 'active')
create policy "Only active subscribers can read premium content" on public.premium_content
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.subscription_status = 'active'
    )
  );

-- 6. Trigger to automatically insert a profile row when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, subscription_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'inactive'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();