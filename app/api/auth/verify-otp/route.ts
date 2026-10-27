
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { customerLoginEmail } from '@/lib/auth/identifiers'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.MINIMOTH_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OTP service is not configured.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const mobile = String(body.mobile ?? '').replace(/\D/g, '')
    const code = String(body.code ?? '').trim()
    const mode = body.mode === 'register' ? 'register' : 'login'
    const name = String(body.name ?? '').trim()
    const phone = `+91${mobile}`

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Enter the 6-digit OTP.' },
        { status: 400 }
      )
    }

    if (mode === 'register' && name.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      'https://api.minimoth.dev/v1/otp/verify',
      {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'OTP is incorrect or expired. Please try again.' },
        { status: 400 }
      )
    }

    const auth = adminAuth()
    const db = adminDb()
    let user

    try {
      user = await auth.getUserByPhoneNumber(phone)
    } catch (error) {
      const code = (error as { code?: string }).code

      if (code !== 'auth/user-not-found') {
        throw error
      }
    }

    if (mode === 'register') {
      if (user) {
        return NextResponse.json(
          { error: 'An account already exists for this mobile number. Please log in.' },
          { status: 409 }
        )
      }

      user = await auth.createUser({
        phoneNumber: phone,
        email: customerLoginEmail(mobile),
        displayName: name,
      })

      await db.collection('customers').doc(user.uid).set({
        uid: user.uid,
        name,
        phone: mobile,
        phoneNumber: phone,
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString(),
      })
    } else {
      if (!user) {
        return NextResponse.json(
          { error: 'No customer account found. Please register first.' },
          { status: 404 }
        )
      }

      const profile = await db.collection('customers').doc(user.uid).get()

      if (!profile.exists || profile.data()?.role !== 'customer') {
        return NextResponse.json(
          { error: 'Customer account not found. Please register first.' },
          { status: 404 }
        )
      }

      if (user.customClaims?.role && user.customClaims.role !== 'customer') {
        return NextResponse.json(
          { error: 'This mobile number cannot be used for customer login.' },
          { status: 403 }
        )
      }
    }

    await auth.setCustomUserClaims(user.uid, {
      ...user.customClaims,
      role: 'customer',
    })

    const customToken = await auth.createCustomToken(user.uid, {
      role: 'customer',
    })

    return NextResponse.json(
      { success: true, verified: true, customToken },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('MiniMoth OTP verification error:', error)

    return NextResponse.json(
      { error: 'OTP verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
