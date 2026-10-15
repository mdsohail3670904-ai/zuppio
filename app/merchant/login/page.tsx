import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata: Metadata = { title: 'Merchant login', robots: { index: false } }

export default function MerchantLoginPage() {
  return (
    <AuthLayout
      tone="staff"
      eyebrow="Zuppio for Restaurants"
      title="Merchant login"
      description="Manage your menu, opening hours and incoming orders."
      image="/images/dishes/tandoori.png"
      footer={
        <>
          Merchant accounts are approved by Zuppio. Not a merchant?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Customer sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="signin" role="merchant" />
    </AuthLayout>
  )
}
