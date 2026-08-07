import { prisma } from '@/lib/db'
import { createInAppNotification } from '@/lib/notifications'

export function convertToEgp(amount: number, currency: string = 'EGP'): number {
  const c = currency.toUpperCase().trim()
  if (c === 'USD') return amount * 48.5
  if (c === 'EUR') return amount * 52.7
  if (c === 'GBP') return amount * 62.0
  return amount // EGP
}

/**
 * Calculates and awards Royal Loyalty Points when a booking is CONFIRMED.
 * Rule: 500 points per 1,000 EGP paid.
 */
export async function awardLoyaltyPointsForBooking(bookingId: string): Promise<number> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) return 0

    // Prevent double awarding of points
    if (booking.pointsEarned > 0) {
      return booking.pointsEarned
    }

    const egpAmount = convertToEgp(booking.totalPrice, booking.currency)
    const pointsToAward = Math.floor((egpAmount / 1000) * 500)

    if (pointsToAward <= 0) return 0

    // Find or locate User by leadEmail
    const user = await prisma.user.findFirst({
      where: { email: { equals: booking.leadEmail.toLowerCase().trim(), mode: 'insensitive' } }
    })

    const userId = user ? user.id : booking.userId

    if (userId) {
      await prisma.$transaction(async (tx) => {
        // Upsert LoyaltyPoints
        await tx.loyaltyPoints.upsert({
          where: { userId },
          create: {
            userId,
            pointsBalance: pointsToAward,
            lifetimePoints: pointsToAward
          },
          update: {
            pointsBalance: { increment: pointsToAward },
            lifetimePoints: { increment: pointsToAward }
          }
        })

        // Create transaction log
        await tx.loyaltyTransaction.create({
          data: {
            userId,
            bookingId: booking.id,
            points: pointsToAward,
            type: 'EARNED_BOOKING',
            description: `كسب ${pointsToAward} نقطة ولاء ملَكية لحجز رحلة #${booking.bookingNumber}`
          }
        })

        // Update booking pointsEarned record
        await tx.booking.update({
          where: { id: booking.id },
          data: { pointsEarned: pointsToAward }
        })
      })

      // Send notification & email
      await createInAppNotification({
        userId,
        userEmail: booking.leadEmail,
        title: '👑 تهانينا! تم إضافة نقاط ولاء ملَكية لحسابك',
        message: `تم إضافة ${pointsToAward} نقطة ولاء ملكية إلى حسابك مقابل تأكيد حجز رحلتك برقم #${booking.bookingNumber}. يمكنك استخدام نقاطك للحصول على خصومات حصرية من صفحة جوائزي!`,
        type: 'LOYALTY_EARNED',
        link: '/customer/rewards'
      })
    }

    return pointsToAward
  } catch (err) {
    console.error('Error awarding loyalty points:', err)
    return 0
  }
}

/**
 * Deducts loyalty points if a booking is CANCELLED.
 */
export async function deductLoyaltyPointsForCancellation(bookingId: string): Promise<void> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking || booking.pointsEarned <= 0) return

    const pointsToDeduct = booking.pointsEarned

    const user = await prisma.user.findFirst({
      where: { email: { equals: booking.leadEmail.toLowerCase().trim(), mode: 'insensitive' } }
    })

    const userId = user ? user.id : booking.userId

    if (userId) {
      await prisma.$transaction(async (tx) => {
        const lp = await tx.loyaltyPoints.findUnique({ where: { userId } })
        if (lp) {
          const newBalance = Math.max(0, lp.pointsBalance - pointsToDeduct)
          await tx.loyaltyPoints.update({
            where: { userId },
            data: { pointsBalance: newBalance }
          })
        }

        await tx.loyaltyTransaction.create({
          data: {
            userId,
            bookingId: booking.id,
            points: -pointsToDeduct,
            type: 'CANCELLED_DEDUCTION',
            description: `خصم ${pointsToDeduct} نقطة بسبب إلغاء الحجز #${booking.bookingNumber}`
          }
        })

        await tx.booking.update({
          where: { id: booking.id },
          data: { pointsEarned: 0 }
        })
      })

      await createInAppNotification({
        userId,
        userEmail: booking.leadEmail,
        title: 'إشعار خصم نقاط ولاء',
        message: `تم خصم ${pointsToDeduct} نقطة ولاء بسبب إلغاء الرحلة برقم #${booking.bookingNumber}.`,
        type: 'BOOKING_CANCELLED',
        link: '/customer/rewards'
      })
    }
  } catch (err) {
    console.error('Error deducting loyalty points:', err)
  }
}

/**
 * Redeems user points to generate a real discount coupon code.
 */
export async function redeemPointsForCoupon(userId: string, pointsToRedeem: number): Promise<{ success: boolean; couponCode?: string; discountPercent?: number; error?: string }> {
  try {
    if (![1000, 2000].includes(pointsToRedeem)) {
      return { success: false, error: 'يمكنك استبدال 1000 نقطة (خصم 10%) أو 2000 نقطة (خصم 20%).' }
    }

    const discountPercent = pointsToRedeem === 1000 ? 10 : 20

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { success: false, error: 'المستخدم غير موجود.' }
    }

    const lp = await prisma.loyaltyPoints.findUnique({ where: { userId } })
    if (!lp || lp.pointsBalance < pointsToRedeem) {
      return { success: false, error: `عفواً، رصيد نقاطك غير كافٍ. تحتاج إلى ${pointsToRedeem} نقطة واسبتدالها المتاح لديك حالياً هو ${lp?.pointsBalance || 0} نقطة.` }
    }

    const couponCode = `ROYAL-${discountPercent}OFF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    await prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.loyaltyPoints.update({
        where: { userId },
        data: { pointsBalance: { decrement: pointsToRedeem } }
      })

      // Record transaction
      await tx.loyaltyTransaction.create({
        data: {
          userId,
          points: -pointsToRedeem,
          type: 'REDEEMED_COUPON',
          description: `استبدال ${pointsToRedeem} نقطة بكوبون خصم ${discountPercent}% كود: ${couponCode}`
        }
      })

      // Create Coupon record in database
      await tx.coupon.create({
        data: {
          code: couponCode,
          type: 'PERCENTAGE',
          value: discountPercent,
          minSpend: 0,
          maxUses: 1,
          usedCount: 0,
          isActive: true,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
        }
      })
    })

    // Create Notification
    await createInAppNotification({
      userId,
      userEmail: user.email,
      title: '🎟️ تم إنشاء كوبون الخصم بنجاح!',
      message: `تم إنشاء كوبون خصم بمقدار ${discountPercent}% بكود: (${couponCode}). يمكنك استخدامه مباشرة عند حجز رحلتك القادمة.`,
      type: 'COUPON_CREATED',
      link: '/customer/rewards'
    })

    return {
      success: true,
      couponCode,
      discountPercent
    }
  } catch (err: any) {
    console.error('Error redeeming points:', err)
    return { success: false, error: 'حدث خطأ أثناء استبدال النقاط.' }
  }
}
