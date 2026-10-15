import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Customer"
      title="Create your account"
      description="Order from restaurants within 5 km of you, anywhere in India."
      image="/images/dishes/biryani.png"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="register" />
    </AuthLayout>
  )
}
