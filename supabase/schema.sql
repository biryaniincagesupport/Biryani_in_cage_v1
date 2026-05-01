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

-- Allow anonymous order placement; reads remain locked (owner uses service role).
drop policy if exists "anon can insert orders" on public.orders;
create policy "anon can insert orders"
  on public.orders
  for insert
  to anon
  with check (true);

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
    'mayank29deo@gmail.com'
    -- 'owner@biryaniincage.in'
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
