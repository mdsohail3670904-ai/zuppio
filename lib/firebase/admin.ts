import 'server-only'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Server-only credentials. FIREBASE_PRIVATE_KEY must never be exposed to the client.
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const webApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

export function isFirebaseConfigured() {
  return Boolean(projectId && clientEmail && privateKey && webApiKey)
}

export function missingFirebaseEnv() {
  return [
    ['NEXT_PUBLIC_FIREBASE_API_KEY', webApiKey],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId],
    ['FIREBASE_CLIENT_EMAIL', clientEmail],
    ['FIREBASE_PRIVATE_KEY', privateKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name as string)
}

function adminApp(): App {
  if (!isFirebaseConfigured()) throw new Error('Firebase is not configured')
  return getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export const adminAuth = () => getAuth(adminApp())
export const adminDb = () => getFirestore(adminApp())
