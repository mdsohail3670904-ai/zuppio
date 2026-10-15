'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine, MenuItem } from '@/lib/types'

type CartState = { lines: CartLine[] }

type CartAction =
  | { type: 'add'; item: MenuItem; restaurantName: string }
  | { type: 'decrement'; itemId: string }
  | { type: 'remove'; itemId: string }
  | { type: 'replace'; item: MenuItem; restaurantName: string }
  | { type: 'clear' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.item.id === action.item.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.item.id === action.item.id ? { ...l, quantity: Math.min(l.quantity + 1, 20) } : l,
          ),
        }
      }
      return { lines: [...state.lines, { item: action.item, restaurantName: action.restaurantName, quantity: 1 }] }
    }
    case 'decrement':
      return {
        lines: state.lines
          .map((l) => (l.item.id === action.itemId ? { ...l, quantity: l.quantity - 1 } : l))
          .filter((l) => l.quantity > 0),
      }
    case 'remove':
      return { lines: state.lines.filter((l) => l.item.id !== action.itemId) }
    case 'replace':
      return { lines: [{ item: action.item, restaurantName: action.restaurantName, quantity: 1 }] }
    case 'clear':
      return { lines: [] }
  }
}

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  restaurantName: string | null
  quantityOf: (itemId: string) => number
  addItem: (item: MenuItem, restaurantName: string) => void
  decrement: (itemId: string) => void
  removeItem: (itemId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// Cart is in-memory UI state for the preview. It will sync to a Firestore
// `carts/{uid}` document once authentication is wired up.
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] })

  const addItem = useCallback(
    (item: MenuItem, restaurantName: string) => {
      const currentRestaurant = state.lines[0]?.item.restaurantId
      if (currentRestaurant && currentRestaurant !== item.restaurantId) {
        const confirmed = window.confirm(
          `Your cart has items from ${state.lines[0].restaurantName}. Start a new cart with ${restaurantName}?`,
        )
        if (confirmed) dispatch({ type: 'replace', item, restaurantName })
        return
      }
      dispatch({ type: 'add', item, restaurantName })
    },
    [state.lines],
  )

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((n, l) => n + l.quantity, 0)
    const subtotal = state.lines.reduce((n, l) => n + l.quantity * l.item.price, 0)
    return {
      lines: state.lines,
      itemCount,
      subtotal,
      restaurantName: state.lines[0]?.restaurantName ?? null,
      quantityOf: (id) => state.lines.find((l) => l.item.id === id)?.quantity ?? 0,
      addItem,
      decrement: (itemId) => dispatch({ type: 'decrement', itemId }),
      removeItem: (itemId) => dispatch({ type: 'remove', itemId }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state.lines, addItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
