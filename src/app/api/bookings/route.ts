import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateBookingNumber } from '@/lib/utils'
import { upsertCustomerCrmProfile } from '@/lib/crm'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      tripId,
      tripDate,
      adults,
      children,
      currency,
      totalPrice,
      hotelName,
      hotelAddress,
      roomNumber,
      fullName,
      email,
      phone,
      whatsApp,
      nationality,
      emergencyContact,
      specialNotes,
      paymentMethod,
      receiptUrl
    } = body

    if (!tripId || !fullName || !email || !phone || !hotelName) {
      return NextResponse.json(
        { error: 'Missing required booking fields.' },
        { status: 400 }
      )
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
        tripId,
        tripDate: new Date(tripDate || Date.now()),
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        currency: currency || 'USD',
        totalPrice: Number(totalPrice) || 0,
        pickupLocation: `${hotelName} ${hotelAddress ? `(${hotelAddress})` : ''}`,
        hotelName,
        hotelAddress,
        roomNumber,
        leadPassengerName: fullName,
        leadEmail: email,
        leadPhone: phone,
        leadWhatsApp: whatsApp || phone,
        leadNationality: nationality || 'International',
        emergencyContact,
        specialNotes,
        paymentMethod: paymentMethod || 'CASH',
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
      whatsApp: whatsApp || phone,
      nationality: nationality || 'International',
      spendUsd: currency === 'USD' ? totalPrice : totalPrice / 1.0,
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      qrToken: booking.qrToken
    })

  } catch (error) {
    console.error('Error creating booking API:', error)
    return NextResponse.json(
      { error: 'Internal server error creating booking.' },
      { status: 500 }
    )
  }
}
