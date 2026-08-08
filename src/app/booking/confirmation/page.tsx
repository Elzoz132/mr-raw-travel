import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { generateQRCodeDataURL } from '@/lib/qr'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { CheckCircle2, Download, MessageSquare, MapPin, Calendar, Users, ShieldCheck, Printer } from 'lucide-react'

interface ConfirmationPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { id } = await searchParams
  if (!id) notFound()

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { trip: true, package: true, receipts: true }
  })

  if (!booking) notFound()

  const qrDataUrl = await generateQRCodeDataURL(booking.qrToken)

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
          RESERVATION CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Your VIP Excursion Voucher is Ready
        </h1>
        <p className="text-xs text-slate-300">
          A confirmation email & WhatsApp message have been sent to <span className="font-bold text-white">{booking.leadEmail}</span>.
        </p>
      </div>

      {/* Luxury Printable Voucher Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/50 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-2xl font-black gold-gradient-text block">Mr.Raw Travel</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Mr.Raw Travel Hurghada Excursions</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Booking Reference</span>
            <span className="text-lg font-mono font-bold text-white">{booking.bookingNumber}</span>
          </div>
        </div>

        {/* QR Code & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex flex-col items-center justify-center space-y-2">
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code Voucher" className="w-32 h-32 rounded-xl bg-white p-2 shadow-xl" />
            )}
            <span className="text-[10px] font-mono text-slate-400">{booking.qrToken}</span>
          </div>

          <div className="sm:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase">
              ● {booking.bookingStatus} & RESERVED
            </div>

            <h3 className="text-lg font-bold text-white">
              {booking.trip.titleEn}
            </h3>

            {booking.package && (
              <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
                👑 Package: {booking.package.nameEn || booking.package.nameAr}
              </div>
            )}

            {booking.selectedAddons && (() => {
              try {
                const parsed = JSON.parse(booking.selectedAddons)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  return (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <span className="font-bold text-[#D4AF37] block">Included Addons / Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {parsed.map((a: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                            ✓ {a.nameEn || a.nameAr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                }
              } catch { return null }
            })()}

            <p className="text-xs text-slate-300">
              Present this digital QR code to your driver/guide upon hotel pickup. Your driver will contact your WhatsApp 2 hours before pickup.
            </p>
          </div>
        </div>

        {/* Excursion Summary Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-slate-400 block mb-1">Excursion Date</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              {new Date(booking.tripDate).toLocaleDateString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-slate-400 block mb-1">Pickup Hotel</span>
            <span className="font-bold text-white flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {booking.hotelName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-slate-400 block mb-1">Guests</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              {booking.adults} Adults, {booking.children} Child
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-slate-400 block mb-1">Total Amount</span>
            <span className="font-extrabold text-[#D4AF37]">
              {formatCurrencyPrice(booking.totalPrice, booking.currency as Currency)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
          <a
            href={`https://wa.me/${booking.leadWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Mr.Raw Travel! Booking Ref: ${booking.bookingNumber}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/30 transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Open WhatsApp Confirmation
          </a>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 text-xs font-bold hover:text-white"
            >
              Return Home
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
