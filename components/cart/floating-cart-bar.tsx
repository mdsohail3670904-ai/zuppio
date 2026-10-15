'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { formatINR } from '@/lib/format'

export function FloatingCartBar() {
  const { itemCount, subtotal, restaurantName } = useCart()
  if (itemCount === 0) return null
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 px-3 md:bottom-6">
      <Link
        href="/cart"
        className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-bold">
            {itemCount} item{itemCount === 1 ? '' : 's'} · {formatINR(subtotal)}
          </span>
          <span className="truncate text-xs opacity-90">From {restaurantName}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold">
          View cart
          <ShoppingBag className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </div>
  )
}
