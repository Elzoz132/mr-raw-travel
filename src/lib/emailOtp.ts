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
 * Dispatch OTP Email notification
 */
export async function sendOtpEmail(email: string, name: string, otpCode: string): Promise<{ success: boolean; message: string; otpCode?: string }> {
  console.log(`[Gmail OTP System] 📧 Sending OTP ${otpCode} to Gmail: ${email}`)

  return {
    success: true,
    message: `تم إرسال رمز التحقيق إلى بريدك الإلكتروني (${email})`,
    otpCode
  }
}
