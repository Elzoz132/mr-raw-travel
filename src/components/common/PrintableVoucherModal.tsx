'use client'

import React from 'react'
import { QrCode, Printer, X, ShieldCheck, MapPin, Calendar, Clock, Phone, User, CheckCircle2 } from 'lucide-react'

interface VoucherData {
  bookingNumber: string
  leadPassengerName: string
  leadPhone?: string
  leadEmail?: string
  tripTitle?: string
  tripDate?: string | Date
  pickupLocation?: string
  hotelName?: string
  roomNumber?: string
  adults: number
  children: number
  totalPrice?: number
  currency?: string
  paymentMethod?: string
  bookingStatus?: string
  qrToken?: string
}

interface PrintableVoucherModalProps {
  voucher: VoucherData
  onClose: () => void
}

export const PrintableVoucherModal: React.FC<PrintableVoucherModalProps> = ({ voucher, onClose }) => {
  const formattedDate = voucher.tripDate
    ? new Date(voucher.tripDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'اليوم الموعد المحدد'

  const qrData = voucher.qrToken || `MRRAW-VOUCHER-${voucher.bookingNumber}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Printable CSS Override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-voucher, #printable-voucher * {
            visibility: visible;
          }
          #printable-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 2px solid #D4AF37 !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-voucher"
        className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-2xl space-y-6 bg-[#0B0F17] text-white my-6 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gold-gradient-btn flex items-center justify-center text-[#0B0F17] font-black text-xl">
              RAW
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] block">MR. RAW LUXURY TRAVEL</span>
              <h2 className="text-base font-bold text-white">تذكرة حجز فندقية ورحلة VIP</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-black text-xs">
              #{voucher.bookingNumber}
            </span>
            <span className="block text-[10px] text-slate-400 mt-1">تأكيد حجز معتمد 100%</span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          {/* QR Code */}
          <div className="sm:col-span-1 text-center space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="bg-white p-2.5 rounded-xl inline-block shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`}
                alt="QR Code"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 block truncate">{qrData}</span>
          </div>

          {/* Booking Info Summary */}
          <div className="sm:col-span-2 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">اسم الرحلة / الباقة</span>
              <h3 className="text-base font-extrabold text-white text-[#D4AF37]">
                {voucher.tripTitle || 'رحلة VIP البحر الأحمر بالغردقة'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">اسم العميل المسافر</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {voucher.leadPassengerName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ الرحلة والتحرك</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {formattedDate}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">عدد المسافرين</span>
                <span className="font-bold text-white">
                  {voucher.adults} بالغين {voucher.children > 0 ? `| ${voucher.children} أطفال` : ''}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">مكان التجمع والفندق</span>
                <span className="font-bold text-white flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {voucher.hotelName || voucher.pickupLocation || 'فندق الغردقة'}
                </span>
              </div>
            </div>

            {/* Price & Payment */}
            <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-300 block">إجمالي المبلغ والمواصفات</span>
                <span className="text-sm font-black text-[#D4AF37]">
                  {voucher.totalPrice || 0} {voucher.currency || 'USD'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{voucher.bookingStatus === 'CONFIRMED' ? 'حجز مؤكد 100%' : 'مؤكد مع السائق'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Notes */}
        <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3 flex items-center justify-between">
          <span>يرجى تقديم رمز الـ QR Code للسائق أو قبطان اليخت عند الانطلاق.</span>
          <span>خدمة العملاء والواتساب: 01022392428</span>
        </div>

        {/* Action Buttons */}
        <div className="no-print pt-4 flex items-center justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
          >
            إغلاق
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17] flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ الفاتورة والتذكرة PDF</span>
          </button>
        </div>

      </div>

    </div>
  )
}
