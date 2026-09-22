import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockProducts, mockCategories, mockBrands, withRelations } from '@/data/mockData'
import type { Product, ProductFilters, Category, Brand } from '@/types'

const PRODUCT_SELECT = `*, images:product_images(*), brand:brands(*), category:categories(*)`

function applyMockFilters(all: Product[], filters: ProductFilters) {
  let items = withRelations(all).filter((p) => p.is_active)

  if (filters.categorySlug) items = items.filter((p) => p.category?.slug === filters.categorySlug)
  if (filters.brandIds?.length) items = items.filter((p) => filters.brandIds!.includes(p.brand_id))
  if (filters.priceMin != null) items = items.filter((p) => p.price >= filters.priceMin!)
  if (filters.priceMax != null) items = items.filter((p) => p.price <= filters.priceMax!)
  if (filters.inStockOnly) items = items.filter((p) => p.stock_quantity > 0)
  if (filters.minRating) items = items.filter((p) => p.rating_average >= filters.minRating!)
  if (filters.onSaleOnly) items = items.filter((p) => !!p.compare_at_price && p.compare_at_price > p.price)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
    )
  }

  switch (filters.sort) {
    case 'newest':
      items = [...items].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      break
    case 'price_asc':
      items = [...items].sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      items = [...items].sort((a, b) => b.price - a.price)
      break
    case 'rating':
      items = [...items].sort((a, b) => b.rating_average - a.rating_average)
      break
    default:
      items = [...items].sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
  }

  const total = items.length
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 12
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total }
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return applyMockFilters(mockProducts, filters)
      }

      const page = filters.page ?? 1
      const pageSize = filters.pageSize ?? 12
      let query = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' }).eq('is_active', true)

      if (filters.categorySlug) query = query.eq('categories.slug', filters.categorySlug)
      if (filters.brandIds?.length) query = query.in('brand_id', filters.brandIds)
      if (filters.priceMin != null) query = query.gte('price', filters.priceMin)
      if (filters.priceMax != null) query = query.lte('price', filters.priceMax)
      if (filters.inStockOnly) query = query.gt('stock_quantity', 0)
      if (filters.search) query = query.ilike('name', `%${filters.search}%`)

      switch (filters.sort) {
        case 'newest': query = query.order('created_at', { ascending: false }); break
        case 'price_asc': query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'rating': query = query.order('rating_average', { ascending: false }); break
        default: query = query.order('is_featured', { ascending: false })
      }

      const start = (page - 1) * pageSize
      const { data, count, error } = await query.range(start, start + pageSize - 1)
      if (error) throw error
      return { items: (data ?? []) as Product[], total: count ?? 0 }
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return withRelations(mockProducts).find((p) => p.slug === slug) ?? null
      }
      const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('slug', slug).single()
      if (error) throw error
      return data as Product
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return withRelations(mockProducts).filter((p) => p.is_featured).slice(0, limit)
      }
      const { data, error } = await supabase
        .from('products').select(PRODUCT_SELECT).eq('is_featured', true).eq('is_active', true).limit(limit)
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ['new-arrivals', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return withRelations(mockProducts).filter((p) => p.is_new).slice(0, limit)
      }
      const { data, error } = await supabase
        .from('products').select(PRODUCT_SELECT).eq('is_new', true).eq('is_active', true)
        .order('created_at', { ascending: false }).limit(limit)
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useTopDeals(limit = 8) {
  return useQuery({
    queryKey: ['top-deals', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return withRelations(mockProducts)
          .filter((p) => p.compare_at_price && p.compare_at_price > p.price)
          .slice(0, limit)
      }
      const { data, error } = await supabase
        .from('products').select(PRODUCT_SELECT).eq('is_active', true)
        .not('compare_at_price', 'is', null).limit(limit)
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      if (!isSupabaseConfigured || !supabase) return mockCategories
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data as Category[]
    },
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async (): Promise<Brand[]> => {
      if (!isSupabaseConfigured || !supabase) return mockBrands
      const { data, error } = await supabase.from('brands').select('*').order('name')
      if (error) throw error
      return data as Brand[]
    },
  })
}
