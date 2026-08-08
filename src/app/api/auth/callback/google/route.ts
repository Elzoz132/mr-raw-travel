import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = [
  'zeyadadel132123@gmail.com',
  'zeyadadel123132@gmail.com',
  'admin@mrrawtravel.com'
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'mrrawtravel.com'
  const protoHeader = req.headers.get('x-forwarded-proto')
  const protocol = protoHeader ? protoHeader : (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl.replace(/\/$/, '')}/api/auth/callback/google`

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?auth_error=no_code`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}?auth_error=missing_credentials`)
    }

    // 1. Exchange OAuth code for Google access token
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
      console.error('Google token exchange failed:', tokenData)
      return NextResponse.redirect(`${baseUrl}?auth_error=token_failed`)
    }

    // 2. Fetch authenticated Google User Profile
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })

    const googleUser = await userRes.json()
    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}?auth_error=no_email`)
    }

    const cleanEmail = googleUser.email.toLowerCase().trim()
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail)
    const targetRole = isAdmin ? 'ADMIN' : 'CUSTOMER'

    let user: any = null

    // 3. Find or Create User in DB with robust fallback
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: googleUser.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            password: 'google_oauth_authenticated',
            role: targetRole,
            avatar: googleUser.picture || null,
            country: 'Egypt'
          }
        })

        try {
          await prisma.customerProfile.create({
            data: {
              userId: user.id,
              segment: isAdmin ? 'VIP' : 'STANDARD',
              tags: JSON.stringify(['Google OAuth User', isAdmin ? 'Admin Account' : 'Customer Account'])
            }
          })
        } catch (profileErr) {
          console.error('Non-critical customer profile creation error:', profileErr)
        }
      } else if (isAdmin && user.role !== 'ADMIN') {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' }
        })
      }
    } catch (dbErr) {
      console.error('Database connection glitch during Google Auth:', dbErr)
      user = {
        id: `google_${cleanEmail}`,
        name: googleUser.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: targetRole,
        avatar: googleUser.picture || null
      }
    }

    // 4. Set Session Cookies
    const cookieStore = await cookies()
    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    })

    cookieStore.set('user_session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    cookieStore.set('user_role', user.role || 'CUSTOMER', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    // 5. If ADMIN, set Executive Admin Session cookie and redirect to Admin Dashboard
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || isAdmin) {
      cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      return NextResponse.redirect(`${baseUrl}/admin/dashboard`)
    }

    // Customer redirect: Return to homepage directly logged in!
    return NextResponse.redirect(`${baseUrl}/?auth=success`)

  } catch (err: any) {
    console.error('Google OAuth critical callback error:', err)
    return NextResponse.redirect(`${baseUrl}/?auth=error`)
  }
}
