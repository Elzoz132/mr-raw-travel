import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const clientId = process.env.APPLE_CLIENT_ID
  const redirectUri = `${process.env.AUTH_URL || 'https://mrrawtravel.com'}/api/auth/callback/apple`

  if (!clientId) {
    return NextResponse.json({
      success: false,
      error: 'Sign in with Apple is pending developer configuration. Please add APPLE_CLIENT_ID and APPLE_CLIENT_SECRET to environment variables.'
    }, { status: 400 })
  }

  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code%20id_token&scope=name%20email&response_mode=form_post`

  return NextResponse.redirect(appleAuthUrl)
}
