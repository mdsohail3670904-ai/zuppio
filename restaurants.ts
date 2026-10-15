// Restaurant & menu data access. Every function is async so the Firestore
// implementation can drop in without changing callers.
// TODO(firestore): query `restaurants` by geohash bounds (see lib/geo.ts boundingBox),
// then refine with haversineKm; read `menuItems` where restaurantId in [...].
import { DELIVERY_RADIUS_KM } from '@/lib/config'
import {
  DEMO_CATEGORIES,
  DEMO_CITIES,
  DEMO_MENU_ITEMS,
  buildDemoRestaurants,
} from '@/lib/demo/data'
import { haversineKm } from '@/lib/geo'
import type { Category, DiscoveryFeed, GeoPoint, MenuItem, Restaurant } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  return DEMO_CATEGORIES
}

export async function getDiscoveryFeed(
  center: GeoPoint,
  radiusKm: number = DELIVERY_RADIUS_KM,
): Promise<DiscoveryFeed> {
  const all = buildDemoRestaurants(center).map((r) => ({
    ...r,
    distanceKm: haversineKm(center, r.location),
  }))
  const restaurants = all
    .filter((r) => r.distanceKm <= radiusKm)
    .sort((a, b) => Number(b.isOpen) - Number(a.isOpen) || a.distanceKm - b.distanceKm)
  const ids = new Set(restaurants.map((r) => r.id))

  return {
    restaurants,
    menuItems: DEMO_MENU_ITEMS.filter((item) => ids.has(item.restaurantId)),
    hiddenOutsideRadius: all.length - restaurants.length,
  }
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  return buildDemoRestaurants(DEMO_CITIES[0].center).find((r) => r.id === id) ?? null
}

export async function getMenuForRestaurant(restaurantId: string): Promise<MenuItem[]> {
  return DEMO_MENU_ITEMS.filter((item) => item.restaurantId === restaurantId)
}
