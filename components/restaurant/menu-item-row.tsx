import Image from 'next/image'
import { AddToCartButton } from '@/components/food/add-to-cart-button'
import { VegIndicator } from '@/components/food/food-badges'
import { formatINR } from '@/lib/format'
import type { MenuItem } from '@/lib/types'

type Props = { item: MenuItem; restaurantName: string; restaurantOpen: boolean }

export function MenuItemRow({ item, restaurantName, restaurantOpen }: Props) {
  return (
    <article className="flex gap-4 py-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <VegIndicator isVeg={item.isVeg} />
          {item.isBestseller && <span className="text-xs font-bold text-primary">Bestseller</span>}
        </div>
        <h3 className="font-sans text-base font-semibold">{item.name}</h3>
        <p className="text-sm font-semibold">{formatINR(item.price)}</p>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
      </div>
      <div className="relative flex w-28 shrink-0 flex-col items-center sm:w-36">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={item.image || '/placeholder.svg'} alt={item.name} fill sizes="144px" className="object-cover" />
        </div>
        <AddToCartButton
          item={item}
          restaurantName={restaurantName}
          disabled={!restaurantOpen}
          className="-mt-5 w-24"
        />
      </div>
    </article>
  )
}
