
import 'server-only'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY

const privateKey = rawPrivateKey
  ?.replace(/^["']|["']$/g, '')
  .replace(/\\n/g, '\n')
  .replace(/\r\n/g, '\n')
  .trim()

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
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured')
  }

  const existingApp = getApps().find((app) => app.name === '[DEFAULT]')
  if (existingApp) return existingApp

  if (!privateKey?.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('FIREBASE_PRIVATE_KEY is missing or has an invalid format')
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

export const adminAuth = () => getAuth(adminApp())
export const adminDb = () => getFirestore(adminApp())
