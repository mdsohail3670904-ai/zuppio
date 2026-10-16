
import Image from 'next/image'
import Link from 'next/link'
import { formatINR } from '@/lib/format'
import type { MenuItem } from '@/lib/types'
import { AddToCartButton } from './add-to-cart-button'
import { VegIndicator } from './food-badges'

type Props = {
  item: MenuItem
  restaurantName: string
  restaurantOpen: boolean
}

export function FoodItemCard({ item, restaurantName, restaurantOpen }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs">
      <Link
        href={`/menu/${item.id}`}
        aria-label={`View details for ${item.name}`}
        className="block"
      >
        <div className="relative aspect-square bg-muted">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
          {item.isBestseller && (
            <span className="absolute top-2 left-2 rounded-full bg-card px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
              Bestseller
            </span>
          )}
        </div>
        <div className="px-3 pt-3">
          <h3 className="font-sans text-sm leading-snug font-semibold text-pretty hover:text-primary">
            {item.name}
          </h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 pt-1">
        <Link
          href={`/restaurants/${item.restaurantId}`}
          className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          {restaurantName}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-bold">{formatINR(item.price)}</span>
          <AddToCartButton
            item={item}
            restaurantName={restaurantName}
            disabled={!restaurantOpen}
            className="h-8 min-w-16 px-2.5 text-xs"
          />
        </div>
      </div>
    </article>
  )
}
