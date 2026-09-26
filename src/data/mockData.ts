import type { Brand, Category, Product } from '@/types'

export const mockBrands: Brand[] = [
  { id: 'b1', name: 'Apple', slug: 'apple' },
  { id: 'b2', name: 'Samsung', slug: 'samsung' },
  { id: 'b3', name: 'Sony', slug: 'sony' },
  { id: 'b4', name: 'HP', slug: 'hp' },
  { id: 'b5', name: 'Anker', slug: 'anker' },
]

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Phones & Tablets', slug: 'phones-tablets', product_count: 42, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' },
  { id: 'c2', name: 'Laptops & Computing', slug: 'laptops-computing', product_count: 27, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop' },
  { id: 'c3', name: 'Audio & Gaming', slug: 'audio-gaming', product_count: 33, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
  { id: 'c4', name: 'Accessories', slug: 'accessories', product_count: 58, image_url: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=800&auto=format&fit=crop' },
  { id: 'c5', name: 'Smartwatches', slug: 'smartwatches', product_count: 15, image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop' },
  { id: 'c6', name: 'Gaming Consoles', slug: 'gaming-consoles', product_count: 9, image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop' },
]

export const mockProducts: Product[] = [
  {
    id: 'p1', name: 'Apple iPhone 15 Pro (256GB)', slug: 'apple-iphone-15-pro-256gb',
    description: 'The latest iPhone 15 Pro with A17 Pro chip, titanium design and a pro camera system.',
    brand_id: 'b1', category_id: 'c1', price: 1350000, compare_at_price: 1500000,
    stock_quantity: 12, sku: 'APL-IP15P-256', is_featured: true, is_new: false, is_active: true,
    rating_average: 4.8, rating_count: 24,
    images: [{ id: 'i1', product_id: 'p1', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Display: '6.1 inch OLED', Storage: '256GB', RAM: '8GB', Battery: '3274mAh', Chip: 'A17 Pro' },
    created_at: '2026-06-01', updated_at: '2026-06-01',
  },
  {
    id: 'p2', name: 'Samsung Galaxy S24 Ultra (512GB)', slug: 'samsung-galaxy-s24-ultra-512gb',
    description: 'Flagship Samsung with S Pen, 200MP camera and a stunning AMOLED display.',
    brand_id: 'b2', category_id: 'c1', price: 1180000, compare_at_price: 1290000,
    stock_quantity: 8, sku: 'SAM-S24U-512', is_featured: true, is_new: true, is_active: true,
    rating_average: 4.7, rating_count: 19,
    images: [{ id: 'i2', product_id: 'p2', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Display: '6.8 inch AMOLED', Storage: '512GB', RAM: '12GB', Battery: '5000mAh' },
    created_at: '2026-07-10', updated_at: '2026-07-10',
  },
  {
    id: 'p3', name: 'Apple AirPods Pro (2nd Gen)', slug: 'apple-airpods-pro-2nd-gen',
    description: 'Active noise cancellation, adaptive audio and a compact charging case.',
    brand_id: 'b1', category_id: 'c3', price: 195000, compare_at_price: 230000,
    stock_quantity: 30, sku: 'APL-APP2', is_featured: true, is_new: false, is_active: true,
    rating_average: 4.9, rating_count: 41,
    images: [{ id: 'i3', product_id: 'p3', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Type: 'In-ear TWS', ANC: 'Yes', Battery: '6hrs (30hrs with case)' },
    created_at: '2026-05-20', updated_at: '2026-05-20',
  },
  {
    id: 'p4', name: 'HP Pavilion 15 (i7, 16GB, 512GB SSD)', slug: 'hp-pavilion-15-i7-16gb-512gb',
    description: 'A powerful everyday laptop for work, study and light creative tasks.',
    brand_id: 'b4', category_id: 'c2', price: 620000, compare_at_price: null,
    stock_quantity: 3, sku: 'HP-PAV15-I7', is_featured: false, is_new: true, is_active: true,
    rating_average: 4.5, rating_count: 12,
    images: [{ id: 'i4', product_id: 'p4', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { CPU: 'Intel Core i7', RAM: '16GB', Storage: '512GB SSD', Screen: '15.6 inch FHD' },
    created_at: '2026-07-28', updated_at: '2026-07-28',
  },
  {
    id: 'p5', name: 'Sony WH-1000XM5 Headphones', slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    brand_id: 'b3', category_id: 'c3', price: 385000, compare_at_price: 420000,
    stock_quantity: 0, sku: 'SNY-WH1000XM5', is_featured: false, is_new: false, is_active: true,
    rating_average: 4.6, rating_count: 8,
    images: [{ id: 'i5', product_id: 'p5', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Type: 'Over-ear', ANC: 'Yes', Battery: '30hrs' },
    created_at: '2026-04-15', updated_at: '2026-04-15',
  },
  {
    id: 'p6', name: 'Anker 20,000mAh PowerCore Power Bank', slug: 'anker-20000mah-powercore',
    description: 'Fast-charging high capacity power bank for phones, tablets and more.',
    brand_id: 'b5', category_id: 'c4', price: 42000, compare_at_price: 55000,
    stock_quantity: 65, sku: 'ANK-PC20K', is_featured: false, is_new: true, is_active: true,
    rating_average: 4.4, rating_count: 33,
    images: [{ id: 'i6', product_id: 'p6', url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Capacity: '20,000mAh', Output: '22.5W Fast Charge' },
    created_at: '2026-08-02', updated_at: '2026-08-02',
  },
  {
    id: 'p7', name: 'Sony PlayStation 5 Slim', slug: 'sony-playstation-5-slim',
    description: 'Next-gen gaming console with ultra-fast SSD and stunning graphics.',
    brand_id: 'b3', category_id: 'c6', price: 850000, compare_at_price: 920000,
    stock_quantity: 5, sku: 'SNY-PS5-SLIM', is_featured: true, is_new: true, is_active: true,
    rating_average: 4.9, rating_count: 27,
    images: [{ id: 'i7', product_id: 'p7', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Storage: '1TB SSD', Resolution: 'Up to 4K/120fps' },
    created_at: '2026-08-10', updated_at: '2026-08-10',
  },
  {
    id: 'p8', name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6',
    description: 'Advanced health tracking and seamless smartphone integration.',
    brand_id: 'b2', category_id: 'c5', price: 275000, compare_at_price: 310000,
    stock_quantity: 14, sku: 'SAM-GW6', is_featured: false, is_new: false, is_active: true,
    rating_average: 4.3, rating_count: 16,
    images: [{ id: 'i8', product_id: 'p8', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', position: 0 }],
    specifications: { Display: '1.5 inch AMOLED', Battery: '425mAh', WaterResistance: '5ATM' },
    created_at: '2026-03-11', updated_at: '2026-03-11',
  },
]

export function withRelations(products: Product[]): Product[] {
  return products.map((p) => ({
    ...p,
    brand: mockBrands.find((b) => b.id === p.brand_id),
    category: mockCategories.find((c) => c.id === p.category_id),
  }))
}

