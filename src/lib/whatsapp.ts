export interface WhatsAppMessagePayload {
  toPhone: string
  customerName: string
  bookingNumber: string
  tripTitle: string
  tripDate: string
  pickupLocation: string
  totalPrice: string
}

export function buildWhatsAppConfirmationUrl(payload: WhatsAppMessagePayload): string {
  const cleanPhone = payload.toPhone.replace(/[^0-9]/g, '')
  const text = encodeURIComponent(
    `✨ *Mr.Raw Travel - VIP Booking Confirmation*\n\n` +
    `Hello *${payload.customerName}*,\n` +
    `Your reservation for *${payload.tripTitle}* is CONFIRMED! 🏆\n\n` +
    `📋 *Booking Ref:* ${payload.bookingNumber}\n` +
    `📅 *Date:* ${payload.tripDate}\n` +
    `🏨 *Pickup Hotel:* ${payload.pickupLocation}\n` +
    `💰 *Total Amount:* ${payload.totalPrice}\n\n` +
    `Your VIP driver will contact you 2 hours before pickup. Have a wonderful day in Hurghada! 🌊`
  )

  return `https://wa.me/${cleanPhone}?text=${text}`
}
