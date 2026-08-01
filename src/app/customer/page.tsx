import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Calendar, MapPin, QrCode, MessageSquare, PhoneCall, ShieldCheck, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CustomerDashboardPage() {
  const cookieStore = await cookies()
  const userSessionCookie = cookieStore.get('user_session')?.value

  let currentUser: { id?: string; name?: string; email?: string; role?: string } | null = null
  if (userSessionCookie) {
    try {
      currentUser = JSON.parse(userSessionCookie)
    } catch {
      currentUser = null
    }
  }

  let bookings: any[] = []
  let whatsappNumber = '01070657476'

  if (currentUser?.email) {
    try {
      bookings = await prisma.booking.findMany({
        where: {
          OR: [
            ...(currentUser.id ? [{ userId: currentUser.id }] : []),
            { leadEmail: { equals: currentUser.email, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: { trip: true, package: true, receipts: true }
      })
    } catch (error) {
      console.error('Error fetching customer bookings:', error)
    }
  }

  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'whatsapp_number' } })
    if (setting?.value) {
      whatsappNumber = setting.value
    }
  } catch (error) {
    console.error('Error fetching whatsapp setting:', error)
  }

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  const formattedWaUrl = `https://wa.me/${cleanNumber.startsWith('0') ? '2' + cleanNumber : cleanNumber}?text=${encodeURIComponent(
    'مرحباً، أود التواصل مع خدمة العملاء بخصوص حجوزاتي في Mr.Raw Travel 🌴'
  )}`

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E5C158] to-[#D4AF37] p-0.5 shadow-xl flex items-center justify-center text-slate-900 font-bold text-2xl">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-8 h-8 text-[#0B0F17]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                {currentUser?.name || 'حساب العميل VIP'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold">
                VIP MEMBER 👑
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.email ? currentUser.email : 'عميل مسجل ومحمي ١٠٠% في منظومة Mr.Raw Travel'}
            </p>
          </div>
        </div>

        {/* WhatsApp Customer Support Card */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={formattedWaUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>التواصل مع خدمة العملاء عبر الواتساب ({whatsappNumber})</span>
          </a>
        </div>
      </div>

      {/* Bookings List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
            حجوزاتي والفووتشرات الرقمية (My Reservations)
          </h2>
        </div>

        {!currentUser ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-300 space-y-4">
            <h3 className="text-lg font-bold text-white">تسجيل الدخول عرض الحجوزات</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              يرجى تسجيل الدخول بحسابك لعرض حجوزاتك التفاعلية والفووتشرات الخاصة بك.
            </p>
            <Link href="/">
              <LuxuryButton variant="gold" size="md">
                العودة للرئيسية وتسجيل الدخول
              </LuxuryButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={b.trip?.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'}
                    alt={b.trip?.titleEn || 'Trip'}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{b.bookingNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {b.bookingStatus}
                      </span>
                      {b.package && (
                        <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold">
                          👑 {b.package.nameAr || b.package.nameEn}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{b.trip?.titleAr || b.trip?.titleEn}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {new Date(b.tripDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {b.hotelName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">إجمالي المدفوع</span>
                    <span className="text-base font-black text-[#D4AF37]">
                      {formatCurrencyPrice(b.totalPrice, b.currency as Currency, 'ar')}
                    </span>
                  </div>

                  <a
                    href={`/booking/confirmation?id=${b.id}`}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center gap-2 transition-all"
                  >
                    <QrCode className="w-4 h-4" /> عرض فووتشر الـ QR
                  </a>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-sm space-y-3">
                <p>لا يوجد لديك حجوزات سابقة حالياً.</p>
                <Link href="/trips">
                  <LuxuryButton variant="gold" size="sm">تصفح باقات ورحلات الغردقة</LuxuryButton>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
