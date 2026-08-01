import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, images: true }
    })
    return NextResponse.json({ success: true, trips })
  } catch (err: any) {
    console.error('Error fetching admin trips:', err)
    return NextResponse.json({ success: true, trips: [] })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      titleEn, titleAr, titleDe,
      descEn, descAr, descDe,
      coverImage,
      priceAdultUsd, priceChildUsd,
      priceAdultEur, priceChildEur,
      priceAdultEgp, priceChildEgp,
      duration, pickupTime, location, maxSeats,
      includedEn, includedAr, includedDe,
      excludedEn, excludedAr, excludedDe,
      itineraryEn, itineraryAr, itineraryDe
    } = body

    if (!titleEn || !coverImage || !priceAdultUsd) {
      return NextResponse.json({ success: false, error: 'Title, cover image, and price are required.' }, { status: 400 })
    }

    const slug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000)

    let categoryId = body.categoryId
    if (!categoryId) {
      const categories = await prisma.tripCategory.findMany({ take: 1 })
      if (categories.length > 0) {
        categoryId = categories[0].id
      } else {
        const newCat = await prisma.tripCategory.create({
          data: {
            slug: 'sea-trips',
            nameEn: 'Sea Trips & Islands',
            nameAr: 'الرحلات البحرية والجزر',
            nameDe: 'Ausflüge aufs Meer & Inseln'
          }
        })
        categoryId = newCat.id
      }
    }

    const tripData: any = {
      slug,
      titleEn,
      titleAr: titleAr || titleEn,
      titleDe: titleDe || titleEn,
      descEn: descEn || titleEn,
      descAr: descAr || titleEn,
      descDe: descDe || titleEn,
      coverImage,
      categoryId,
      priceAdultUsd: parseFloat(priceAdultUsd),
      priceChildUsd: parseFloat(priceChildUsd || Math.round(priceAdultUsd * 0.5)),
      priceAdultEur: parseFloat(priceAdultEur || Math.round(priceAdultUsd * 0.92)),
      priceChildEur: parseFloat(priceChildEur || Math.round(priceAdultUsd * 0.5 * 0.92)),
      priceAdultEgp: parseFloat(priceAdultEgp || Math.round(priceAdultUsd * 48.5)),
      priceChildEgp: parseFloat(priceChildEgp || Math.round(priceAdultUsd * 0.5 * 48.5)),
      duration: duration || '6 Hours',
      pickupTime: pickupTime || '08:00 AM',
      location: location || 'Hurghada',
      maxSeats: parseInt(maxSeats || 30, 10),
      includedEn: JSON.stringify(includedEn || ['VIP Hotel Transfers', 'Lunch Buffet', 'Snorkeling Equipment']),
      includedAr: JSON.stringify(includedAr || ['انتقالات الفندق VIP', 'بوفيه غداء مأكولات بحرية', 'معدات السنوركلنج']),
      includedDe: JSON.stringify(includedDe || ['VIP Hoteltransfers', 'Mittagsbuffet', 'Schnorchelausrüstung']),
      excludedEn: JSON.stringify(excludedEn || ['Personal Expenses', 'Tips / Gratuities']),
      excludedAr: JSON.stringify(excludedAr || ['المصاريف الشخصية', 'الإكراميات']),
      excludedDe: JSON.stringify(excludedDe || ['Persönliche Ausgaben', 'Trinkgelder']),
      itineraryEn: JSON.stringify(itineraryEn || [
        { time: '08:00 AM', title: 'Hotel Pickup', desc: 'Transfer in VIP AC Bus to Marina' },
        { time: '09:00 AM', title: 'Sailing & Snorkeling', desc: 'First snorkeling stop at Coral Reefs' }
      ]),
      itineraryAr: JSON.stringify(itineraryAr || [
        { time: '08:00 ص', title: 'التحرك من الفندق', desc: 'الانتقال بالباص المكيف الفاخر إلى المارينا' },
        { time: '09:00 ص', title: 'الإبحار والسنوركلنج', desc: 'الوقفة الأولى للسنوركلنج عند الشعاب المرجانية' }
      ]),
      itineraryDe: JSON.stringify(itineraryDe || [
        { time: '08:00 Uhr', title: 'Hotelabholung', desc: 'Fahrt im VIP-Klimabus zur Marina' },
        { time: '09:00 Uhr', title: 'Segeln & Schnorcheln', desc: 'Erster Schnorchelstopp am Korallenriff' }
      ])
    }

    const newTrip = await prisma.trip.create({
      data: tripData
    })

    return NextResponse.json({ success: true, trip: newTrip })
  } catch (err: any) {
    console.error('Error creating trip:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Trip ID is required.' }, { status: 400 })
    }

    if (updateData.priceAdultUsd) updateData.priceAdultUsd = parseFloat(updateData.priceAdultUsd)
    if (updateData.priceChildUsd) updateData.priceChildUsd = parseFloat(updateData.priceChildUsd)
    if (updateData.priceAdultEur) updateData.priceAdultEur = parseFloat(updateData.priceAdultEur)
    if (updateData.priceChildEur) updateData.priceChildEur = parseFloat(updateData.priceChildEur)
    if (updateData.priceAdultEgp) updateData.priceAdultEgp = parseFloat(updateData.priceAdultEgp)
    if (updateData.priceChildEgp) updateData.priceChildEgp = parseFloat(updateData.priceChildEgp)

    if (Array.isArray(updateData.includedEn)) updateData.includedEn = JSON.stringify(updateData.includedEn)
    if (Array.isArray(updateData.includedAr)) updateData.includedAr = JSON.stringify(updateData.includedAr)
    if (Array.isArray(updateData.includedDe)) updateData.includedDe = JSON.stringify(updateData.includedDe)
    if (Array.isArray(updateData.excludedEn)) updateData.excludedEn = JSON.stringify(updateData.excludedEn)
    if (Array.isArray(updateData.excludedAr)) updateData.excludedAr = JSON.stringify(updateData.excludedAr)
    if (Array.isArray(updateData.excludedDe)) updateData.excludedDe = JSON.stringify(updateData.excludedDe)
    if (Array.isArray(updateData.itineraryEn)) updateData.itineraryEn = JSON.stringify(updateData.itineraryEn)
    if (Array.isArray(updateData.itineraryAr)) updateData.itineraryAr = JSON.stringify(updateData.itineraryAr)
    if (Array.isArray(updateData.itineraryDe)) updateData.itineraryDe = JSON.stringify(updateData.itineraryDe)

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, trip: updatedTrip })
  } catch (err: any) {
    console.error('Error updating trip:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required.' }, { status: 400 })
    }

    await prisma.trip.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
