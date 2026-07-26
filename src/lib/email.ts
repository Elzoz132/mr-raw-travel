export interface EmailBookingDetails {
  bookingNumber: string
  customerName: string
  tripTitle: string
  tripDate: string
  pickupLocation: string
  adults: number
  children: number
  totalPrice: string
  qrToken: string
}

export function generateBookingConfirmationHtml(details: EmailBookingDetails): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - Mr.Raw Travel</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0B0F17; color: #FFFFFF; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #0F172A; border: 1px solid #D4AF37; border-radius: 16px; padding: 32px; }
        .header { text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 24px; }
        .brand { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 1px; }
        .tagline { font-size: 12px; color: #94A3B8; text-transform: uppercase; margin-top: 4px; }
        .badge { display: inline-block; background: #D4AF37; color: #0B0F17; font-weight: bold; font-size: 12px; padding: 6px 16px; border-radius: 20px; margin-top: 16px; }
        .details { margin: 24px 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .label { color: #94A3B8; font-size: 14px; }
        .value { color: #FFFFFF; font-size: 14px; font-weight: bold; }
        .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #64748B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Mr.Raw Travel</div>
          <div class="tagline">Luxury Hurghada Excursions</div>
          <div class="badge">BOOKING CONFIRMED & RESERVED</div>
        </div>
        
        <div class="details">
          <h2>Dear ${details.customerName},</h2>
          <p>Thank you for choosing Mr.Raw Travel for your Hurghada vacation. Below is your official VIP excursion voucher details:</p>
          
          <div class="row">
            <span class="label">Booking Ref:</span>
            <span class="value">${details.bookingNumber}</span>
          </div>
          <div class="row">
            <span class="label">Excursion:</span>
            <span class="value">${details.tripTitle}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span class="value">${details.tripDate}</span>
          </div>
          <div class="row">
            <span class="label">Pickup Hotel:</span>
            <span class="value">${details.pickupLocation}</span>
          </div>
          <div class="row">
            <span class="label">Guests:</span>
            <span class="value">${details.adults} Adults, ${details.children} Children</span>
          </div>
          <div class="row">
            <span class="label">Total Amount:</span>
            <span class="value" style="color: #D4AF37;">${details.totalPrice}</span>
          </div>
        </div>

        <div style="text-align: center; background: #0B0F17; padding: 20px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
          <p style="font-size: 13px; color: #CBD5E1; margin: 0;">Please present your digital QR Voucher to your driver upon pickup.</p>
          <div style="font-family: monospace; font-size: 18px; color: #D4AF37; font-weight: bold; margin-top: 10px;">${details.qrToken}</div>
        </div>

        <div class="footer">
          <p>Mr.Raw Travel • Hurghada Marina, VIP Tower 4, Red Sea, Egypt</p>
          <p>24/7 VIP Customer Line: +20 109 988 7766 • Email: vip@mrrawtravel.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}
