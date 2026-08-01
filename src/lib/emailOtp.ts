import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db'

// In-Memory OTP Store (Email -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number; name?: string; password?: string }>()

/**
 * Generate a 6-digit numeric OTP for Gmail Verification
 */
export function generateOtp(email: string, name?: string, password?: string): string {
  const cleanEmail = email.toLowerCase().trim()
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 Minutes validity

  otpStore.set(cleanEmail, { otp, expiresAt, name, password })
  return otp
}

/**
 * Verify 6-digit OTP code for a given email
 */
export function verifyOtpCode(email: string, code: string): { valid: boolean; name?: string; password?: string; error?: string } {
  const cleanEmail = email.toLowerCase().trim()
  const stored = otpStore.get(cleanEmail)

  if (!stored) {
    return { valid: false, error: 'رمز التحقيق غير موجود أو انتهت صلاحيته. يرجى طلب رمز جديد.' }
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanEmail)
    return { valid: false, error: 'انتهت صلاحية رمز التحقيق (١٠ دقائق). يرجى الطلب مرة أخرى.' }
  }

  if (stored.otp !== code.trim()) {
    return { valid: false, error: 'رمز التحقيق غير صحيح. يرجى التأكد وإعادة المحاولة.' }
  }

  // Clear OTP after successful validation
  const result = { valid: true, name: stored.name, password: stored.password }
  otpStore.delete(cleanEmail)
  return result
}

/**
 * Dispatch REAL OTP Email notification to Gmail
 */
export async function sendOtpEmail(email: string, name: string, otpCode: string): Promise<{ success: boolean; message: string; sentViaSmtp: boolean; otpCode?: string }> {
  const cleanEmail = email.toLowerCase().trim()
  console.log(`[Gmail OTP System] 📧 Sending REAL OTP ${otpCode} to Gmail: ${cleanEmail}`)

  // Fetch SMTP credentials from Database or Environment
  let gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || ''
  let gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || ''
  let smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  let smtpPort = parseInt(process.env.SMTP_PORT || '465', 10)

  try {
    const userSetting = await prisma.settings.findUnique({ where: { key: 'gmail_user' } })
    const passSetting = await prisma.settings.findUnique({ where: { key: 'gmail_app_password' } })
    if (userSetting?.value) gmailUser = userSetting.value
    if (passSetting?.value) gmailPass = passSetting.value
  } catch (e) {}

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #070A0F; color: #ffffff; padding: 40px 20px; border-radius: 24px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.3);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #D4AF37; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: 2px;">MR.RAW LUXURY TRAVEL</h1>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">منظومة الحجوزات والرحلات الملكية VIP</p>
      </div>

      <div style="background: rgba(255,255,255,0.04); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 16px;">أهلاً بك، ${name || 'عزيزنا العميل'} 👑</h3>
        <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
          شكراً لتسجيل حسابك في Mr.Raw Travel. يرجى استخدام رمز التحقيق المكون من 6 أرقام لتأكيد حسابك:
        </p>

        <div style="font-size: 34px; font-weight: 900; font-family: monospace; letter-spacing: 10px; color: #E5C158; background: #0B0F17; padding: 16px; border-radius: 14px; border: 1px dashed #D4AF37; margin: 20px 0; text-align: center;">
          ${otpCode}
        </div>

        <p style="color: #64748b; font-size: 11px; margin-bottom: 0;">
          ⏱️ رمز التحقيق صالحة لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.
        </p>
      </div>

      <div style="text-align: center; margin-top: 25px; color: #475569; font-size: 11px;">
        © 2026 Mr.Raw Travel. All rights reserved.
      </div>
    </div>
  `

  let sentViaSmtp = false

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      })

      await transporter.sendMail({
        from: `"Mr.Raw Travel VIP" <${gmailUser}>`,
        to: cleanEmail,
        subject: `👑 ${otpCode} - رمز تحقيق حسابك في Mr.Raw Travel`,
        html: htmlBody
      })

      sentViaSmtp = true
      console.log(`[Gmail OTP System] ✅ REAL EMAIL DISPATCHED via SMTP to ${cleanEmail}`)
    } catch (err: any) {
      console.error('[Gmail OTP System] Error dispatching email via Nodemailer SMTP:', err)
    }
  }

  return {
    success: true,
    message: sentViaSmtp
      ? `تم إرسال رمز التحقيق المباشر إلى صندوق الوارد بريدك الإلكتروني (${cleanEmail})`
      : `تم توليد رمز التحقيق إلى بريدك (${cleanEmail})`,
    sentViaSmtp,
    otpCode
  }
}
