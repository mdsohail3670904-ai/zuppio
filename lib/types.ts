// Domain models shaped to map 1:1 onto future Firestore collections:
// cities, categories, restaurants, menuItems, orders, users.

export type GeoPoint = { lat: number; lng: number }

export type City = {
  id: string
  name: string
  state: string
  center: GeoPoint
}

export type Category = {
  id: string
  name: string
  image: string
}

export type Restaurant = {
  id: string
  name: string
  cuisines: string[]
  categoryIds: string[]
  rating: number
  ratingCount: number
  deliveryTimeMins: number
  costForTwo: number
  image: string
  isPureVeg: boolean
  isOpen: boolean
  offer?: string
  location: GeoPoint
}

export type RestaurantWithDistance = Restaurant & { distanceKm: number }

export type MenuItem = {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  isVeg: boolean
  image: string
  categoryId: string
  isBestseller?: boolean
}

export type CartLine = {
  item: MenuItem
  restaurantName: string
  quantity: number
}

export type UserRole = 'customer' | 'merchant' | 'admin'

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  customerId: string
  restaurantId: string
  lines: { menuItemId: string; name: string; price: number; quantity: number }[]
  subtotal: number
  deliveryFee: number
  taxes: number
  total: number
  status: OrderStatus
  deliveryLocation: GeoPoint
  razorpayOrderId?: string
  createdAt: string
}

export type DiscoveryFeed = {
  restaurants: RestaurantWithDistance[]
  menuItems: MenuItem[]
  hiddenOutsideRadius: number
}
