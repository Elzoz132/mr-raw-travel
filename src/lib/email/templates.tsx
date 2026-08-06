export interface EmailBrandingConfig {
  logoUrl?: string
  primaryColor?: string
  bgColor?: string
  companyName?: string
  companyPhone?: string
  companyEmail?: string
  companyAddress?: string
  facebookUrl?: string
  instagramUrl?: string
  whatsAppUrl?: string
}

export const defaultBranding: EmailBrandingConfig = {
  logoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
  primaryColor: '#D4AF37',
  bgColor: '#0B0F17',
  companyName: 'MR.RAW Travel',
  companyPhone: '+20 102 239 2428',
  companyEmail: 'info@mrrawtravel.com',
  companyAddress: 'Hurghada Marina, Red Sea, Egypt',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  whatsAppUrl: 'https://wa.me/201022392428'
}

/** Base Luxury HTML Layout generator */
export function renderEmailLayout(title: string, contentHtml: string, branding?: EmailBrandingConfig): string {
  const brand = { ...defaultBranding, ...branding }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="background-color: ${brand.bgColor}; font-family: Arial, sans-serif; padding: 40px 10px; margin: 0; color: #F8FAFC;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #0F172A; border-radius: 16px; border: 1px solid ${brand.primaryColor}40; overflow: hidden;">
    <!-- Header Logo -->
    <tr>
      <td align="center" style="padding: 32px 20px; background-color: #0B0F17; border-bottom: 1px solid ${brand.primaryColor}30;">
        <h1 style="margin: 0; color: ${brand.primaryColor}; font-size: 24px; letter-spacing: 3px; text-transform: uppercase; font-weight: 800;">
          👑 ${brand.companyName}
        </h1>
        <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
          Luxury Excursions & Yacht Charters
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px 24px;">
        <h2 style="color: #FFFFFF; font-size: 20px; margin: 0 0 16px 0; font-weight: 700;">${title}</h2>
        ${contentHtml}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding: 24px; background-color: #0B0F17; border-top: 1px solid ${brand.primaryColor}20; font-size: 12px; color: #64748B; line-height: 1.6;">
        <p style="margin: 0 0 8px 0; color: #94A3B8; font-weight: bold;">${brand.companyName} — Red Sea Luxury Travel</p>
        <p style="margin: 0 0 8px 0;">📍 ${brand.companyAddress} | 📞 ${brand.companyPhone}</p>
        <p style="margin: 0 0 12px 0;">✉️ ${brand.companyEmail}</p>
        <div style="margin-top: 12px;">
          <a href="${brand.whatsAppUrl}" style="color: ${brand.primaryColor}; text-decoration: none; margin: 0 8px; font-weight: bold;">WhatsApp</a> |
          <a href="${brand.facebookUrl}" style="color: ${brand.primaryColor}; text-decoration: none; margin: 0 8px; font-weight: bold;">Facebook</a> |
          <a href="${brand.instagramUrl}" style="color: ${brand.primaryColor}; text-decoration: none; margin: 0 8px; font-weight: bold;">Instagram</a>
        </div>
        <p style="margin: 16px 0 0 0; font-size: 10px; color: #475569;">© ${new Date().getFullYear()} ${brand.companyName}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/** 1. Welcome Email */
export function getWelcomeEmailHtml(name: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Thank you for registering with <strong>MR.RAW Travel</strong>. We are thrilled to welcome you to Egypt’s premier VIP excursions and luxury yacht charter platform in Hurghada.
    </p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Your account gives you instant access to exclusive VIP discounts, fast-track booking, private vouchers, and 24/7 dedicated travel concierges.
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="https://mrrawtravel.com/trips" style="background-color: ${branding?.primaryColor || '#D4AF37'}; color: #0B0F17; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
        Explore Luxury Trips →
      </a>
    </div>
  `
  return renderEmailLayout(`Welcome aboard, ${name}! 👑`, content, branding)
}

/** 2. Verify Email */
export function getVerifyEmailHtml(name: string, verifyUrl: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Dear <strong>${name}</strong>,
    </p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Please confirm your email address to activate your MR.RAW Travel account and complete your registration.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" style="background-color: ${branding?.primaryColor || '#D4AF37'}; color: #0B0F17; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">
        Verify Email Address Now →
      </a>
    </div>
    <p style="color: #94A3B8; font-size: 12px; line-height: 1.5;">
      Direct Link:<br />
      <a href="${verifyUrl}" style="color: ${branding?.primaryColor || '#D4AF37'}; word-break: break-all;">${verifyUrl}</a>
    </p>
  `
  return renderEmailLayout("Verify Your Email Address ✉️", content, branding)
}

/** 3. Reset Password */
export function getResetPasswordHtml(name: string, resetUrl: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Hello <strong>${name}</strong>,
    </p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      We received a request to reset the password for your MR.RAW Travel account. Click the button below to choose a new password:
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: ${branding?.primaryColor || '#D4AF37'}; color: #0B0F17; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
        Reset Password →
      </a>
    </div>
    <p style="color: #94A3B8; font-size: 12px; line-height: 1.5;">
      Direct Link:<br />
      <a href="${resetUrl}" style="color: ${branding?.primaryColor || '#D4AF37'}; word-break: break-all;">${resetUrl}</a>
    </p>
  `
  return renderEmailLayout("Reset Your Password 🔐", content, branding)
}

/** 4. Password Changed */
export function getPasswordChangedHtml(name: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Hello <strong>${name}</strong>,
    </p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
      Your password for MR.RAW Travel was successfully updated.
    </p>
    <div style="padding: 16px; background-color: #0B0F17; border-radius: 10px; border: 1px solid #334155; margin: 20px 0; font-size: 13px; color: #94A3B8;">
      ⏱️ <strong>Timestamp:</strong> ${new Date().toUTCString()}<br />
      🛡️ <strong>Security Status:</strong> Account Secure
    </div>
  `
  return renderEmailLayout("Password Changed Successfully 🛡️", content, branding)
}

/** 5. Booking Confirmation */
export function getBookingConfirmationHtml(name: string, bookingNumber: string, tripTitle: string, date: string, amount: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">We have received your excursion reservation order for <strong>${tripTitle}</strong>.</p>
    <div style="background-color: #0B0F17; padding: 20px; border-radius: 12px; border: 1px solid ${branding?.primaryColor || '#D4AF37'}40; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; color: ${branding?.primaryColor || '#D4AF37'}; font-size: 16px; font-weight: bold;">Booking Reference: #${bookingNumber}</p>
      <p style="margin: 0 0 6px 0; color: #E2E8F0; font-size: 14px;">🌴 Excursion: <strong>${tripTitle}</strong></p>
      <p style="margin: 0 0 6px 0; color: #E2E8F0; font-size: 14px;">📅 Date: <strong>${date}</strong></p>
      <p style="margin: 0; color: #E2E8F0; font-size: 14px;">💳 Total: <strong>${amount}</strong></p>
    </div>
  `
  return renderEmailLayout("Booking Order Received! 📜", content, branding)
}

/** 6. Booking Approved */
export function getBookingApprovedHtml(name: string, bookingNumber: string, tripTitle: string, voucherUrl?: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Your booking <strong>#${bookingNumber}</strong> for <strong>${tripTitle}</strong> has been officially approved!</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${voucherUrl || 'https://mrrawtravel.com/customer/dashboard'}" style="background-color: #10B981; color: #FFFFFF; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
        Download VIP PDF Voucher →
      </a>
    </div>
  `
  return renderEmailLayout("Your Royal Voucher is Approved & Ready! 👑", content, branding)
}

/** 7. Booking Cancelled */
export function getBookingCancelledHtml(name: string, bookingNumber: string, reason?: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Your booking <strong>#${bookingNumber}</strong> has been cancelled.</p>
    ${reason ? `<div style="background-color: #0B0F17; padding: 16px; border-radius: 10px; border: 1px solid #EF4444; margin: 20px 0; font-size: 13px; color: #FCA5A5;">Note: ${reason}</div>` : ''}
  `
  return renderEmailLayout("Booking Cancellation Notice ⚠️", content, branding)
}

/** 8. Payment Approved */
export function getPaymentApprovedHtml(name: string, bookingNumber: string, amount: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">We have verified and approved your transfer payment receipt of <strong>${amount}</strong> for booking <strong>#${bookingNumber}</strong>.</p>
  `
  return renderEmailLayout("Payment Receipt Approved! 💳", content, branding)
}

/** 9. Payment Rejected */
export function getPaymentRejectedHtml(name: string, bookingNumber: string, note?: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">We were unable to verify the payment receipt attached to booking <strong>#${bookingNumber}</strong>.</p>
    ${note ? `<div style="background-color: #7F1D1D; padding: 14px; border-radius: 10px; color: #FECACA; font-size: 13px; margin: 16px 0;">Note from operations: ${note}</div>` : ''}
  `
  return renderEmailLayout("Payment Receipt Action Required ⚠️", content, branding)
}

/** 10. Review Approved */
export function getReviewApprovedHtml(name: string, tripTitle: string, branding?: EmailBrandingConfig): string {
  const content = `
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
    <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Thank you for sharing your experience on <strong>${tripTitle}</strong>! Your review has been approved and published.</p>
  `
  return renderEmailLayout("Your Review Has Been Published! ⭐", content, branding)
}
