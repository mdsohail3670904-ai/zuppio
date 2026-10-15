// Authentication boundary. Intentionally does NOT simulate success.
// TODO(firebase-auth): use signInWithEmailAndPassword / createUserWithEmailAndPassword,
// then verify the role via a custom claim (customer | merchant | admin) set by an
// admin-only Cloud Function. Merchant & admin roles must be enforced server-side.
import { integrations } from '@/lib/config'
import type { UserRole } from '@/lib/types'

export type AuthResult =
  | { ok: true }
  | { ok: false; code: 'not_configured' | 'invalid_input'; message: string }

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  code: 'not_configured',
  message:
    'Firebase Authentication is not connected yet. This is a UI preview — no account was created and nothing was sent.',
}

export type SignInInput = { email: string; password: string; role: UserRole }
export type RegisterInput = { name: string; email: string; phone: string; password: string }

export async function signIn(input: SignInInput): Promise<AuthResult> {
  if (!input.email || input.password.length < 6) {
    return { ok: false, code: 'invalid_input', message: 'Enter a valid email and a password of at least 6 characters.' }
  }
  if (!integrations.firebase) return NOT_CONFIGURED
  return NOT_CONFIGURED
}

export async function registerCustomer(input: RegisterInput): Promise<AuthResult> {
  if (!input.name || !input.email || !/^[6-9]\d{9}$/.test(input.phone) || input.password.length < 6) {
    return {
      ok: false,
      code: 'invalid_input',
      message: 'Check your details: a 10-digit Indian mobile number and a password of at least 6 characters are required.',
    }
  }
  if (!integrations.firebase) return NOT_CONFIGURED
  return NOT_CONFIGURED
}
