export async function sendAdminBookingAlert(bookingData: {
  bookingNumber: string
  fullName: string
  phone: string
  whatsApp?: string
  email?: string
  tripName: string
  tripDate: string
  adults: number
  children: number
  totalPrice: number
  currency: string
  hotelName?: string
  paymentMethod?: string
}) {
  const telegramMessage = `🚨 <b>حجز جديد على موقع مستر رو للتنقلات والرحلات!</b> 👑

📋 <b>رقم الحجز:</b> <code>${bookingData.bookingNumber}</code>
👤 <b>الاسم:</b> ${bookingData.fullName}
📞 <b>الهاتف / الواتساب:</b> ${bookingData.whatsApp || bookingData.phone}
✉️ <b>البريد:</b> ${bookingData.email || 'غير مدخل'}

⛵ <b>الرحلة:</b> ${bookingData.tripName}
📅 <b>التاريخ:</b> ${bookingData.tripDate}
👥 <b>المسافرون:</b> ${bookingData.adults} بالغين | ${bookingData.children} أطفال
🏨 <b>الفندق:</b> ${bookingData.hotelName || 'غير محدد'}
💰 <b>إجمالي المبلغ:</b> ${bookingData.totalPrice} ${bookingData.currency}
💳 <b>طريقة الدفع:</b> ${bookingData.paymentMethod || 'CASH'}`

  // 1. Send via Telegram Bot API if configured
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  let telegramSent = false
  if (botToken && chatId) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      })
      telegramSent = tgRes.ok
    } catch (err) {
      console.error('Telegram notification alert failed:', err)
    }
  }

  // 2. Generate WhatsApp direct admin link
  const rawWaText = `🚨 حجز جديد برقم ${bookingData.bookingNumber}\n` +
    `👤 العميل: ${bookingData.fullName}\n` +
    `⛵ الرحلة: ${bookingData.tripName}\n` +
    `📅 التاريخ: ${bookingData.tripDate}\n` +
    `👥 الأفراد: ${bookingData.adults} بالغين، ${bookingData.children} أطفال\n` +
    `🏨 الفندق: ${bookingData.hotelName || 'غير محدد'}\n` +
    `💰 المبلغ الإجمالي: ${bookingData.totalPrice} ${bookingData.currency}\n` +
    `📞 الهاتف: ${bookingData.whatsApp || bookingData.phone}`

  const adminWhatsAppNumber = '201022392428'
  const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(rawWaText)}`

  return { telegramSent, whatsappUrl, rawWaText }
}
