import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'bookings'

  try {
    if (type === 'customers') {
      const customers = await prisma.customerProfile.findMany({
        include: { user: true }
      })

      let csv = 'ID,Name,Email,Phone,Nationality,Segment,BookingCount,TotalSpendUSD\n'
      customers.forEach((c) => {
        csv += `"${c.id}","${c.user?.name || ''}","${c.user?.email || ''}","${c.user?.phone || ''}","${c.user?.nationality || ''}","${c.segment}",${c.bookingCount},${c.totalSpendUsd}\n`
      })

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="customers_export.csv"',
        },
      })
    } else {
      const bookings = await prisma.booking.findMany({
        include: { trip: true }
      })

      let csv = 'BookingRef,LeadName,Email,Phone,Hotel,TripTitle,Date,Currency,TotalPrice,PaymentStatus,BookingStatus\n'
      bookings.forEach((b) => {
        csv += `"${b.bookingNumber}","${b.leadPassengerName}","${b.leadEmail}","${b.leadPhone}","${b.hotelName}","${b.trip?.titleEn || ''}","${new Date(b.tripDate).toLocaleDateString()}","${b.currency}",${b.totalPrice},"${b.paymentStatus}","${b.bookingStatus}"\n`
      })

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="bookings_export.csv"',
        },
      })
    }
  } catch (error) {
    console.error('Error generating CSV export:', error)
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 })
  }
}
