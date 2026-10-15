import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth, isFirebaseConfigured } from '@/lib/firebase/admin'
import type { UserRole } from '@/lib/types'

export const SESSION_COOKIE = 'zuppio_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5

export type Session = {
  uid: string
  role: UserRole
  name?: string
  merchantId?: string
}

const LOGIN_PATH: Record<UserRole, string> = {
  customer: '/login',
  merchant: '/merchant/login',
  admin: '/admin/login',
}

export const HOME_PATH: Record<UserRole, string> = {
  customer: '/account',
  merchant: '/merchant/dashboard',
  admin: '/admin/dashboard',
}

export async function createSession(idToken: string) {
  const sessionCookie = await adminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  })
  const jar = await cookies()
  jar.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: true,
    // The v0 preview runs inside a cross-site iframe; production uses the stricter lax policy.
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSession() {
  const jar = await cookies()
  const value = jar.get(SESSION_COOKIE)?.value
  jar.delete(SESSION_COOKIE)
  if (value && isFirebaseConfigured()) {
    try {
      const { sub } = await adminAuth().verifySessionCookie(value)
      await adminAuth().revokeRefreshTokens(sub)
    } catch {
      // Cookie already invalid; nothing to revoke.
    }
  }
}

export async function getSession(): Promise<Session | null> {
  if (!isFirebaseConfigured()) return null
  const value = (await cookies()).get(SESSION_COOKIE)?.value
  if (!value) return null
  try {
    // checkRevoked=true also rejects accounts the admin has disabled.
    const claims = await adminAuth().verifySessionCookie(value, true)
    const role = claims.role as UserRole | undefined
    if (role !== 'customer' && role !== 'merchant' && role !== 'admin') return null
    return {
      uid: claims.uid,
      role,
      name: claims.name as string | undefined,
      merchantId: claims.merchantId as string | undefined,
    }
  } catch {
    return null
  }
}

export async function requireRole(role: UserRole): Promise<Session> {
  const session = await getSession()
  if (!session || session.role !== role) redirect(LOGIN_PATH[role])
  if (role === 'merchant' && !session.merchantId) redirect(LOGIN_PATH.merchant)
  return session
}
