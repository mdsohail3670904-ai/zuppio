// Firebase email/password auth needs an email, so customers (mobile number) and
// merchants (Merchant ID) are mapped to internal, non-deliverable login emails.
// These addresses are never shown to users or used for messaging.
const CUSTOMER_DOMAIN = 'customers.zuppio.internal'
const MERCHANT_DOMAIN = 'merchants.zuppio.internal'

export const customerLoginEmail = (mobile10: string) => `91${mobile10}@${CUSTOMER_DOMAIN}`
export const merchantLoginEmail = (merchantId: string) => `${merchantId.toLowerCase()}@${MERCHANT_DOMAIN}`
export const toE164India = (mobile10: string) => `+91${mobile10}`
