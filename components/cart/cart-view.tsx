
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:py-20">
        <span className="grid size-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-7 text-primary" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold sm:text-2xl">
          Your cart is empty
        </h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Add some dishes from a restaurant near you to get started.
        </p>
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
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-4 px-3 py-4 sm:gap-6 sm:px-5 sm:py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-6">
      <section
        aria-labelledby="cart-title"
        className="min-w-0 rounded-2xl border bg-card p-3 sm:rounded-3xl sm:p-5"
      >
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h1 id="cart-title" className="text-xl font-bold sm:text-2xl">
              Your cart
            </h1>
            <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">
              From{' '}
              <span className="font-semibold text-foreground">
                {restaurantName}
              </span>{' '}
              · delivering in {city.name}
            </p>
          </div>

          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-destructive sm:text-sm"
          >
            Clear
          </button>
        </div>

        <ul className="mt-3 divide-y sm:mt-4">
          {lines.map(({ item, restaurantName: name, quantity }) => (
            <li
              key={item.id}
              className="flex min-w-0 flex-wrap items-center gap-2 py-3 sm:flex-nowrap sm:gap-3 sm:py-4"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-16 sm:rounded-xl">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 56px, 64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-center gap-1.5 text-sm font-semibold">
                  <VegIndicator isVeg={item.isVeg} />
                  <span className="break-words">{item.name}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {formatINR(item.price)} × {quantity} ={' '}
                  {formatINR(item.price * quantity)}
                </p>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0 sm:gap-2">
                <AddToCartButton
                  item={item}
                  restaurantName={name}
                  className="min-w-0"
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside
        aria-labelledby="bill-title"
        className="flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-4 sm:rounded-3xl sm:p-5 lg:sticky lg:top-24"
      >
        <h2 id="bill-title" className="text-base font-bold">
          Bill details{' '}
          <span className="text-xs font-medium text-muted-foreground">
            (estimate)
          </span>
        </h2>

        <dl className="flex flex-col gap-3 text-sm">
          {billRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="shrink-0 tabular-nums">
                {formatINR(row.value)}
              </dd>
            </div>
          ))}

          <div className="mt-1 flex justify-between gap-3 border-t pt-3 text-base font-bold">
            <dt>To pay</dt>
            <dd className="shrink-0 tabular-nums">
              {formatINR(bill.total)}
            </dd>
          </div>
        </dl>

        {!payment.available && (
          <p
            role="note"
            className="flex gap-2 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground"
          >
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{payment.reason}</span>
          </p>
        )}

        <button
          type="button"
          disabled={!payment.available}
          className={cn(
            buttonVariants(),
            'min-h-12 w-full whitespace-normal px-3 py-3 text-sm font-bold sm:text-base',
          )}
        >
          Proceed to pay {formatINR(bill.total)}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Final prices will be verified on the server before payment.
        </p>
      </aside>
    </div>
  )
}
