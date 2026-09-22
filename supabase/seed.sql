-- Run after schema.sql to populate a fresh project with the same demo
-- catalog the frontend uses as its local mock data.

insert into brands (name, slug) values
  ('Apple', 'apple'), ('Samsung', 'samsung'), ('Sony', 'sony'), ('HP', 'hp'), ('Anker', 'anker');

insert into categories (name, slug, image_url) values
  ('Phones & Tablets', 'phones-tablets', 'https://placehold.co/400x300/080808/ffffff?text=Phones'),
  ('Laptops & Computing', 'laptops-computing', 'https://placehold.co/400x300/080808/ffffff?text=Laptops'),
  ('Audio & Gaming', 'audio-gaming', 'https://placehold.co/400x300/080808/ffffff?text=Audio'),
  ('Accessories', 'accessories', 'https://placehold.co/400x300/080808/ffffff?text=Accessories'),
  ('Smartwatches', 'smartwatches', 'https://placehold.co/400x300/080808/ffffff?text=Watches'),
  ('Gaming Consoles', 'gaming-consoles', 'https://placehold.co/400x300/080808/ffffff?text=Consoles');

-- Example of inserting one full product with an image; replicate this
-- pattern (or use the /admin/products UI once wired to Supabase) for the
-- rest of the catalog in src/data/mockData.ts.
with p as (
  insert into products (
    name, slug, description, brand_id, category_id, price, compare_at_price,
    stock_quantity, sku, is_featured, is_new, specifications
  )
  values (
    'Apple iPhone 15 Pro (256GB)', 'apple-iphone-15-pro-256gb',
    'The latest iPhone 15 Pro with A17 Pro chip, titanium design and a pro camera system.',
    (select id from brands where slug = 'apple'),
    (select id from categories where slug = 'phones-tablets'),
    1350000, 1500000, 12, 'APL-IP15P-256', true, false,
    '{"Display": "6.1 inch OLED", "Storage": "256GB", "RAM": "8GB", "Battery": "3274mAh", "Chip": "A17 Pro"}'
  )
  returning id
)
insert into product_images (product_id, url, position)
select id, 'https://placehold.co/700x700/F5F7F9/080808?text=iPhone+15+Pro', 0 from p;
