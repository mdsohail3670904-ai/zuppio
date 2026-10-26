'use client'

export async function sendPhoneOtp(
  phoneNumber: string,
): Promise<void> {
  const mobile = phoneNumber.replace(/\D/g, '').slice(-10)

  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobile }),
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.error ?? 'Could not send OTP.')
  }
}

export async function verifyPhoneOtp(
  mobile: string,
  code: string,
): Promise<boolean> {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobile, code }),
  })

  const result = await response.json()

  if (!response.ok || !result.verified) {
    throw new Error(result.error ?? 'OTP verification failed.')
  }

  return true
}
