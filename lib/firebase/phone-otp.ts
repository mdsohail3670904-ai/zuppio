
'use client'

export async function sendPhoneOtp(phoneNumber: string): Promise<void> {
  const mobile = phoneNumber.replace(/\D/g, '').slice(-10)

  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  mode: 'login' | 'register',
  name?: string,
): Promise<string> {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, code, mode, name }),
  })

  const raw = await response.text()

  let result: {
    success?: boolean
    customToken?: string
    error?: string
  }

  try {
    result = JSON.parse(raw)
  } catch {
    throw new Error(
      `Server returned an empty or invalid response (HTTP ${response.status}). Check Vercel logs.`,
    )
  }

  if (!response.ok || !result.success || !result.customToken) {
    throw new Error(
      result.error ?? `Verification failed (HTTP ${response.status}).`,
    )
  }

  return result.customToken
}
