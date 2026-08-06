import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.AUTH_URL || 'https://mrrawtravel.com'}/api/auth/callback/google`

  if (!clientId) {
    return NextResponse.json({
      success: false,
      error: 'Google Sign-In is pending credentials configuration. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment variables.'
    }, { status: 400 })
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline`

  return NextResponse.redirect(googleAuthUrl)
}
