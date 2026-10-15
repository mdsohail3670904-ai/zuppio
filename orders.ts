// Order lifecycle boundary for customers, merchants and admins.
// TODO(firestore): `orders` collection; merchants subscribe via onSnapshot to
// orders where restaurantId == their restaurant; status transitions validated
// by security rules or a Cloud Function.
import { pricing } from '@/lib/config'
import type { CartLine, OrderStatus } from '@/lib/types'

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending_payment',
  'placed',
  'accepted',
  'preparing',
  'out_for_delivery',
  'delivered',
]

export function calculateBill(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0)
  const deliveryFee = subtotal > 0 ? pricing.deliveryFee : 0
  const platformFee = subtotal > 0 ? pricing.platformFee : 0
  const taxes = Math.round(subtotal * pricing.gstRate)
  return { subtotal, deliveryFee, platformFee, taxes, total: subtotal + deliveryFee + platformFee + taxes }
}
