import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, IndianRupee, Leaf } from 'lucide-react'
import { FloatingCartBar } from '@/components/cart/floating-cart-bar'
import { DemoTag, RatingBadge } from '@/components/food/food-badges'
import { MenuItemRow } from '@/components/restaurant/menu-item-row'
import { SiteShell } from '@/components/site/site-shell'
import { DEMO_CATEGORIES } from '@/lib/demo/data'
import { formatINR } from '@/lib/format'
import { getMenuForRestaurant, getRestaurantById } from '@/lib/services/restaurants'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const restaurant = await getRestaurantById(id)
  return { title: restaurant ? `${restaurant.name} (demo)` : 'Restaurant not found' }
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params
  const restaurant = await getRestaurantById(id)
  if (!restaurant) notFound()
  const menu = await getMenuForRestaurant(id)

  const sections = DEMO_CATEGORIES.map((category) => ({
    category,
    items: menu.filter((m) => m.categoryId === category.id),
  })).filter((s) => s.items.length > 0)

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All restaurants
        </Link>

        <header className="mt-4 overflow-hidden rounded-3xl border bg-card shadow-xs">
          <div className="relative aspect-[16/7] bg-muted">
            <Image src={restaurant.image || '/placeholder.svg'} alt="" fill priority sizes="768px" className="object-cover" />
            <DemoTag className="absolute top-3 left-3" />
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{restaurant.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{restaurant.cuisines.join(' · ')}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <RatingBadge rating={restaurant.rating} className="text-sm" />
                <span className="text-xs text-muted-foreground">
                  {(restaurant.ratingCount / 1000).toFixed(1)}k demo ratings
                </span>
              </div>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-3 text-sm font-medium">
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {restaurant.deliveryTimeMins} min
              </li>
              <li className="inline-flex items-center gap-1.5">
                <IndianRupee className="size-4 text-primary" aria-hidden="true" />
                {formatINR(restaurant.costForTwo)} for two
              </li>
              {restaurant.isPureVeg && (
                <li className="inline-flex items-center gap-1.5 text-veg">
                  <Leaf className="size-4" aria-hidden="true" />
                  Pure veg
                </li>
              )}
            </ul>
            {restaurant.offer && (
              <p className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
                {restaurant.offer} <span className="font-normal text-muted-foreground">· demo offer, not redeemable</span>
              </p>
            )}
            {!restaurant.isOpen && (
              <p className="rounded-xl bg-muted px-3 py-2 text-sm font-medium">
                This restaurant is currently closed. You can browse the menu but not add items.
              </p>
            )}
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-8">
          {sections.map(({ category, items }) => (
            <section key={category.id} aria-labelledby={`menu-${category.id}`}>
              <h2 id={`menu-${category.id}`} className="text-lg font-bold">
                {category.name} <span className="text-sm font-medium text-muted-foreground">({items.length})</span>
              </h2>
              <ul className="mt-2 divide-y">
                {items.map((item) => (
                  <li key={item.id}>
                    <MenuItemRow item={item} restaurantName={restaurant.name} restaurantOpen={restaurant.isOpen} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <FloatingCartBar />
    </SiteShell>
  )
}
