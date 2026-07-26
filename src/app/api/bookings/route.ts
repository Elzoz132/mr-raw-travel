import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateBookingNumber } from '@/lib/utils'
import { upsertCustomerCrmProfile } from '@/lib/crm'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tripId = body.tripId
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

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      qrToken: booking.qrToken
    })

  } catch (error: any) {
    console.error('Error creating booking API:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error creating booking.' },
      { status: 500 }
    )
  }
}
