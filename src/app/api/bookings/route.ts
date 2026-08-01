import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { generateBookingNumber } from '@/lib/utils'
import { upsertCustomerCrmProfile } from '@/lib/crm'
import { sendAdminBookingAlert } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tripId = body.tripId
    const packageId = body.packageId || null
    const tripDate = body.tripDate || new Date().toISOString()
    const adults = Number(body.adults) || 1
    const children = Number(body.children) || 0
    const currency = body.currency || 'USD'
    const totalPrice = Number(body.totalPrice) || 0

    const fullName = body.fullName || body.leadPassengerName || 'Guest Passenger'
    const email = body.email || body.leadEmail || 'guest@mrrawtravel.com'
    const phone = body.phone || body.leadPhone || '+201070657476'
    const whatsApp = body.whatsApp || body.whatsappPhone || body.leadWhatsApp || phone
    const nationality = body.nationality || 'Egyptian'

    const hotelName = body.hotelName || 'Hurghada Hotel'
    const hotelAddress = body.hotelAddress || ''
    const roomNumber = body.roomNumber || ''

    const paymentMethod = body.paymentMethod || 'CASH'
    const receiptUrl = body.receiptUrl || ''
    const emergencyContact = body.emergencyContact || ''
    const specialNotes = body.specialNotes || body.specialRequests || ''

    const selectedAddons = body.selectedAddons ? (typeof body.selectedAddons === 'string' ? body.selectedAddons : JSON.stringify(body.selectedAddons)) : null
    const isCustomPackage = Boolean(body.isCustomPackage)

    // Fetch default trip if tripId is not a valid UUID
    let targetTripId = tripId
    if (!targetTripId || targetTripId === '1') {
      const firstTrip = await prisma.trip.findFirst()
      if (firstTrip) {
        targetTripId = firstTrip.id
      }
    }

    const bookingNumber = generateBookingNumber()
    const qrToken = `MRRAW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Determine initial statuses
    let paymentStatus = 'PENDING'
    let bookingStatus = 'PENDING'

    if (paymentMethod === 'CASH') {
      paymentStatus = 'PENDING'
      bookingStatus = 'CONFIRMED'
    } else if (receiptUrl) {
      paymentStatus = 'WAITING_REVIEW'
      bookingStatus = 'CONFIRMED'
    }

    // 1. Create Booking in Database
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        tripId: targetTripId,
        packageId,
        selectedAddons,
        isCustomPackage,
        tripDate: new Date(tripDate),
        adults,
        children,
        currency,
        totalPrice,
        pickupLocation: `${hotelName} ${hotelAddress ? `(${hotelAddress})` : ''}`,
        hotelName,
        hotelAddress,
        roomNumber,
        leadPassengerName: fullName,
        leadEmail: email,
        leadPhone: phone,
        leadWhatsApp: whatsApp,
        leadNationality: nationality,
        emergencyContact,
        specialNotes,
        paymentMethod,
        paymentStatus,
        bookingStatus,
        qrToken,
      }
    })

    // 2. If receipt uploaded, create PaymentReceipt record
    if (receiptUrl) {
      await prisma.paymentReceipt.create({
        data: {
          bookingId: booking.id,
          imageUrl: receiptUrl,
          status: 'PENDING'
        }
      })
    }

    // 3. Upsert Customer CRM Profile
    await upsertCustomerCrmProfile({
      email,
      name: fullName,
      phone,
      whatsApp,
      nationality,
      spendUsd: currency === 'USD' ? totalPrice : totalPrice / 1.0,
    })

    // 4. Dispatch Instant Admin Notification (Telegram Bot & WhatsApp Alert Link)
    let tripName = 'Mr. Raw Luxury Excursion'
    if (targetTripId) {
      const t = await prisma.trip.findUnique({ where: { id: targetTripId } })
      if (t) tripName = t.titleAr || t.titleEn
    }

    const notificationResult = await sendAdminBookingAlert({
      bookingNumber: booking.bookingNumber,
      fullName,
      phone,
      whatsApp,
      email,
      tripName,
      tripDate: new Date(tripDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      adults,
      children,
      totalPrice,
      currency,
      hotelName,
      paymentMethod
    })

    // 5. Automatically set user_session cookie for customer
    try {
      const cookieStore = await cookies()
      cookieStore.set('user_session', JSON.stringify({
        id: booking.userId || undefined,
        name: fullName,
        email: email.toLowerCase().trim(),
        role: 'CUSTOMER'
      }), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      cookieStore.set('user_role', 'CUSTOMER', {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    } catch (e) {}

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      qrToken: booking.qrToken,
      telegramAlertSent: notificationResult.telegramSent,
      whatsappAdminUrl: notificationResult.whatsappUrl
    })

  } catch (error: any) {
    console.error('Error creating booking API:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error creating booking.' },
      { status: 500 }
    )
  }
}
