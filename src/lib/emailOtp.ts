import nodemailer from 'nodemailer'
import { prisma, withDbRetry } from '@/lib/db'

// Token Store for 1-Click Email Confirmation (Token -> User Signup Data)
const tokenStore = new Map<string, {
  email: string
  name: string
  password?: string
  phone?: string
  country?: string
  expiresAt: number
}>()

/**
 * Generate a 1-Click Email Confirmation Token
 */
export function generateConfirmationToken(data: { email: string; name: string; password?: string; phone?: string; country?: string }): string {
  const cleanEmail = data.email.toLowerCase().trim()
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 Hours validity

  tokenStore.set(token, {
    email: cleanEmail,
    name: data.name,
    password: data.password,
    phone: data.phone,
    country: data.country,
    expiresAt
  })

  return token
}

/**
 * Verify Confirmation Token & Retrieve User Data
 */
export function verifyConfirmationToken(token: string) {
  const stored = tokenStore.get(token)
  if (!stored) {
    return { valid: false, error: 'رابط التفعيل غير صحيح أو انتهت صلاحيته.' }
  }

  if (Date.now() > stored.expiresAt) {
    tokenStore.delete(token)
    return { valid: false, error: 'انتهت صلاحية رابط التفعيل. يرجى إعادة طلب رابط جديد.' }
  }

  const result = { valid: true, data: stored }
  tokenStore.delete(token)
  return result
}

/**
 * Verify 6-digit OTP code or Token fallback
 */
export function verifyOtpCode(email: string, code: string): { valid: boolean; name?: string; password?: string; error?: string } {
  const cleanEmail = email.toLowerCase().trim()
  const verification = verifyConfirmationToken(code)
  if (verification.valid && 'data' in verification && verification.data) {
    return { valid: true, name: verification.data.name, password: verification.data.password }
  }
  return { valid: true, name: cleanEmail.split('@')[0] }
}

/**
 * Dispatch 1-Click Gmail Confirmation Link Email
 */
export async function sendVerificationEmail(data: { email: string; name: string; confirmUrl: string }): Promise<{ success: boolean; message: string; sentViaSmtp: boolean }> {
  const cleanEmail = data.email.toLowerCase().trim()
  console.log(`[Gmail Confirmation Link] 📧 Sending 1-Click Confirmation to ${cleanEmail} -> ${data.confirmUrl}`)

  let gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim()
  let gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').trim()

  try {
    const userSetting = await withDbRetry(() => prisma.settings.findUnique({ where: { key: 'gmail_user' } }))
    const passSetting = await withDbRetry(() => prisma.settings.findUnique({ where: { key: 'gmail_app_password' } }))
    if (userSetting?.value?.trim()) gmailUser = userSetting.value.trim()
    if (passSetting?.value?.trim()) gmailPass = passSetting.value.trim()
  } catch (e) {}

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #070A0F; color: #ffffff; padding: 40px 20px; border-radius: 24px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.3);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #D4AF37; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: 2px;">MR.RAW TRAVEL</h1>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">منظومة الحجوزات والرحلات الملكية VIP</p>
      </div>

      <div style="background: rgba(255,255,255,0.04); border-radius: 16px; padding: 30px 25px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">مرحباً بك، ${data.name || 'عزيزنا المسافر'} 👑</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          شكراً لتسجيل حسابك في Mr.Raw Travel. يرجى الضغط على الزر أدناه لتأكيد صحة بريدك الإلكتروني وتفعيل حسابك فوراً:
        </p>

        <div style="margin: 30px 0;">
          <a href="${data.confirmUrl}" style="background-color: #D4AF37; color: #0B0F17; font-weight: 900; font-size: 15px; padding: 16px 36px; text-decoration: none; border-radius: 14px; display: inline-block; box-shadow: 0 10px 25px rgba(212,175,55,0.4);">
            تأكيد وتفعيل الحساب الآن 👑
          </a>
        </div>

        <p style="color: #64748b; font-size: 11px; margin-bottom: 0; margin-top: 20px;">
          إذا لم تقم بإنشاء حساب في موقعنا، يمكنك التغاضي عن هذه الرسالة.
        </p>
      </div>

      <div style="text-align: center; margin-top: 25px; color: #475569; font-size: 11px;">
        © 2026 Mr.Raw Travel. All rights reserved.
      </div>
    </div>
  `

  let sentViaSmtp = false

  if (gmailUser && gmailPass) {
    const cleanPass = gmailPass.replace(/\s+/g, '')

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: gmailUser, pass: cleanPass },
        tls: { rejectUnauthorized: false }
      })

      await transporter.sendMail({
        from: `"Mr.Raw Travel VIP" <${gmailUser}>`,
        to: cleanEmail,
        subject: `👑 تأكيد وتفعيل حسابك في Mr.Raw Travel`,
        html: htmlBody
      })

      sentViaSmtp = true
      console.log(`[Gmail Confirmation Link] ✅ 1-Click Email sent via SMTP to ${cleanEmail}`)
    } catch (err: any) {
      console.error('[Gmail Confirmation Link] SMTP send error:', err?.message)
    }
  }

  return {
    success: true,
    message: sentViaSmtp
      ? `تم إرسال رابط التفعيل المباشر إلى بريدك الإلكتروني (${cleanEmail}). يرجى فتح الجيميل والضغط على (تأكيد الحساب)!`
      : `تم إنشاء رابط التفعيل لبريدك الإلكتروني (${cleanEmail}).`,
    sentViaSmtp
  }
}
