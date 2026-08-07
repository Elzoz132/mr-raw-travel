'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Printer, CheckCircle2, XCircle, AlertTriangle, Eye, MessageSquare, Download, Clock, Sparkles } from 'lucide-react'

interface AdminBookingsClientProps {
  bookings: Array<{
    id: string
    bookingNumber: string
    leadPassengerName: string
    leadPhone: string
    leadEmail: string
    leadWhatsApp?: string | null
    hotelName: string
    roomNumber?: string | null
    tripDate: string | Date
    paymentMethod: string
    paymentStatus: string
    bookingStatus: string
    totalPrice: number
    currency: string
    qrToken: string
    rejectionReason?: string | null
    cancellationReason?: string | null
    trip?: { titleEn: string; titleAr?: string } | null
    package?: { nameEn: string; nameAr?: string } | null
    receipts?: { imageUrl: string; status: string }[]
  }>
}

export const AdminBookingsClient: React.FC<AdminBookingsClientProps> = ({ bookings: initialBookings }) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [bookings, setBookings] = useState(initialBookings)
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAYMENT_VERIFICATION'>('ALL')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  // Modals
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null)
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null)
  const [rejectionInput, setRejectionInput] = useState('')

  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)
  const [cancellationInput, setCancellationInput] = useState('')

  const [msg, setMsg] = useState('')

  const handleApprovePayment = async (bookingId: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من اعتماد وموافقة الدفع وتأكيد الحجز وتوليد النقاط؟' : 'Approve payment & confirm booking?')) return

    setLoadingId(bookingId)
    setMsg('')

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/approve-payment`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل قبول الدفع.')
      }

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, paymentStatus: 'PAID', bookingStatus: 'CONFIRMED' } : b))
      setMsg(isArabic ? `تم قبول الدفع وتأكيد الحجز بنجاح! تم منح العميل ${data.pointsAwarded || 0} نقطة ولاء.` : 'Payment approved and booking confirmed!')
    } catch (err: any) {
      alert(err.message || 'Error approving payment.')
    } finally {
      setLoadingId(null)
    }
  }

  const handleRejectPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingBookingId) return

    setLoadingId(rejectingBookingId)
    setMsg('')

    try {
      const res = await fetch(`/api/admin/bookings/${rejectingBookingId}/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionInput || 'إيصال التحويل المرفق غير واضح أو غير مكتمل.' })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفض الإيصال.')
      }

      setBookings(bookings.map(b => b.id === rejectingBookingId ? { ...b, paymentStatus: 'REJECTED', rejectionReason: rejectionInput } : b))
      setRejectingBookingId(null)
      setRejectionInput('')
      setMsg(isArabic ? 'تم رفض إيصال الدفع وإرسال إشعار للعميل يتيح له إعادة الرفع.' : 'Receipt rejected and customer notified.')
    } catch (err: any) {
      alert(err.message || 'Error rejecting payment.')
    } finally {
      setLoadingId(null)
    }
  }

  const handleCancelBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cancellingBookingId) return

    setLoadingId(cancellingBookingId)
    setMsg('')

    try {
      const res = await fetch(`/api/admin/bookings/${cancellingBookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancellationInput || 'تم إلغاء الحجز بواسطة الإدارة.' })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل إلغاء الحجز.')
      }

      setBookings(bookings.map(b => b.id === cancellingBookingId ? { ...b, bookingStatus: 'CANCELLED', cancellationReason: cancellationInput } : b))
      setCancellingBookingId(null)
      setCancellationInput('')
      setMsg(isArabic ? 'تم إلغاء الحجز وخصم أي نقاط ولاء سابقة بنجاح.' : 'Booking cancelled and loyalty points reverted.')
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking.')
    } finally {
      setLoadingId(null)
    }
  }

  const pendingVerificationBookings = bookings.filter(b => b.paymentStatus === 'WAITING_REVIEW' || (b.receipts && b.receipts.some(r => r.status === 'PENDING')))
  const displayedBookings = activeTab === 'PAYMENT_VERIFICATION' ? pendingVerificationBookings : bookings

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Header Navbar */}
      <AdminHeader />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            {isArabic ? 'إدارة الحجوزات والتحقق من الدفع اليدوي' : 'EXCURSION BOOKINGS CMS'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'إدارة وتفاصيل الحجوزات والدفع' : 'Bookings & Payment Operations'}
          </h1>
        </div>

        <a
          href="/api/export?type=bookings"
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs hover:bg-[#E5C158] transition"
        >
          {isArabic ? 'تصدير بيانات الحجوزات Excel' : 'Download CSV Export'}
        </a>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-white hover:text-emerald-300">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#D4AF37] text-[#0B0F17]'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          {isArabic ? `جميع الحجوزات (${bookings.length})` : `All Bookings (${bookings.length})`}
        </button>

        <button
          onClick={() => setActiveTab('PAYMENT_VERIFICATION')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'PAYMENT_VERIFICATION'
              ? 'bg-amber-500 text-black font-extrabold shadow-lg'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isArabic ? `مراجعة إيصالات الدفع اليدوي (${pendingVerificationBookings.length})` : `Payment Verification (${pendingVerificationBookings.length})`}</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        {displayedBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            {activeTab === 'PAYMENT_VERIFICATION' ? 'لا يوجد إيصالات دفع معلقة بانتظار المراجعة حالياً.' : 'لا يوجد حجوزات مسجلة.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">{isArabic ? 'رقم الحجز' : 'Ref'}</th>
                  <th className="pb-3">{isArabic ? 'العميل والتواصل' : 'Customer'}</th>
                  <th className="pb-3">{isArabic ? 'الرحلة والباقة' : 'Excursion'}</th>
                  <th className="pb-3">{isArabic ? 'الفندق والغرفة' : 'Hotel & Room'}</th>
                  <th className="pb-3">{isArabic ? 'طريقة وحالة الدفع' : 'Payment'}</th>
                  <th className="pb-3">{isArabic ? 'الإجمالي' : 'Total'}</th>
                  <th className="pb-3">{isArabic ? 'الإجراءات والمراجعة' : 'Actions & Verification'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedBookings.map((b) => {
                  const tripTitle = isArabic ? (b.trip?.titleAr || b.trip?.titleEn) : b.trip?.titleEn
                  const packageName = b.package ? (isArabic ? b.package.nameAr : b.package.nameEn) : ''
                  const receiptUrl = b.receipts && b.receipts.length > 0 ? b.receipts[0].imageUrl : null

                  const isPendingReview = b.paymentStatus === 'WAITING_REVIEW' || (b.receipts && b.receipts.some(r => r.status === 'PENDING'))

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* Ref */}
                      <td className="py-4 font-mono font-bold text-[#D4AF37]">
                        <span className="block">#{b.bookingNumber}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(b.tripDate).toLocaleDateString()}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-4">
                        <span className="font-bold text-white block">{b.leadPassengerName}</span>
                        <span className="text-[10px] text-slate-400 block">{b.leadPhone}</span>
                        <span className="text-[10px] text-slate-400 block">{b.leadEmail}</span>
                      </td>

                      {/* Excursion */}
                      <td className="py-4">
                        <span className="font-bold text-white block truncate max-w-xs">{tripTitle || 'Mr.Raw Excursion'}</span>
                        {packageName && <span className="text-[10px] text-[#D4AF37] font-bold block">{packageName}</span>}
                      </td>

                      {/* Hotel */}
                      <td className="py-4 text-slate-300">
                        <span className="font-semibold text-white block">{b.hotelName}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {isArabic ? `غرفة: ${b.roomNumber || 'غير محدد'}` : `Room: ${b.roomNumber || 'N/A'}`}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4">
                        <span className="font-bold text-slate-200 block">{b.paymentMethod}</span>
                        <span className={`text-[10px] font-bold block ${
                          b.paymentStatus === 'PAID' ? 'text-emerald-400' :
                          b.paymentStatus === 'REJECTED' ? 'text-rose-400' :
                          b.paymentStatus === 'WAITING_REVIEW' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {b.paymentStatus === 'PAID' ? (isArabic ? 'تم الدفع (Paid)' : 'PAID') :
                           b.paymentStatus === 'REJECTED' ? (isArabic ? 'مرفوض (Rejected)' : 'REJECTED') :
                           b.paymentStatus === 'WAITING_REVIEW' ? (isArabic ? 'إيصال قيد المراجعة' : 'REVIEW') : (isArabic ? 'معلق' : 'PENDING')}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 font-black text-[#D4AF37]">
                        {formatCurrencyPrice(b.totalPrice, (b.currency as Currency) || 'USD', language)}
                      </td>

                      {/* Actions */}
                      <td className="py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          
                          {/* Receipt Image Button if present */}
                          {receiptUrl && (
                            <button
                              onClick={() => setPreviewReceiptUrl(receiptUrl)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-[11px] flex items-center gap-1 transition"
                              title="معاينة إيصال الدفع"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>الإيصال</span>
                            </button>
                          )}

                          {/* Approve Payment Button */}
                          {(b.paymentStatus !== 'PAID' || b.bookingStatus !== 'CONFIRMED') && (
                            <button
                              onClick={() => handleApprovePayment(b.id)}
                              disabled={loadingId === b.id}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[11px] hover:bg-emerald-400 flex items-center gap-1 transition shadow"
                              title="موافقة الدفع وتأكيد الحجز وتوليد النقاط"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'قبول الدفع' : 'Approve'}</span>
                            </button>
                          )}

                          {/* Reject Payment Button */}
                          {b.paymentStatus !== 'REJECTED' && (
                            <button
                              onClick={() => setRejectingBookingId(b.id)}
                              disabled={loadingId === b.id}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-[11px] flex items-center gap-1 transition"
                              title="رفض الإيصال وإشعار العميل"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'رفض الإيصال' : 'Reject'}</span>
                            </button>
                          )}

                          {/* Cancel Booking Button */}
                          {b.bookingStatus !== 'CANCELLED' && (
                            <button
                              onClick={() => setCancellingBookingId(b.id)}
                              disabled={loadingId === b.id}
                              className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px] font-bold transition"
                              title="إلغاء الحجز وخصم النقاط"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* WhatsApp Customer */}
                          <a
                            href={`https://wa.me/${(b.leadWhatsApp || b.leadPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${b.leadPassengerName}، بخصوص حجزك رقم #${b.bookingNumber} لدى Mr.Raw Travel`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            title="التواصل عبر الواتساب"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          {/* Print / View Voucher */}
                          <a
                            href={`/booking/confirmation?id=${b.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-[#D4AF37] hover:bg-white/10"
                            title="طباعة وتحميل الفوچر"
                          >
                            <Printer className="w-4 h-4" />
                          </a>

                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Image Preview Modal */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/50 max-w-2xl w-full text-center space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">معاينة إيصال التحويل المرفق</h3>
              <button onClick={() => setPreviewReceiptUrl(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-white/15 bg-black/40">
              <img src={previewReceiptUrl} alt="Receipt Preview" className="w-full h-auto object-contain mx-auto" />
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleRejectPaymentSubmit} className="glass-panel p-6 rounded-3xl border border-rose-500/50 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white border-l-4 border-rose-500 pl-3">رفض إيصال الدفع المرفق</h3>
            <p className="text-xs text-slate-300">اكتب سبب رفض الإيصال وسيتم إرساله في إشعار وبريد إلكتروني للعميل ليتيح له إعادة الرفع:</p>
            
            <textarea
              rows={3}
              required
              placeholder="مثال: الإيصال المرفق غير واضح أو المبلغ المدفوع لا يطابق إجمالي سعر الحجز."
              value={rejectionInput}
              onChange={(e) => setRejectionInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setRejectingBookingId(null)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition">تأكيد الرفض والإرسال</button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCancelBookingSubmit} className="glass-panel p-6 rounded-3xl border border-rose-500/50 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white border-l-4 border-rose-500 pl-3">إلغاء حجز الرحلة</h3>
            <p className="text-xs text-slate-300">اكتب سبب إلغاء الحجز (سيتم خصم أي نقاط ولاء مكتسبة تلقائياً وإشعار العميل):</p>
            
            <textarea
              rows={3}
              required
              placeholder="مثال: بناءً على طلب العميل أو بسبب الأحوال الجوية في البحر."
              value={cancellationInput}
              onChange={(e) => setCancellationInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setCancellingBookingId(null)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition">تأكيد الإلغاء وخصم النقاط</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
