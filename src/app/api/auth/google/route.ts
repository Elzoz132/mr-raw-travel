import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const queryClientId = searchParams.get('client_id')
  const isDebug = searchParams.get('debug') === '1'

  const clientId = queryClientId ||
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // Protocol & Host determination
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'mr-raw-travel.vercel.app'
  const protoHeader = req.headers.get('x-forwarded-proto')
  const protocol = protoHeader ? protoHeader : (host.includes('localhost') ? 'http' : 'https')
  
  // Custom base URL if provided in env
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl.replace(/\/$/, '')}/api/auth/callback/google`

  if (!clientId) {
    return new NextResponse(
      `<html>
        <body style="background:#0B0F17;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="background:rgba(255,255,255,0.05);border:1px solid #D4AF37;padding:30px;border-radius:20px;text-align:center;max-width:500px;">
            <h2 style="color:#D4AF37;margin-top:0;">⚠️ Google OAuth Setup Required</h2>
            <p style="font-size:14px;color:#ccc;line-height:1.6;">
              Please add <b>GOOGLE_CLIENT_ID</b> and <b>GOOGLE_CLIENT_SECRET</b> in your Environment Variables or Vercel settings.
            </p>
            <a href="/" style="display:inline-block;margin-top:15px;padding:10px 20px;background:#D4AF37;color:#0B0F17;font-weight:bold;border-radius:10px;text-decoration:none;">Back to Website</a>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  if (isDebug) {
    return NextResponse.json({
      clientId,
      redirectUri,
      host,
      protocol,
      baseUrl
    })
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&access_type=offline` +
    `&prompt=consent`

  return NextResponse.redirect(googleAuthUrl)
}
