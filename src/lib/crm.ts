import { prisma } from './db'

export async function upsertCustomerCrmProfile(params: {
  email: string
  name: string
  phone?: string
  whatsApp?: string
  nationality?: string
  country?: string
  spendUsd: number
  categorySlug?: string
}) {
  try {
    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: params.email },
      include: { customerProfile: true }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: params.email,
          name: params.name,
          phone: params.phone,
          whatsApp: params.whatsApp,
          nationality: params.nationality,
          country: params.country,
          role: 'CUSTOMER'
        },
        include: { customerProfile: true }
      })
    }

    const currentProfile = user.customerProfile
    const newTotalSpend = (currentProfile?.totalSpendUsd || 0) + params.spendUsd
    const newBookingCount = (currentProfile?.bookingCount || 0) + 1

    // Compute VIP Segment based on LTV
    let segment = 'STANDARD'
    if (newTotalSpend >= 500 || newBookingCount >= 3) {
      segment = 'VIP'
    } else if (newTotalSpend >= 250 || newBookingCount >= 2) {
      segment = 'GOLD'
    }

    const tagsArray = JSON.parse(currentProfile?.tags || '[]')
    if (params.nationality && !tagsArray.includes(params.nationality)) {
      tagsArray.push(params.nationality)
    }
    if (params.categorySlug && !tagsArray.includes(params.categorySlug)) {
      tagsArray.push(params.categorySlug)
    }

    // 2. Upsert CustomerProfile
    await prisma.customerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalSpendUsd: params.spendUsd,
        bookingCount: 1,
        segment: segment,
        favoriteCategory: params.categorySlug,
        tags: JSON.stringify(tagsArray)
      },
      update: {
        totalSpendUsd: { increment: params.spendUsd },
        bookingCount: { increment: 1 },
        segment: segment,
        favoriteCategory: params.categorySlug || currentProfile?.favoriteCategory,
        tags: JSON.stringify(tagsArray)
      }
    })

    return user
  } catch (error) {
    console.error('Error updating customer CRM profile:', error)
    return null
  }
}
