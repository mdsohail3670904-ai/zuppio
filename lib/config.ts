// Integration flags read from public env vars. Each backend feature checks its
// flag and reports "not configured" instead of pretending to work.
export const integrations = {
  firebase: Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ),
  razorpay: Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
} as const

export const DEMO_MODE = !integrations.firebase

export const DELIVERY_RADIUS_KM = 5

export const pricing = {
  deliveryFee: 35,
  platformFee: 5,
  gstRate: 0.05,
} as const
