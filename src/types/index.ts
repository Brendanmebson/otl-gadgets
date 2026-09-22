export interface Brand {
  id: string
  name: string
  slug: string
  logo_url?: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string | null
  product_count?: number
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  position: number
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string // e.g. "256GB / Black"
  price_override?: number | null
  stock_quantity: number
  sku: string
}

export interface Review {
  id: string
  product_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  brand_id: string
  brand?: Brand
  category_id: string
  category?: Category
  price: number
  compare_at_price?: number | null
  stock_quantity: number
  sku: string
  is_featured: boolean
  is_new: boolean
  is_active: boolean
  rating_average: number
  rating_count: number
  images: ProductImage[]
  variants?: ProductVariant[]
  specifications?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  variantId?: string
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Address {
  full_name: string
  phone: string
  email: string
  state: string
  city: string
  address: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: OrderStatus
  address: Address
  created_at: string
}

export interface Coupon {
  code: string
  discount_percent: number
  active: boolean
  expires_at?: string
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'

export interface ProductFilters {
  categorySlug?: string
  brandIds?: string[]
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  minRating?: number
  onSaleOnly?: boolean
  search?: string
  sort?: SortOption
  page?: number
  pageSize?: number
}
