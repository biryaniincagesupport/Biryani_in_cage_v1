-- ─────────────────────────────────────────────────────────────────────────────
-- Biryani In Cage — Supabase schema
-- Apply via:   psql $SUPABASE_DB_URL -f supabase/schema.sql
-- or paste into the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enquiries (contact form, catering, bulk orders, table reservations).
create table if not exists public.enquiries (
  id          bigserial primary key,
  name        text        not null,
  phone       text        not null,
  email       text,
  message     text,
  occasion    text        not null default 'general',
  source      text        not null default 'web',
  status      text        not null default 'new',
  created_at  timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx     on public.enquiries (status);

alter table public.enquiries enable row level security;

-- Allow anonymous inserts (public contact form), but no read access.
drop policy if exists "anon can insert enquiries" on public.enquiries;
create policy "anon can insert enquiries"
  on public.enquiries
  for insert
  to anon
  with check (true);

-- Optional: dynamic menu management. Keep `is_available` flag so items can
-- be hidden without deletion. The frontend already has a static menu.js
-- fallback if this table is empty.
create table if not exists public.menu_items (
  id              bigserial primary key,
  category        text        not null,
  name            text        not null,
  description     text,
  price           integer     not null,
  price_half      integer,
  is_veg          boolean     not null default true,
  is_popular      boolean     not null default false,
  is_available    boolean     not null default true,
  position        integer     not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists menu_items_category_idx  on public.menu_items (category, position);
create index if not exists menu_items_available_idx on public.menu_items (is_available);

alter table public.menu_items enable row level security;

-- Anyone can read available menu items.
drop policy if exists "anon can read available menu" on public.menu_items;
create policy "anon can read available menu"
  on public.menu_items
  for select
  to anon
  using (is_available = true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Orders — placed from the website checkout. Guest-friendly (no auth needed).
-- Status enum kept as text for flexibility:
--   pending → confirmed → preparing → out_for_delivery → delivered | cancelled
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                   bigserial   primary key,
  customer_name        text        not null,
  customer_phone       text        not null,
  customer_email       text,
  delivery_address     jsonb       not null,
  items                jsonb       not null,
  subtotal             integer     not null,
  delivery_fee         integer     not null default 0,
  gst_amount           integer     not null default 0,
  total                integer     not null,
  payment_method       text        not null default 'cod',
  status               text        not null default 'pending',
  special_instructions text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_status_idx     on public.orders (status, created_at desc);
create index if not exists orders_phone_idx      on public.orders (customer_phone);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Allow both guests and signed-in customers to place orders.
-- Signed-in users must attribute the order to themselves (or leave it null
-- if they choose to order as a guest while signed in).
drop policy if exists "anon can insert orders" on public.orders;
drop policy if exists "anyone can insert orders" on public.orders;
create policy "anyone can insert orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (
    user_id is null or user_id = auth.uid()
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Admin access
-- ─────────────────────────────────────────────────────────────────────────────
-- Email allowlist for the admin dashboard. Add the owner's email(s) here.
-- Keep this list short — anyone listed can read/update every order and read
-- every enquiry through the front-end admin UI.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.email(), '') in (
    'mayank29deo@gmail.com',
    'biryaniincage.support@gmail.com'
    -- , 'owner@biryaniincage.com'
  );
$$;

-- Auto-bump updated_at on order updates.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Admins can read every order.
drop policy if exists "admins can read orders" on public.orders;
create policy "admins can read orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

-- Admins can flip status / append notes.
drop policy if exists "admins can update orders" on public.orders;
create policy "admins can update orders"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can read every enquiry.
drop policy if exists "admins can read enquiries" on public.enquiries;
create policy "admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- Customer profiles & saved addresses
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles — one row per signed-in customer (auth.users.id is the PK).
-- Auto-created by trigger after sign-up; users can edit their own row.
create table if not exists public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_phone_idx on public.profiles (phone);

alter table public.profiles enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "admins read profiles" on public.profiles;
create policy "admins read profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

-- Auto-create a profile row on signup. Pulls full_name from raw_user_meta_data
-- (Google fills "full_name" or "name", magic-link sign-up has neither).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bump updated_at on profile updates.
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- addresses — saved delivery addresses. is_default flag per user.
create table if not exists public.addresses (
  id           bigserial   primary key,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  label        text,
  line1        text        not null,
  landmark     text,
  area         text,
  pincode      text        not null,
  is_default   boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id, created_at desc);

alter table public.addresses enable row level security;

drop policy if exists "users select own addresses" on public.addresses;
create policy "users select own addresses"
  on public.addresses for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users insert own addresses" on public.addresses;
create policy "users insert own addresses"
  on public.addresses for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users update own addresses" on public.addresses;
create policy "users update own addresses"
  on public.addresses for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users delete own addresses" on public.addresses;
create policy "users delete own addresses"
  on public.addresses for delete to authenticated
  using (auth.uid() = user_id);

drop trigger if exists addresses_touch on public.addresses;
create trigger addresses_touch
  before update on public.addresses
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Link orders to authed users (nullable — guests still allowed)
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- Customers can read their own orders.
drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders"
  on public.orders for select to authenticated
  using (user_id = auth.uid());
