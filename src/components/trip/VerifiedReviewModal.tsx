'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { Star, ShieldCheck, X, Upload, Check, AlertCircle, Camera } from 'lucide-react'
import { uploadMedia } from '@/lib/cloudinary'

interface VerifiedReviewModalProps {
  tripId: string
  tripTitle: string
  isOpen: boolean
  onClose: () => void
  onReviewSubmitted?: () => void
}

export const VerifiedReviewModal: React.FC<VerifiedReviewModalProps> = ({
  tripId,
  tripTitle,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [step, setStep] = useState<'VERIFY' | 'FORM' | 'SUCCESS'>('VERIFY')
  const [email, setEmail] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [userBookings, setUserBookings] = useState<any[]>([])

  // Review Form State
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [country, setCountry] = useState('Germany')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (!isOpen) return null

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setVerifyError('')

    try {
      const res = await fetch(`/api/reviews?email=${encodeURIComponent(email)}&tripId=${tripId}`)
      const data = await res.json()

      if (data.isEligible && data.bookings?.length > 0) {
        setUserBookings(data.bookings)
        setAuthorName(data.user?.name || '')
        setCountry(data.user?.country || 'Germany')
        setSelectedBookingId(data.bookings[0].id)
        setSelectedPackageId(data.bookings[0].packageId || '')
        setStep('FORM')
      } else {
        setVerifyError(
          data.reason ||
            (isArabic
              ? 'عفواً، لا يملك هذا الحساب حجزاً مؤكداً لهذه الرحلة. التقييم متاح فقط للعملاء الموثقين.'
              : 'Sorry, this email has no verified completed booking for this excursion.')
        )
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhoto(true)
    try {
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const result = await uploadMedia(files[i])
        uploadedUrls.push(result.url)
      }
      setPhotos((prev) => [...prev, ...uploadedUrls])
    } catch (err) {
      console.error('Photo upload failed', err)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tripId,
          packageId: selectedPackageId,
          bookingId: selectedBookingId,
          author: authorName,
          country,
          rating,
          title,
          comment,
          photos,
          isAnonymous
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStep('SUCCESS')
        if (onReviewSubmitted) onReviewSubmitted()
      } else {
        setSubmitError(data.error || 'Failed to submit review')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isArabic ? 'تقييم عميل موثق VIP' : 'Verified Customer Review'}
            </h3>
            <p className="text-xs text-[#D4AF37] font-semibold">{tripTitle}</p>
          </div>
        </div>

        {/* STEP 1: Verification Check */}
        {step === 'VERIFY' && (
          <form onSubmit={handleVerify} className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              {isArabic
                ? 'لضمان المصداقية، يُسمح فقط للعملاء الذين أكملوا رحلتهم بكتابة التقييمات. يرجى إدخال البريد الإلكتروني المستخدم في الحجز.'
                : 'To maintain 100% genuine reviews, only verified guests with a confirmed booking can write a review. Enter your booking email below.'}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {isArabic ? 'البريد الإلكتروني للحجز' : 'Booking Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-xl gold-gradient-btn font-bold text-xs uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2"
            >
              {verifying ? (isArabic ? 'جاري التحقق...' : 'Verifying Booking...') : (isArabic ? 'التحقق ومتابعة التقييم' : 'Verify Booking & Continue')}
            </button>
          </form>
        )}

        {/* STEP 2: Review Form */}
        {step === 'FORM' && (
          <form onSubmit={handleSubmitReview} className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Booking Selector if multiple */}
            {userBookings.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isArabic ? 'اختر حجزك المكتمل' : 'Select Your Completed Booking'}
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => {
                    setSelectedBookingId(e.target.value)
                    const b = userBookings.find((x) => x.id === e.target.value)
                    if (b) setSelectedPackageId(b.packageId || '')
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                >
                  {userBookings.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#0F172A]">
                      #{b.bookingNumber} - {b.packageName} ({new Date(b.tripDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Stars */}
            <div className="space-y-1.5 text-center py-2 bg-white/5 rounded-2xl border border-white/10">
              <label className="text-xs font-bold text-slate-300 block">
                {isArabic ? 'تقييمك للرحلة' : 'Your Rating'}
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Author & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">{isArabic ? 'الاسم' : 'Your Name'}</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">{isArabic ? 'الدولة' : 'Country'}</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            {/* Review Title & Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">{isArabic ? 'عنوان التقييم' : 'Review Title'}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isArabic ? 'مثال: رحلة فاخرة لا تُنسى!' : 'e.g. Unforgettable VIP Yacht Cruise!'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">{isArabic ? 'تفاصيل تجربتك' : 'Your Review'}</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isArabic ? 'اكتب رأيك بالتفصيل عن الخدمة واليخت والمرشد...' : 'Share your real experience regarding food, staff, transfers, snorkeling...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>

            {/* Upload Photos */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>{isArabic ? 'إضافة صور من رحلتك (اختياري)' : 'Add Photos of your trip (Optional)'}</span>
                {uploadingPhoto && <span className="text-[#D4AF37] text-[10px] animate-pulse">Uploading...</span>}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                    <img src={p} alt="Review attachment" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-16 h-16 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#D4AF37] flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-white">
                  <Camera className="w-5 h-5 mb-1 text-[#D4AF37]" />
                  <span className="text-[9px]">Add</span>
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded accent-[#D4AF37]"
              />
              <label htmlFor="anon" className="text-xs text-slate-300 cursor-pointer">
                {isArabic ? 'نشر التقييم باسم مجهول (Anonymous)' : 'Post review anonymously'}
              </label>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl gold-gradient-btn font-bold text-xs uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2"
            >
              {submitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting Review...') : (isArabic ? 'إرسال التقييم للمراجعة' : 'Submit Review for Verification')}
            </button>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'SUCCESS' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {isArabic ? 'شكراً لك! تم استلام تقييمك' : 'Thank You! Review Received'}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {isArabic
                ? 'تم إرسال تقييمك إلى فريق الإدارة للمراجعة الموثقة. سيظهر تقييمك على الصفحة بمجرد الاعتماد.'
                : 'Your review has been successfully submitted and verified. It will appear on the website as soon as moderation approves it.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
