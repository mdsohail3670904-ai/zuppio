'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Info, ShoppingBag, Trash2 } from 'lucide-react'
import { AddToCartButton } from '@/components/food/add-to-cart-button'
import { VegIndicator } from '@/components/food/food-badges'
import { useCart } from '@/components/providers/cart-provider'
import { useLocation } from '@/components/providers/location-provider'
import { buttonVariants } from '@/components/ui/button'
import { formatINR } from '@/lib/format'
import { calculateBill } from '@/lib/services/orders'
import type { PaymentAvailability } from '@/lib/services/payments'
import { cn } from '@/lib/utils'

export function CartView({ payment }: { payment: PaymentAvailability }) {
  const { lines, restaurantName, removeItem, clear } = useCart()
  const { city } = useLocation()
  const bill = calculateBill(lines)

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-7 text-primary" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="max-w-xs text-sm text-muted-foreground">Add some dishes from a restaurant near you to get started.</p>
        <Link href="/" className={cn(buttonVariants(), 'h-11 px-5')}>
          Browse restaurants
        </Link>
      </div>
    )
  }

  const billRows = [
    { label: 'Item total', value: bill.subtotal },
    { label: 'Delivery fee', value: bill.deliveryFee },
    { label: 'Platform fee', value: bill.platformFee },
    { label: 'GST (5%)', value: bill.taxes },
  ]

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <section aria-labelledby="cart-title" className="rounded-3xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 id="cart-title" className="text-2xl font-bold">
              Your cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              From <span className="font-semibold text-foreground">{restaurantName}</span> · delivering in {city.name}
            </p>
          </div>
          <button type="button" onClick={clear} className="text-sm font-semibold text-muted-foreground hover:text-destructive">
            Clear
          </button>
        </div>

        <ul className="mt-4 divide-y">
          {lines.map(({ item, restaurantName: name, quantity }) => (
            <li key={item.id} className="flex items-center gap-3 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={item.image || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <VegIndicator isVeg={item.isVeg} />
                  <span className="truncate">{item.name}</span>
                </p>
                <p className="text-sm text-muted-foreground">{formatINR(item.price * quantity)}</p>
              </div>
              <AddToCartButton item={item} restaurantName={name} />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside aria-labelledby="bill-title" className="flex flex-col gap-4 rounded-3xl border bg-card p-5 lg:sticky lg:top-24">
        <h2 id="bill-title" className="font-sans text-base font-bold">
          Bill details <span className="text-xs font-medium text-muted-foreground">(estimate)</span>
        </h2>
        <dl className="flex flex-col gap-2 text-sm">
          {billRows.map((row) => (
            <div key={row.label} className="flex justify-between">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="tabular-nums">{formatINR(row.value)}</dd>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold">
            <dt>To pay</dt>
            <dd className="tabular-nums">{formatINR(bill.total)}</dd>
          </div>
        </dl>

        {!payment.available && (
          <p role="note" className="flex gap-2 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {payment.reason}
          </p>
        )}

        <button
          type="button"
          disabled={!payment.available}
          className={cn(buttonVariants(), 'h-12 w-full text-base font-bold')}
        >
          Proceed to pay {formatINR(bill.total)}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Final prices will be verified on the server before payment.
        </p>
      </aside>
    </div>
  )
}
