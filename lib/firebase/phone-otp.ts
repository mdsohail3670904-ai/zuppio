'use client'

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { phoneAuth } from '@/lib/firebase/client'

let recaptchaVerifier: RecaptchaVerifier | null = null

export function setupPhoneRecaptcha(containerId: string) {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
  }

  recaptchaVerifier = new RecaptchaVerifier(phoneAuth, containerId, {
    size: 'invisible',
  })

  return recaptchaVerifier
}

export async function sendPhoneOtp(
  phoneNumber: string,
): Promise<ConfirmationResult> {
  const verifier = setupPhoneRecaptcha('phone-recaptcha')
  return signInWithPhoneNumber(phoneAuth, phoneNumber, verifier)
}
