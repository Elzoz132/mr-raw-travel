import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { generateBookingNumber } from '@/lib/utils'
import { upsertCustomerCrmProfile } from '@/lib/crm'
import { sendAdminBookingAlert } from '@/lib/notifications'
import { logAuditEvent } from '@/lib/auditLogger'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tripId = body.tripId
    const packageId = body.packageId || null
    const tripDateStr = body.tripDate || new Date().toISOString()
    const tripDate = new Date(tripDateStr)
    const adults = Math.max(1, Number(body.adults) || 1)
    const children = Math.max(0, Number(body.children) || 0)
    const currency = body.currency || 'USD'
    const totalPrice = Number(body.totalPrice) || 0

    const fullName = (body.fullName || body.leadPassengerName || 'Guest Passenger').trim()
    const email = (body.email || body.leadEmail || 'guest@mrrawtravel.com').toLowerCase().trim()
    const phone = (body.phone || body.leadPhone || '+201070657476').trim()
    const whatsApp = (body.whatsApp || body.whatsappPhone || body.leadWhatsApp || phone).trim()
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

    // Fetch default trip if tripId is not provided or placeholder
    let targetTripId = tripId
    if (!targetTripId || targetTripId === '1') {
      const firstTrip = await prisma.trip.findFirst()
      if (firstTrip) {
        targetTripId = firstTrip.id
      }
    }

    if (!targetTripId) {
      return NextResponse.json({ success: false, error: 'A valid excursion must be selected for booking.' }, { status: 400 })
    }

    // 1. Anti-Duplicate / Anti-Double Submit check (within last 60 seconds)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
    const recentDuplicate = await prisma.booking.findFirst({
      where: {
        leadEmail: email,
        tripId: targetTripId,
        createdAt: { gte: oneMinuteAgo }
      }
    })

    if (recentDuplicate) {
      return NextResponse.json({
        success: true,
        bookingId: recentDuplicate.id,
        bookingNumber: recentDuplicate.bookingNumber,
        qrToken: recentDuplicate.qrToken,
        message: 'Existing booking found.'
      })
    }

    const bookingNumber = generateBookingNumber()
    const qrToken = `MRRAW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    let paymentStatus = 'PENDING'
    let bookingStatus = 'PENDING'

    if (paymentMethod === 'CASH') {
      paymentStatus = 'PENDING'
      bookingStatus = 'CONFIRMED'
    } else if (receiptUrl) {
      paymentStatus = 'WAITING_REVIEW'
      bookingStatus = 'CONFIRMED'
    }

    // 2. Execute Booking Creation inside an Atomic Database Transaction
    const totalPassengers = adults + children
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          tripId: targetTripId,
          packageId,
          selectedAddons,
          isCustomPackage,
          tripDate,
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

      if (receiptUrl) {
        await tx.paymentReceipt.create({
          data: {
            bookingId: newBooking.id,
            imageUrl: receiptUrl,
            status: 'PENDING'
          }
        })
      }

      // Update bookedSeats on Trip
      await tx.trip.update({
        where: { id: targetTripId },
        data: { bookedSeats: { increment: totalPassengers } }
      })

      return newBooking
    })

    // 3. Log Audit Event
    await logAuditEvent({
      action: 'BOOKING_CREATED',
      resource: 'BOOKINGS',
      details: { bookingNumber: booking.bookingNumber, tripId: targetTripId, email, totalPrice, currency },
      req
    })

    // 4. Upsert Customer CRM Profile
    await upsertCustomerCrmProfile({
      email,
      name: fullName,
      phone,
      whatsApp,
      nationality,
      spendUsd: currency === 'USD' ? totalPrice : totalPrice / 1.0,
    })

    // 5. Dispatch Alerts
    let tripName = 'Mr. Raw Luxury Excursion'
    const t = await prisma.trip.findUnique({ where: { id: targetTripId } })
    if (t) tripName = t.titleAr || t.titleEn

    const notificationResult = await sendAdminBookingAlert({
      bookingNumber: booking.bookingNumber,
      fullName,
      phone,
      whatsApp,
      email,
      tripName,
      tripDate: tripDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      adults,
      children,
      totalPrice,
      currency,
      hotelName,
      paymentMethod
    })

    // 6. Set Session Cookie
    try {
      const cookieStore = await cookies()
      cookieStore.set('user_session', JSON.stringify({
        id: booking.userId || undefined,
        name: fullName,
        email: email,
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
      { success: false, error: 'Failed to complete booking. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('mrraw_admin_session')
    const userSession = cookieStore.get('user_session')

    const url = new URL(req.url)
    const queryEmail = url.searchParams.get('email')

    let email = queryEmail || ''

    if (!email && userSession?.value) {
      try {
        const u = JSON.parse(userSession.value)
        email = u.email || ''
      } catch {}
    }

    if (adminSession?.value === 'authenticated' && !email) {
      const bookings = await prisma.booking.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { trip: true, package: true, receipts: true }
      })
      return NextResponse.json({ success: true, bookings })
    }

    if (!email) {
      return NextResponse.json({ success: true, bookings: [] })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        leadEmail: { equals: email.trim(), mode: 'insensitive' }
      },
      orderBy: { createdAt: 'desc' },
      include: { trip: true, package: true, receipts: true }
    })

    return NextResponse.json({ success: true, bookings })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings.', bookings: [] }, { status: 500 })
  }
}
