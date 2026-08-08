import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({
      success: false,
      error: 'Google Sign-In credentials missing. Please set GOOGLE_CLIENT_ID in environment variables.'
    }, { status: 400 })
  }

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'mrrawtravel.com'
  const protoHeader = req.headers.get('x-forwarded-proto')
  const protocol = protoHeader ? protoHeader : (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
  
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl.replace(/\/$/, '')}/api/auth/callback/google`

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline`

  return NextResponse.redirect(googleAuthUrl)
}
