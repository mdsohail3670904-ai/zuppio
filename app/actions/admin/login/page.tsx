import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata: Metadata = { title: 'Admin login', robots: { index: false, follow: false } }

export default function AdminLoginPage() {
  return (
    <AuthLayout
      tone="staff"
      eyebrow="Restricted"
      title="Admin login"
      description="For authorised Zuppio operations staff only. Access is verified by role on the server."
      image="/images/dishes/masala-chai.png"
    >
      <AuthForm mode="signin" role="admin" />
    </AuthLayout>
  )
}
