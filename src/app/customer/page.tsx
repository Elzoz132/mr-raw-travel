import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Calendar, MapPin, Heart, ShieldCheck, User, QrCode, FileText, CheckCircle2, Clock } from 'lucide-react'

export default async function CustomerDashboardPage() {
  let bookings: any[] = []

  try {
    bookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { trip: true, receipts: true }
    })
  } catch (error) {
    console.error('Error fetching customer bookings:', error)
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E5C158] to-[#D4AF37] p-0.5 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
              alt="Customer Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Alexander Schmidt</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold">
                VIP MEMBER 👑
              </span>
            </div>
            <p className="text-xs text-slate-400">alex.schmidt@example.de • Munich, Germany</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-slate-400 block text-[10px] uppercase">Bookings</span>
            <span className="text-lg font-extrabold text-white">{bookings.length || 2}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-slate-400 block text-[10px] uppercase">Total Spend</span>
            <span className="text-lg font-extrabold text-[#D4AF37]">$385</span>
          </div>
        </div>
      </div>

      {/* Bookings List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
            My Excursion Reservations
          </h2>
        </div>

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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{b.bookingNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {b.bookingStatus}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{b.trip?.titleEn}</h3>
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
                  <span className="text-[10px] text-slate-400 block">Total Paid</span>
                  <span className="text-base font-black text-[#D4AF37]">
                    {formatCurrencyPrice(b.totalPrice, b.currency as Currency)}
                  </span>
                </div>

                <a
                  href={`/booking/confirmation?id=${b.id}`}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center gap-2 transition-all"
                >
                  <QrCode className="w-4 h-4" /> View QR Voucher
                </a>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-sm space-y-3">
              <p>You have no active excursion bookings yet.</p>
              <Link href="/trips">
                <LuxuryButton variant="gold" size="sm">Explore Hurghada Trips</LuxuryButton>
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
