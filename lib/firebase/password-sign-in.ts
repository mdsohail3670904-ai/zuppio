import 'server-only'

// Verifies a password against Firebase Auth from the server (Identity Toolkit REST API).
// Firebase hashes and stores passwords; Zuppio never stores or logs them.
export type PasswordSignInResult =
  | { ok: true; idToken: string }
  | { ok: false; reason: 'invalid_credentials' | 'disabled' | 'rate_limited' | 'unknown' }

export async function passwordSignIn(email: string, password: string): Promise<PasswordSignInResult> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      cache: 'no-store',
    },
  )
  const body = (await res.json()) as { idToken?: string; error?: { message?: string } }
  if (res.ok && body.idToken) return { ok: true, idToken: body.idToken }

  const code = body.error?.message ?? ''
  if (code.startsWith('USER_DISABLED')) return { ok: false, reason: 'disabled' }
  if (code.startsWith('TOO_MANY_ATTEMPTS')) return { ok: false, reason: 'rate_limited' }
  if (/INVALID_LOGIN_CREDENTIALS|INVALID_PASSWORD|EMAIL_NOT_FOUND|INVALID_EMAIL/.test(code)) {
    return { ok: false, reason: 'invalid_credentials' }
  }
  return { ok: false, reason: 'unknown' }
}
