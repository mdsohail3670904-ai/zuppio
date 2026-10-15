import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Customer"
      title="Welcome back"
      description="Sign in to track orders, save addresses and reorder your favourites."
      image="/images/dishes/thali.png"
      footer={
        <>
          New to Zuppio?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="signin" role="customer" />
    </AuthLayout>
  )
}
