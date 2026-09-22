import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; product: Product; quantity: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: Math.min(i.quantity + action.quantity, i.product.stock_quantity || 99) }
              : i
          ),
        }
      }
      return { items: [...state.items, { product: action.product, quantity: action.quantity }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'SET_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

// NOTE: Cart state is kept in-memory (React state) for this demo. Browser
// storage (localStorage/sessionStorage) is intentionally not used here.
// For real persistence, wire this reducer up to a Supabase `cart_items`
// table keyed by the authenticated user's profile id.
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    return {
      items: state.items,
      addToCart: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QUANTITY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      subtotal,
      itemCount,
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
