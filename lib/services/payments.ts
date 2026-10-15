// Razorpay boundary. No payment is ever simulated.
// TODO(razorpay): a server route creates the Razorpay order with the SECRET key
// (never exposed to the client), recomputing the total from Firestore prices.
// The client opens Razorpay Checkout with the public key id, and a webhook
// verifies the signature before marking the order `placed`.
import { integrations } from '@/lib/config'

export type PaymentAvailability =
  | { available: true }
  | { available: false; reason: string }

export function getPaymentAvailability(): PaymentAvailability {
  if (!integrations.razorpay) {
    return {
      available: false,
      reason: 'Razorpay is not configured. Online payments are disabled in this preview and no money will be charged.',
    }
  }
  return {
    available: false,
    reason: 'Razorpay keys detected, but the checkout server route has not been implemented yet.',
  }
}
