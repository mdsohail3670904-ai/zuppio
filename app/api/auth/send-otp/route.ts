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

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit mobile number.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      'https://api.minimoth.dev/v1/otp/send',
      {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: `+91${mobile}` }),
        cache: 'no-store',
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error ?? 'Could not send OTP.' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully.',
      otpId: result.otp_id,
    })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
