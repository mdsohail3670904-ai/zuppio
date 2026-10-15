// Notifications boundary.
// TODO(fcm): web uses Firebase Cloud Messaging; the Android APK uses
// @capacitor/push-notifications. Tokens stored per user in Firestore, and a
// Cloud Function sends on order status changes.
export type NotificationSupport = { supported: false; reason: string }

export function getNotificationSupport(): NotificationSupport {
  return { supported: false, reason: 'Push notifications are not configured yet.' }
}
