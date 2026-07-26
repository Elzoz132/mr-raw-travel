import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const host = req.headers.get('host') || 'mr-raw-travel.vercel.app'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/auth/callback/google`

  if (!code) {
    return NextResponse.redirect(`${protocol}://${host}?auth_error=no_code`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${protocol}://${host}?auth_error=missing_credentials`)
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokenData = await tokenRes.json()
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(`${protocol}://${host}?auth_error=token_failed`)
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })

    const googleUser = await userRes.json()
    if (!googleUser.email) {
      return NextResponse.redirect(`${protocol}://${host}?auth_error=no_email`)
    }

    const cleanEmail = googleUser.email.toLowerCase().trim()

    // Find or Create User in DB
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          password: 'google_oauth_authenticated',
          role: 'CUSTOMER',
          avatar: googleUser.picture || null
        }
      })

      // Create CRM profile
      await prisma.customerProfile.create({
        data: {
          userId: user.id,
          segment: 'STANDARD',
          tags: JSON.stringify(['Google OAuth Customer', 'Real Sign-In'])
        }
      })
    }

    // Set user session cookie
    const cookieStore = await cookies()
    cookieStore.set('user_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.redirect(`${protocol}://${host}/customer`)
  } catch (err: any) {
    console.error('Google OAuth callback error:', err)
    return NextResponse.redirect(`${protocol}://${host}?auth_error=exception`)
  }
}
