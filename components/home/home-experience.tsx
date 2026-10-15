'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import useSWR from 'swr'
import { SearchX } from 'lucide-react'
import { FloatingCartBar } from '@/components/cart/floating-cart-bar'
import { FoodItemCard } from '@/components/food/food-item-card'
import { RestaurantCard } from '@/components/food/restaurant-card'
import { useLocation } from '@/components/providers/location-provider'
import { DELIVERY_RADIUS_KM } from '@/lib/config'
import { getDiscoveryFeed } from '@/lib/services/restaurants'
import type { Category } from '@/lib/types'
import { CategoryRail } from './category-rail'
import { FilterChips, type DiscoveryFilters } from './filter-chips'
import { Hero } from './hero'
import { SearchBar } from './search-bar'

const initialFilters: DiscoveryFilters = { vegOnly: false, topRated: false, fastDelivery: false, openNow: false }

export function HomeExperience({ categories }: { categories: Category[] }) {
  const { city } = useLocation()
  const { data, isLoading } = useSWR(['discovery', city.id], () => getDiscoveryFeed(city.center), {
    keepPreviousData: true,
  })

  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [filters, setFilters] = useState(initialFilters)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  const { restaurants, dishes, restaurantNames, restaurantOpen } = useMemo(() => {
    const feed = data ?? { restaurants: [], menuItems: [], hiddenOutsideRadius: 0 }
    const names = new Map(feed.restaurants.map((r) => [r.id, r.name]))
    const open = new Map(feed.restaurants.map((r) => [r.id, r.isOpen]))

    const filtered = feed.restaurants.filter((r) => {
      if (categoryId && !r.categoryIds.includes(categoryId)) return false
      if (filters.vegOnly && !r.isPureVeg) return false
      if (filters.topRated && r.rating < 4.3) return false
      if (filters.fastDelivery && r.deliveryTimeMins >= 30) return false
      if (filters.openNow && !r.isOpen) return false
      if (!deferredQuery) return true
      const haystack = [r.name, ...r.cuisines].join(' ').toLowerCase()
      return (
        haystack.includes(deferredQuery) ||
        feed.menuItems.some((m) => m.restaurantId === r.id && m.name.toLowerCase().includes(deferredQuery))
      )
    })
    const visibleIds = new Set(filtered.map((r) => r.id))

    const dishList = feed.menuItems.filter((m) => {
      if (!visibleIds.has(m.restaurantId)) return false
      if (filters.vegOnly && !m.isVeg) return false
      if (categoryId) return m.categoryId === categoryId
      if (deferredQuery) {
        return (
          m.name.toLowerCase().includes(deferredQuery) || names.get(m.restaurantId)!.toLowerCase().includes(deferredQuery)
        )
      }
      return m.isBestseller
    })

    return { restaurants: filtered, dishes: dishList.slice(0, 8), restaurantNames: names, restaurantOpen: open }
  }, [data, categoryId, filters, deferredQuery])

  const activeCategory = categories.find((c) => c.id === categoryId)
  const hasRefinement = Boolean(deferredQuery || categoryId || Object.values(filters).some(Boolean))

  const resetAll = () => {
    setQuery('')
    setCategoryId(null)
    setFilters(initialFilters)
  }

  return (
    <>
      <Hero cityName={city.name} search={<SearchBar value={query} onChange={setQuery} />} />
      <CategoryRail categories={categories} selectedId={categoryId} onSelect={setCategoryId} />

      <section aria-labelledby="dishes-title" className="mx-auto max-w-7xl px-4 pt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 id="dishes-title" className="text-xl font-bold sm:text-2xl">
            {activeCategory ? `${activeCategory.name} near you` : deferredQuery ? 'Matching dishes' : 'Popular dishes nearby'}
          </h2>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Demo menu</span>
        </div>
        {dishes.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {dishes.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                restaurantName={restaurantNames.get(item.restaurantId) ?? ''}
                restaurantOpen={restaurantOpen.get(item.restaurantId) ?? false}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No dishes match your filters.
          </p>
        )}
      </section>

      <section aria-labelledby="restaurants-title" className="mx-auto max-w-7xl px-4 pt-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="restaurants-title" className="text-xl font-bold sm:text-2xl">
                Restaurants delivering in {city.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                {isLoading && !data
                  ? 'Finding restaurants near you…'
                  : `${restaurants.length} demo restaurant${restaurants.length === 1 ? '' : 's'} within ${DELIVERY_RADIUS_KM} km`}
                {data && data.hiddenOutsideRadius > 0 && ` · ${data.hiddenOutsideRadius} hidden (outside ${DELIVERY_RADIUS_KM} km)`}
              </p>
            </div>
            {hasRefinement && (
              <button type="button" onClick={resetAll} className="text-sm font-semibold text-primary hover:underline">
                Clear all
              </button>
            )}
          </div>
          <FilterChips filters={filters} onToggle={(key) => setFilters((f) => ({ ...f, [key]: !f[key] }))} />
        </div>

        {isLoading && !data ? (
          <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-semibold">No restaurants match that</p>
            <p className="max-w-sm text-sm text-muted-foreground">Try a different dish or remove a filter.</p>
            <button type="button" onClick={resetAll} className="text-sm font-semibold text-primary hover:underline">
              Clear search and filters
            </button>
          </div>
        )}
      </section>

      <FloatingCartBar />
    </>
  )
}
