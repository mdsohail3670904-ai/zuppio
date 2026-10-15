import type { Metadata } from 'next'
import { CartView } from '@/components/cart/cart-view'
import { SiteShell } from '@/components/site/site-shell'
import { getPaymentAvailability } from '@/lib/services/payments'

export const metadata: Metadata = { title: 'Cart' }

export default function CartPage() {
  return (
    <SiteShell>
      <CartView payment={getPaymentAvailability()} />
    </SiteShell>
  )
}
