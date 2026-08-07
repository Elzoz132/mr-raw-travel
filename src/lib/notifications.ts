import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email/resend'

export interface InAppNotificationParams {
  userId?: string | null
  userEmail: string
  title: string
  message: string
  type?: string
  link?: string
}

export async function createInAppNotification(params: InAppNotificationParams): Promise<void> {
  try {
    const cleanEmail = params.userEmail.toLowerCase().trim()

    let userId = params.userId
    if (!userId) {
      const user = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: 'insensitive' } }
      })
      if (user) userId = user.id
    }

    await prisma.notification.create({
      data: {
        userId: userId || null,
        userEmail: cleanEmail,
        title: params.title,
        message: params.message,
        type: params.type || 'INFO',
        link: params.link || '/customer'
      }
    })

    // Send real email notification
    await sendEmail({
      to: cleanEmail,
      subject: params.title,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0B0F17; color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #D4AF37;">
          <h2 style="color: #D4AF37; margin-bottom: 20px;">${params.title}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0;">${params.message}</p>
          <div style="margin-top: 30px;">
            <a href="https://www.mrrawtravel.com${params.link || '/customer'}" style="background-color: #D4AF37; color: #0B0F17; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">عرض التفاصيل في حسابك</a>
          </div>
          <hr style="border-color: rgba(255,255,255,0.1); margin-top: 40px;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Mr.Raw Travel - Luxury Tourism & Excursions Hurghada</p>
        </div>
      `
    })
  } catch (err) {
    console.error('Error creating in-app notification:', err)
  }
}

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
