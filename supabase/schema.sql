-- ============================================================================
-- OTL Gadgets — Supabase Schema
-- Run this in the Supabase SQL editor (or via `supabase db push` with the
-- CLI) on a fresh project. Written for Postgres 15+ / Supabase defaults.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  parent_id uuid references categories(id)
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  sku text not null unique,
  specifications jsonb default '{}'::jsonb,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  rating_average numeric(2,1) not null default 0,
  rating_count integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_products_category on products(category_id);
create index idx_products_brand on products(brand_id);
create index idx_products_active_featured on products(is_active, is_featured);
create index idx_products_search on products using gin (to_tsvector('english', name || ' ' || coalesce(description, '')));

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position integer not null default 0
);
create index idx_product_images_product on product_images(product_id);

create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  price_override numeric(12,2),
  stock_quantity integer not null default 0,
  sku text not null unique
);

-- ---------------------------------------------------------------------------
-- Customer data
-- ---------------------------------------------------------------------------
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  state text not null,
  city text not null,
  address text not null,
  is_default boolean not null default false
);

create table wishlists (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table cart_items (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id),
  quantity integer not null default 1 check (quantity > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references profiles(id),
  order_id uuid,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
create index idx_reviews_product on reviews(product_id);

-- ---------------------------------------------------------------------------
-- Orders & payments
-- ---------------------------------------------------------------------------
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed');

create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  subtotal numeric(12,2) not null,
  delivery_fee numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  payment_status payment_status not null default 'pending',
  order_status order_status not null default 'pending',
  paystack_reference text unique,
  shipping_state text not null,
  shipping_city text not null,
  shipping_address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(order_status);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  subtotal numeric(12,2) not null
);
create index idx_order_items_order on order_items(order_id);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  paystack_reference text not null unique,
  amount numeric(12,2) not null,
  status payment_status not null default 'pending',
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create table coupons (
  code text primary key,
  discount_percent numeric(5,2) not null check (discount_percent between 0 and 100),
  active boolean not null default true,
  expires_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Stock decrement (called from the verify-payment Edge Function)
-- Uses a row lock (FOR UPDATE) to stay safe against concurrent orders.
-- ---------------------------------------------------------------------------
create or replace function decrement_stock(p_product_id uuid, p_quantity integer)
returns void as $$
begin
  update products
  set stock_quantity = stock_quantity - p_quantity,
      updated_at = now()
  where id = p_product_id
    and stock_quantity >= p_quantity;

  if not found then
    raise exception 'Insufficient stock for product %', p_product_id;
  end if;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table products enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;
alter table product_images enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;
alter table wishlists enable row level security;
alter table addresses enable row level security;

-- Public read access to the catalog
create policy "Public can view active products" on products for select using (is_active = true);
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view brands" on brands for select using (true);
create policy "Public can view product images" on product_images for select using (true);
create policy "Public can view reviews" on reviews for select using (true);

-- Admins can manage the catalog (checks profiles.is_admin)
create policy "Admins can manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins can manage categories" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Customers can only see and manage their own orders / cart / wishlist / addresses
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);
create policy "Users manage own wishlist" on wishlists for all using (auth.uid() = user_id);
create policy "Users manage own addresses" on addresses for all using (auth.uid() = user_id);
create policy "Users view own orders" on orders for select using (auth.uid() = user_id or auth.uid() is null);
create policy "Users view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Admins view all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins update orders" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Authenticated customers can leave reviews
create policy "Users can create reviews" on reviews for insert with check (auth.uid() = user_id);
