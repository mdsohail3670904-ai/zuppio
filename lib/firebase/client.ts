
'use client'

import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'zuppio-19d4e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: 'zuppio-19d4e.firebasestorage.app',
  messagingSenderId: '1007580368260',
  appId: '1:1007580368260:web:0ae5f9f9e58cbef954a1d1',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const phoneAuth = getAuth(app)
