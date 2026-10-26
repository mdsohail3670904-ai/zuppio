import { NextResponse } from 'next/server'

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

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Enter a valid mobile number.' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Enter the 6-digit OTP.' },
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
        body: JSON.stringify({
          phone: `+91${mobile}`,
          code,
        }),
        cache: 'no-store',
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'OTP is incorrect or expired. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'OTP verified successfully.',
      identityId: result.identity_id ?? null,
    })
  } catch {
    return NextResponse.json(
      { error: 'OTP verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
