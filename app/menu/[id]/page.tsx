
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AddToCartButton } from '@/components/food/add-to-cart-button'
import { SiteShell } from '@/components/site/site-shell'
import { formatINR } from '@/lib/format'
import { getMenuForRestaurant, getRestaurantById } from '@/lib/services/restaurants'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const items = await getMenuForRestaurant(
    (await import('@/lib/demo/data')).DEMO_MENU_ITEMS.find((item) => item.id === id)?.restaurantId ?? ''
  )
  const item = items.find((entry) => entry.id === id)
  return { title: item ? `${item.name} | Zuppio` : 'Dish not found | Zuppio' }
}

export default async function MenuItemPage({ params }: Props) {
  const { id } = await params
  const { DEMO_MENU_ITEMS } = await import('@/lib/demo/data')
  const item = DEMO_MENU_ITEMS.find((entry) => entry.id === id)

  if (!item) notFound()

  const restaurant = await getRestaurantById(item.restaurantId)

  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-4 py-6 pb-24">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to menu
        </Link>

        <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src={item.image || '/placeholder.svg'}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 p-5 sm:p-7">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">{item.name}</h1>
              <p className="mt-2 text-xl font-bold text-primary">{formatINR(item.price)}</p>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {item.description || 'Freshly prepared and ready to order.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border px-3 py-1">
                {item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
              </span>
              {item.isBestseller && (
                <span className="rounded-full bg-secondary px-3 py-1 font-semibold">
                  Bestseller
                </span>
              )}
            </div>

            {restaurant && (
              <p className="text-sm text-muted-foreground">
                Restaurant: {restaurant.name}
              </p>
            )}

            <AddToCartButton
              item={item}
              restaurantName={restaurant?.name ?? 'Restaurant'}
              disabled={!restaurant?.isOpen}
              className="h-11 w-full"
            />
          </div>
        </article>
      </main>
    </SiteShell>
  )
}
