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
 * Dispatch REAL OTP Email notification directly to Gmail Inbox
 */
export async function sendOtpEmail(email: string, name: string, otpCode: string): Promise<{ success: boolean; message: string; sentViaSmtp: boolean }> {
  const cleanEmail = email.toLowerCase().trim()
  console.log(`[Gmail OTP System] 📧 Attempting REAL OTP email dispatch for ${cleanEmail} (Code: ${otpCode})`)

  // Fetch SMTP credentials from Database or Environment
  let gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim()
  let gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').trim()

  try {
    const userSetting = await prisma.settings.findUnique({ where: { key: 'gmail_user' } })
    const passSetting = await prisma.settings.findUnique({ where: { key: 'gmail_app_password' } })
    if (userSetting?.value?.trim()) gmailUser = userSetting.value.trim()
    if (passSetting?.value?.trim()) gmailPass = passSetting.value.trim()
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
  let lastError = ''

  if (gmailUser && gmailPass) {
    const cleanPass = gmailPass.replace(/\s+/g, '')

    // 1. Try Port 587 TLS
    try {
      const transporter587 = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: gmailUser, pass: cleanPass },
        tls: { rejectUnauthorized: false }
      })

      await transporter587.sendMail({
        from: `"Mr.Raw Travel VIP" <${gmailUser}>`,
        to: cleanEmail,
        subject: `👑 ${otpCode} - رمز تحقيق حسابك في Mr.Raw Travel`,
        html: htmlBody
      })

      sentViaSmtp = true
      console.log(`[Gmail OTP System] ✅ REAL EMAIL DISPATCHED via SMTP Port 587 to ${cleanEmail}`)
    } catch (err587: any) {
      console.warn('[Gmail OTP System] Port 587 failed, trying Port 465 SSL. Reason:', err587?.message)
      lastError = err587?.message || 'SMTP 587 failed'

      // 2. Fallback to Port 465 SSL
      try {
        const transporter465 = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: gmailUser, pass: cleanPass }
        })

        await transporter465.sendMail({
          from: `"Mr.Raw Travel VIP" <${gmailUser}>`,
          to: cleanEmail,
          subject: `👑 ${otpCode} - رمز تحقيق حسابك في Mr.Raw Travel`,
          html: htmlBody
        })

        sentViaSmtp = true
        console.log(`[Gmail OTP System] ✅ REAL EMAIL DISPATCHED via SMTP Port 465 to ${cleanEmail}`)
      } catch (err465: any) {
        console.error('[Gmail OTP System] Port 465 SSL also failed:', err465?.message)
        lastError = err465?.message || 'SMTP 465 failed'
      }
    }
  }

  if (!sentViaSmtp) {
    const missingCreds = !gmailUser || !gmailPass
    const failMessage = missingCreds
      ? `لم يتم إدخال بريد الجيميل وكلمة سر التطبيقات (App Password) في لوحة التحكم الإدارية بعد (/admin/settings). يرجى فتح الإعدادات وإدخال Gmail Email و Gmail App Password ليصل الإيميل فوراً للـ Inbox!`
      : `فشل الاتصال بسيرفر الجيميل (${lastError}). يرجى التأكد من إنشاء (App Password) من حساب جوجل وتجربة إعادة الإرسال.`

    return {
      success: false,
      message: failMessage,
      sentViaSmtp: false
    }
  }

  return {
    success: true,
    message: `تم إرسال رمز التحقيق المباشر إلى صندوق الوارد بريدك الإلكتروني (${cleanEmail})`,
    sentViaSmtp: true
  }
}
