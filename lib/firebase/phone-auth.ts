
import 'server-only'

import { adminAuth, adminDb, isFirebaseConfigured } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function verifyPhoneIdToken(idToken: string) {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured')
  }

  if (!idToken || idToken.length > 10_000) {
    throw new Error('Invalid authentication token')
  }

  const decoded = await adminAuth().verifyIdToken(idToken, true)

  if (!decoded.phone_number || !decoded.uid) {
    throw new Error('Phone number verification required')
  }

  return {
    uid: decoded.uid,
    phoneNumber: decoded.phone_number,
  }
}

export async function ensureCustomerProfile(
  uid: string,
  phoneNumber: string,
  name?: string,
) {
  const userRef = adminDb().collection('customers').doc(uid)
  const existing = await userRef.get()

  if (!existing.exists) {
    if (!name || name.trim().length < 2) {
      throw new Error('Full name is required for registration')
    }

    await userRef.set({
      name: name.trim().slice(0, 80),
      mobile: phoneNumber,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    })

    await adminAuth().setCustomUserClaims(uid, { role: 'customer' })
  }

  const profile = await userRef.get()
  return profile.data()
}
