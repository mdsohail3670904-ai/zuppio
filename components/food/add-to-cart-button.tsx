'use client'

import { Minus, Plus } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import type { MenuItem } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  item: MenuItem
  restaurantName: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ item, restaurantName, disabled, className }: Props) {
  const { quantityOf, addItem, decrement } = useCart()
  const quantity = quantityOf(item.id)

  if (disabled) {
    return (
      <span className={cn('inline-flex h-9 items-center rounded-lg border bg-muted px-3 text-xs font-semibold text-muted-foreground', className)}>
        Closed
      </span>
    )
  }

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(item, restaurantName)}
        className={cn(
          'inline-flex h-9 min-w-20 items-center justify-center gap-1 rounded-lg border border-primary/30 bg-card px-4 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
          className,
        )}
      >
        ADD
        <Plus className="size-3.5" aria-hidden="true" />
        <span className="sr-only">{item.name} to cart</span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex h-9 min-w-20 items-center justify-between rounded-lg bg-primary text-primary-foreground shadow-sm',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => decrement(item.id)}
        className="grid h-full w-8 place-items-center rounded-l-lg hover:bg-black/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Remove one ${item.name}`}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="min-w-5 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => addItem(item, restaurantName)}
        className="grid h-full w-8 place-items-center rounded-r-lg hover:bg-black/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Add one more ${item.name}`}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
