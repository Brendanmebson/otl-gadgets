import { useMutation } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Address, CartItem, Order } from '@/types'

interface CreateOrderInput {
  items: CartItem[]
  address: Address
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}

// Creates a "pending" order before payment, so the order record exists even
// if the customer abandons checkout at the Paystack step. Stock is only
// decremented after payment is verified server-side (see
// supabase/functions/verify-payment).
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: CreateOrderInput): Promise<Order> => {
      const order_items = input.items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        unit_price: i.product.price,
        subtotal: i.product.price * i.quantity,
      }))

      if (!isSupabaseConfigured || !supabase) {
        // Local simulation for the demo build
        return {
          id: `local-${Date.now()}`,
          customer_name: input.address.full_name,
          customer_email: input.address.email,
          items: order_items,
          subtotal: input.subtotal,
          delivery_fee: input.deliveryFee,
          discount: input.discount,
          total: input.total,
          payment_status: 'pending',
          order_status: 'pending',
          address: input.address,
          created_at: new Date().toISOString(),
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: input.address.full_name,
          customer_email: input.address.email,
          customer_phone: input.address.phone,
          subtotal: input.subtotal,
          delivery_fee: input.deliveryFee,
          discount: input.discount,
          total: input.total,
          payment_status: 'pending',
          order_status: 'pending',
          shipping_state: input.address.state,
          shipping_city: input.address.city,
          shipping_address: input.address.address,
        })
        .select()
        .single()
      if (error) throw error

      const { error: itemsError } = await supabase.from('order_items').insert(
        order_items.map((oi) => ({ ...oi, order_id: data.id }))
      )
      if (itemsError) throw itemsError

      return { ...data, items: order_items, address: input.address } as Order
    },
  })
}
