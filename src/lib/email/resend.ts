import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { prisma, withDbRetry } from '@/lib/db'
import {
  defaultBranding,
  EmailBrandingConfig,
  getWelcomeEmailHtml,
  getVerifyEmailHtml,
  getResetPasswordHtml,
  getPasswordChangedHtml,
  getBookingConfirmationHtml,
  getBookingApprovedHtml,
  getBookingCancelledHtml,
  getPaymentApprovedHtml,
  getPaymentRejectedHtml,
  getReviewApprovedHtml
} from './templates'

export async function getEmailBranding(): Promise<EmailBrandingConfig> {
  try {
    const settings = await withDbRetry(() => prisma.settings.findMany())
    const map: Record<string, string> = {}
    settings.forEach((s: any) => { map[s.key] = s.value })

    return {
      logoUrl: map.email_logo || defaultBranding.logoUrl,
      primaryColor: map.email_primary_color || defaultBranding.primaryColor,
      bgColor: map.email_bg_color || defaultBranding.bgColor,
      companyName: map.email_company_name || defaultBranding.companyName,
      companyPhone: map.email_company_phone || defaultBranding.companyPhone,
      companyEmail: map.email_company_email || defaultBranding.companyEmail,
      companyAddress: map.email_company_address || defaultBranding.companyAddress,
      facebookUrl: map.email_social_facebook || defaultBranding.facebookUrl,
      instagramUrl: map.email_social_instagram || defaultBranding.instagramUrl,
      whatsAppUrl: map.email_social_whatsapp || defaultBranding.whatsAppUrl,
    }
  } catch (e) {
    return defaultBranding
  }
}

export type EmailTemplateKey =
  | 'WELCOME'
  | 'VERIFY_EMAIL'
  | 'RESET_PASSWORD'
  | 'PASSWORD_CHANGED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_APPROVED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'REVIEW_APPROVED'

interface SendEmailOptions {
  to: string
  subject?: string
  templateKey?: EmailTemplateKey
  props?: Record<string, any>
  html?: string
}

/**
 * Enterprise Production Dual Email Dispatcher (Resend + Gmail Nodemailer SMTP)
 */
export async function sendEmail({ to, subject, templateKey, props = {}, html: customHtml }: SendEmailOptions) {
  const branding = await getEmailBranding()
  let defaultSubject = subject || 'MR.RAW Travel Notification'
  let html = customHtml || ''

  // Read settings from DB
  const dbSettingsMap: Record<string, string> = {}
  try {
    const settingsList = await withDbRetry(() => prisma.settings.findMany())
    settingsList.forEach((s: any) => { dbSettingsMap[s.key] = s.value })
  } catch (e) {}

  if (templateKey && dbSettingsMap[`email_template_${templateKey}_enabled`] === 'false') {
    console.log(`[Email Engine] Template ${templateKey} is disabled in Admin settings.`)
    return { success: true, status: 'DISABLED' }
  }

  if (dbSettingsMap[`email_template_${templateKey}_subject`]) {
    defaultSubject = dbSettingsMap[`email_template_${templateKey}_subject`]
  }

  switch (templateKey) {
    case 'WELCOME':
      if (!subject) defaultSubject = `Welcome to MR.RAW Travel, ${props.name}! 👑`
      html = getWelcomeEmailHtml(props.name, branding)
      break
    case 'VERIFY_EMAIL':
      if (!subject) defaultSubject = `Confirm Your MR.RAW Travel Account ✉️`
      html = getVerifyEmailHtml(props.name, props.verifyUrl, branding)
      break
    case 'RESET_PASSWORD':
      if (!subject) defaultSubject = `Reset Password Link - MR.RAW Travel 🔐`
      html = getResetPasswordHtml(props.name, props.resetUrl, branding)
      break
    case 'PASSWORD_CHANGED':
      if (!subject) defaultSubject = `Security Alert: Your Password Was Changed 🛡️`
      html = getPasswordChangedHtml(props.name, branding)
      break
    case 'BOOKING_CONFIRMED':
      if (!subject) defaultSubject = `Booking Received: #${props.bookingNumber} - MR.RAW Travel 📜`
      html = getBookingConfirmationHtml(props.name, props.bookingNumber, props.tripTitle, props.date, props.amount, branding)
      break
    case 'BOOKING_APPROVED':
      if (!subject) defaultSubject = `VIP Voucher Ready! Booking #${props.bookingNumber} 👑`
      html = getBookingApprovedHtml(props.name, props.bookingNumber, props.tripTitle, props.voucherUrl, branding)
      break
    case 'BOOKING_CANCELLED':
      if (!subject) defaultSubject = `Booking #${props.bookingNumber} Cancellation Notice ⚠️`
      html = getBookingCancelledHtml(props.name, props.bookingNumber, props.reason, branding)
      break
    case 'PAYMENT_APPROVED':
      if (!subject) defaultSubject = `Payment Approved for Booking #${props.bookingNumber} 💳`
      html = getPaymentApprovedHtml(props.name, props.bookingNumber, props.amount, branding)
      break
    case 'PAYMENT_REJECTED':
      if (!subject) defaultSubject = `Action Required: Payment Receipt #${props.bookingNumber} ⚠️`
      html = getPaymentRejectedHtml(props.name, props.bookingNumber, props.note, branding)
      break
    case 'REVIEW_APPROVED':
      if (!subject) defaultSubject = `Your Review is Published! ⭐`
      html = getReviewApprovedHtml(props.name, props.tripTitle, branding)
      break
  }

  // Check Keys Priority:
  // 1. Resend API Key
  const resendApiKey = process.env.RESEND_API_KEY || dbSettingsMap.resend_api_key || ''

  // 2. Gmail SMTP Credentials
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || dbSettingsMap.gmail_email || dbSettingsMap.smtp_user || ''
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || dbSettingsMap.gmail_app_password || dbSettingsMap.smtp_pass || ''

  let sendStatus = 'SENT'
  let errorMessage: string | null = null

  if (resendApiKey) {
    // Dispatch via Resend
    try {
      const resendClient = new Resend(resendApiKey)
      const fromEmail = process.env.EMAIL_FROM || 'MR.RAW Travel <onboarding@resend.dev>'

      const response = await resendClient.emails.send({
        from: fromEmail,
        to,
        subject: defaultSubject,
        html
      })

      if (response.error) {
        sendStatus = 'FAILED'
        errorMessage = response.error.message
      }
    } catch (err: any) {
      sendStatus = 'FAILED'
      errorMessage = err.message || 'Resend Dispatch Error'
    }
  } else if (gmailUser && gmailPass) {
    // Dispatch via Gmail SMTP (Nodemailer)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      })

      await transporter.sendMail({
        from: `"MR.RAW Travel" <${gmailUser}>`,
        to,
        subject: defaultSubject,
        html
      })
    } catch (err: any) {
      sendStatus = 'FAILED'
      errorMessage = err.message || 'Gmail SMTP Dispatch Error'
    }
  } else {
    // Simulated Mode
    sendStatus = 'SIMULATED'
    errorMessage = 'Neither RESEND_API_KEY nor Gmail App Password is set in .env or Admin Settings.'
    console.log(`\n======================================================`)
    console.log(`[EMAIL DISPATCH NOTICE] No Email Credentials Configured!`)
    console.log(`To send real emails to inbox, please add RESEND_API_KEY or Gmail Email & App Password to .env or /admin/settings.`)
    console.log(`TO: ${to}`)
    console.log(`SUBJECT: ${defaultSubject}`)
    console.log(`TEMPLATE: ${templateKey}`)
    console.log(`======================================================\n`)
  }

  // Record Email Log in DB
  try {
    await withDbRetry(() =>
      prisma.emailLog.create({
        data: {
          email: to,
          subject: defaultSubject,
          templateKey: templateKey || 'CUSTOM_NOTIFICATION',
          status: sendStatus,
          error: errorMessage
        }
      })
    )
  } catch (e) {}

  return {
    success: sendStatus === 'SENT' || sendStatus === 'SIMULATED',
    status: sendStatus,
    error: errorMessage
  }
}
