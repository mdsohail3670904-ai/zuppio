'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { redirect } from 'next/navigation'
import type { z } from 'zod'
import {
  customerLoginEmail,
  merchantLoginEmail,
  toE164India,
} from '@/lib/auth/identifiers'
import {
  adminLoginSchema,
  customerLoginSchema,
  customerRegisterSchema,
  merchantLoginSchema,
} from '@/lib/auth/schemas'
import {
  clearSession,
  createSession,
  HOME_PATH,
} from '@/lib/auth/session'
import {
  adminAuth,
  adminDb,
  isFirebaseConfigured,
} from '@/lib/firebase/admin'
import { passwordSignIn } from '@/lib/firebase/password-sign-in'
import type { UserRole } from '@/lib/types'

export type AuthFormState = {
  status: 'idle' | 'error' | 'not_configured'
  message?: string
  fieldErrors?: Record<string, string>
  values?: Record<string, string>
}

const NOT_CONFIGURED: AuthFormState = {
  status: 'not_configured',
  message:
    'Firebase is not connected yet. Add the Firebase credentials in project settings.',
}

const GENERIC_CREDENTIALS_ERROR =
  'Incorrect login details. Please check and try again.'

function readForm(formData: FormData, keys: string[]) {
  return Object.fromEntries(
    keys.map((key) => [key, String(formData.get(key) ?? '')]),
  )
}

function safeValues(raw: Record<string, string>) {
  const { password: _password, confirmPassword: _confirm, ...rest } = raw
  return rest
}

function validationError(
  error: z.ZodError,
  raw: Record<string, string>,
): AuthFormState {
  const fieldErrors: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = String(issue.path[0])
    fieldErrors[key] ??= issue.message
  }

  return {
    status: 'error',
    fieldErrors,
    values: safeValues(raw),
  }
}

async function signInWithRole(
  loginEmail: string,
  password: string,
  role: UserRole,
  raw: Record<string, string>,
): Promise<AuthFormState | null> {
  const result = await passwordSignIn(loginEmail, password)

  if (!result.ok) {
    const message =
      result.reason === 'disabled'
        ? 'This account has been suspended. Please contact Zuppio support.'
        : result.reason === 'rate_limited'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : result.reason === 'invalid_credentials'
            ? GENERIC_CREDENTIALS_ERROR
            : 'Sign-in is unavailable right now. Please try again.'

    return {
      status: 'error',
      message,
      values: safeValues(raw),
    }
  }

  const decoded = await adminAuth().verifyIdToken(result.idToken, true)

  if (
    decoded.role !== role ||
    (role === 'merchant' && !decoded.merchantId)
  ) {
    return {
      status: 'error',
      message: GENERIC_CREDENTIALS_ERROR,
      values: safeValues(raw),
    }
  }

  await createSession(result.idToken)
  return null
}

/* Existing password-based registration action */
export async function registerCustomerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = readForm(formData, [
    'name',
    'mobile',
    'password',
    'confirmPassword',
  ])

  const parsed = customerRegisterSchema.safeParse(raw)

  if (!parsed.success) return validationError(parsed.error, raw)

  if (!isFirebaseConfigured()) {
    return { ...NOT_CONFIGURED, values: safeValues(raw) }
  }

  const { name, mobile, password } = parsed.data
  const auth = adminAuth()

  let uid: string

  try {
    const user = await auth.createUser({
      email: customerLoginEmail(mobile),
      phoneNumber: toE164India(mobile),
      password,
      displayName: name,
    })

    uid = user.uid
  } catch (error) {
    const code = (error as { code?: string }).code

    if (
      code === 'auth/email-already-exists' ||
      code === 'auth/phone-number-already-exists'
    ) {
      return {
        status: 'error',
        message:
          'An account with this mobile number already exists. Please log in instead.',
        values: safeValues(raw),
      }
    }

    return {
      status: 'error',
      message: 'Could not create your account. Please try again.',
      values: safeValues(raw),
    }
  }

  try {
    await auth.setCustomUserClaims(uid, { role: 'customer' })

    await adminDb().collection('customers').doc(uid).set({
      name,
      mobile: toE164India(mobile),
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    })
  } catch {
    await auth.deleteUser(uid).catch(() => {})

    return {
      status: 'error',
      message: 'Could not create your account. Please try again.',
      values: safeValues(raw),
    }
  }

  const failure = await signInWithRole(
    customerLoginEmail(mobile),
    password,
    'customer',
    raw,
  )

  if (failure) return failure

  redirect(HOME_PATH.customer)
}

/* Existing password-based customer login action */
export async function customerLoginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = readForm(formData, ['mobile', 'password'])
  const parsed = customerLoginSchema.safeParse(raw)

  if (!parsed.success) return validationError(parsed.error, raw)

  if (!isFirebaseConfigured()) {
    return { ...NOT_CONFIGURED, values: safeValues(raw) }
  }

  const failure = await signInWithRole(
    customerLoginEmail(parsed.data.mobile),
    parsed.data.password,
    'customer',
    raw,
  )

  if (failure) return failure

  redirect(HOME_PATH.customer)
}

/* Merchant password login remains separate */
export async function merchantLoginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = readForm(formData, ['merchantId', 'password'])
  const parsed = merchantLoginSchema.safeParse(raw)

  if (!parsed.success) return validationError(parsed.error, raw)

  if (!isFirebaseConfigured()) {
    return { ...NOT_CONFIGURED, values: safeValues(raw) }
  }

  const failure = await signInWithRole(
    merchantLoginEmail(parsed.data.merchantId),
    parsed.data.password,
    'merchant',
    raw,
  )

  if (failure) return failure

  redirect(HOME_PATH.merchant)
}

/* Admin password login remains separate */
export async function adminLoginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = readForm(formData, ['email', 'password'])
  const parsed = adminLoginSchema.safeParse(raw)

  if (!parsed.success) return validationError(parsed.error, raw)

  if (!isFirebaseConfigured()) {
    return { ...NOT_CONFIGURED, values: safeValues(raw) }
  }

  const failure = await signInWithRole(
    parsed.data.email,
    parsed.data.password,
    'admin',
    raw,
  )

  if (failure) return failure

  redirect(HOME_PATH.admin)
}

/* Verify the Firebase phone sign-in and create/check customer profile */
export async function completeCustomerPhoneAuth(
  idToken: string,
  name: string,
  mode: 'login' | 'register',
): Promise<{ ok: boolean; message?: string }> {
  try {
    if (!isFirebaseConfigured()) {
      return { ok: false, message: 'Firebase is not configured.' }
    }

    if (!idToken || idToken.length > 10000) {
      return { ok: false, message: 'Invalid authentication token.' }
    }

    const auth = adminAuth()
    const decoded = await auth.verifyIdToken(idToken, true)

    if (
      !decoded.uid ||
      !decoded.phone_number ||
      decoded.firebase?.sign_in_provider !== 'phone'
    ) {
      return {
        ok: false,
        message: 'Please verify your mobile number using OTP.',
      }
    }

    const userRef = adminDb().collection('customers').doc(decoded.uid)
    const existing = await userRef.get()

    if (mode === 'login' && !existing.exists) {
      return {
        ok: false,
        message: 'Account not found. Please register first.',
      }
    }

    if (mode === 'register' && existing.exists) {
      return {
        ok: false,
        message: 'Account already exists. Please log in.',
      }
    }

    if (existing.exists && existing.data()?.status !== 'active') {
      return {
        ok: false,
        message: 'This customer account is inactive. Please contact support.',
      }
    }

    if (mode === 'register') {
      const cleanName = name.trim()

      if (cleanName.length < 2 || cleanName.length > 80) {
        return { ok: false, message: 'Enter your full name.' }
      }

      await auth.setCustomUserClaims(decoded.uid, {
        ...decoded,
        role: 'customer',
      })

      await userRef.set({
        name: cleanName,
        mobile: decoded.phone_number,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
      })
    } else {
      await auth.setCustomUserClaims(decoded.uid, {
        ...decoded,
        role: 'customer',
      })
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      message: 'OTP verification failed. Please try again.',
    }
  }
}

/* Create the secure server session after refreshing the Firebase token */

export async function createCustomerPhoneSession(idToken: string) {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured.')
  }

  if (!idToken || idToken.length > 10000) {
    throw new Error('Invalid authentication token.')
  }

  const auth = adminAuth()
  const decoded = await auth.verifyIdToken(idToken, true)

  if (decoded.role !== 'customer') {
    throw new Error('Customer authentication required.')
  }

  const user = await auth.getUser(decoded.uid)

  if (!user.phoneNumber) {
    throw new Error('Customer phone number not found.')
  }

  const customer = await adminDb()
    .collection('customers')
    .doc(decoded.uid)
    .get()

  if (
    !customer.exists ||
    customer.data()?.role !== 'customer' ||
    customer.data()?.status !== 'active'
  ) {
    throw new Error('Customer account not found or inactive.')
  }

  await createSession(idToken)
  redirect(HOME_PATH.customer)
}


/* Logout */
export async function logoutAction(formData: FormData) {
  const destination = String(formData.get('redirectTo') ?? '/')

  await clearSession()

  redirect(
    destination.startsWith('/') && !destination.startsWith('//')
      ? destination
      : '/',
  )
}
