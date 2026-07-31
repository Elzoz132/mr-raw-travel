import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Verification endpoint to check if user can leave a review
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const tripId = searchParams.get('tripId')

    if (!email) {
      return NextResponse.json({ isEligible: false, reason: 'Email parameter required' })
    }

    // Check if user has an account
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ isEligible: false, reason: 'Account required' })
    }

    // Check if user has completed at least one booking
    const completedBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: user.id },
          { leadEmail: email }
        ],
        bookingStatus: { in: ['COMPLETED', 'CONFIRMED'] },
        ...(tripId ? { tripId } : {})
      },
      include: { package: true, trip: true }
    })

    if (completedBookings.length === 0) {
      return NextResponse.json({
        isEligible: false,
        reason: 'Must have at least one confirmed or completed booking'
      })
    }

    return NextResponse.json({
      isEligible: true,
      user: { id: user.id, name: user.name, email: user.email, country: user.country, avatar: user.avatar },
      bookings: completedBookings.map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        tripId: b.tripId,
        tripTitle: b.trip.titleEn,
        packageId: b.packageId,
        packageName: b.package?.nameEn || 'Standard',
        tripDate: b.tripDate
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ isEligible: false, error: error.message }, { status: 500 })
  }
}

// Submit a new verified review
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      tripId,
      packageId,
      bookingId,
      author,
      country = 'Germany',
      rating = 5,
      title,
      comment,
      avatar,
      photos,
      travelDate,
      isAnonymous = false
    } = body

    if (!email || !tripId || !comment) {
      return NextResponse.json({ error: 'Email, tripId, and comment are required' }, { status: 400 })
    }

    // Verify user eligibility
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 400 })
    }

    const verifiedBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { leadEmail: email }
        ],
        tripId,
        bookingStatus: { in: ['COMPLETED', 'CONFIRMED'] }
      }
    })

    if (!verifiedBooking) {
      return NextResponse.json({ error: 'Only verified customers with completed bookings can review this trip' }, { status: 403 })
    }

    const review = await prisma.review.create({
      data: {
        tripId,
        packageId: packageId || verifiedBooking.packageId,
        bookingId: bookingId || verifiedBooking.id,
        userId: user.id,
        author: isAnonymous ? 'Anonymous Guest' : (author || user.name || 'Verified Traveler'),
        country: country || user.country || 'Germany',
        rating: Number(rating),
        title,
        comment,
        avatar: isAnonymous ? null : (avatar || user.avatar),
        photos: typeof photos === 'object' ? JSON.stringify(photos) : photos,
        travelDate: travelDate ? new Date(travelDate) : verifiedBooking.tripDate,
        isVerified: true,
        status: 'PENDING', // Requires Admin approval
        isAnonymous: Boolean(isAnonymous)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted for verification.',
      review
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 })
  }
}
