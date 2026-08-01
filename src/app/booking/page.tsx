'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Upload, Ticket } from 'lucide-react'

export default function BookingPage() {
  const router = useRouter()
  const { bookingDraft, currency, language, currentUser } = useAppStore()
  const isArabic = language === 'ar'

  const [step, setStep] = useState(1)
  const [countryCode, setCountryCode] = useState('+20')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsApp: '',
    nationality: 'Egypt',
    hotelName: '',
    hotelAddress: '',
    roomNumber: '',
    paymentMethod: 'CASH',
    receiptUrl: '',
    specialRequests: ''
  })

  // Auto-fill logged in customer details
  React.useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || (currentUser as any).phone || '',
        whatsApp: prev.whatsApp || (currentUser as any).whatsApp || (currentUser as any).phone || '',
        nationality: prev.nationality || (currentUser as any).nationality || 'Egypt'
      }))
    } else {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || data.user.name || '',
              email: prev.email || data.user.email || '',
              phone: prev.phone || data.user.phone || '',
              whatsApp: prev.whatsApp || data.user.whatsApp || data.user.phone || '',
              nationality: prev.nationality || data.user.nationality || 'Egypt'
            }))
          }
        })
        .catch(() => {})
    }
  }, [currentUser])

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponMsg, setCouponMsg] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const draft = bookingDraft || { adults: 2, children: 0 }

  // Calculate Prices based on currency
  const adultPrice = currency === 'EUR' ? (draft.priceAdultEur || 42) : currency === 'EGP' ? (draft.priceAdultEgp || 2200) : (draft.priceAdultUsd || 45)
  const childPrice = currency === 'EUR' ? (draft.priceChildEur || 23) : currency === 'EGP' ? (draft.priceChildEgp || 1200) : (draft.priceChildUsd || 25)
  
  const rawTotalPrice = (draft.adults || 2) * adultPrice + (draft.children || 0) * childPrice
  const totalPrice = Math.max(0, rawTotalPrice - discountAmount)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Step Navigation Validations
  const goToStep2 = () => {
    setErrorMsg('')
    setStep(2)
  }

  const goToStep3 = () => {
    if (!formData.hotelName.trim() || !formData.hotelAddress.trim()) {
      setErrorMsg(isArabic ? 'يرجى إدخال اسم الفندق وعنوانه بالكامل للمتابعة.' : 'Please enter hotel name and address to proceed.')
      return
    }
    setErrorMsg('')
    setStep(3)
  }

  const goToStep4 = () => {
    if (!formData.fullName.trim()) {
      setErrorMsg(isArabic ? 'يرجى إدخال الاسم بالكامل.' : 'Please enter full passenger name.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.')
      return
    }
    if (!formData.phone.trim()) {
      setErrorMsg(isArabic ? 'يرجى إدخال رقم الهاتف للتواصل.' : 'Please enter phone number.')
      return
    }
    setErrorMsg('')
    setStep(4)
  }

  // Handle coupon validation
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponMsg('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid promo code')
      }

      const c = data.coupon
      let discount = 0
      if (c.type === 'PERCENTAGE') {
        discount = Math.round((rawTotalPrice * c.value) / 100)
      } else {
        discount = c.value
      }

      setDiscountAmount(discount)
      setAppliedCoupon(c.code)
      setCouponMsg(isArabic ? `تم تطبيق خصم بقيمة ${discount} ${currency}!` : `Applied discount of ${discount} ${currency}!`)
    } catch (err: any) {
      setCouponMsg(err.message || 'Invalid coupon.')
    }
  }

  // Handle mock receipt upload
  const handleReceiptSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fakeUrl = URL.createObjectURL(file)
      handleInputChange('receiptUrl', fakeUrl)
    }
  }

  const handleSubmitBooking = async () => {
    setLoading(true)
    setErrorMsg('')

    const fullPhone = `${countryCode} ${formData.phone}`.trim()
    const fullWhatsapp = formData.whatsApp ? `${countryCode} ${formData.whatsApp}`.trim() : fullPhone

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: bookingDraft.tripId || '1',
          packageId: bookingDraft.packageId || undefined,
          selectedAddons: bookingDraft.selectedAddons || undefined,
          isCustomPackage: bookingDraft.isCustomPackage || false,
          tripDate: bookingDraft.tripDate || new Date().toISOString(),
          adults: bookingDraft.adults || 2,
          children: bookingDraft.children || 0,
          currency,
          totalPrice,
          leadPassengerName: formData.fullName,
          leadEmail: formData.email,
          leadPhone: fullPhone,
          whatsappPhone: fullWhatsapp,
          nationality: formData.nationality,
          hotelName: formData.hotelName,
          hotelAddress: formData.hotelAddress,
          roomNumber: formData.roomNumber,
          paymentMethod: formData.paymentMethod,
          receiptUrl: formData.receiptUrl,
          specialRequests: formData.specialRequests,
          discountCode: appliedCoupon || undefined
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking.')
      }

      router.push(`/booking/confirmation?id=${data.bookingId}`)
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          {isArabic ? 'محرك الحجز الملكي السريع' : '2-MINUTE HIGH-CONVERSION ENGINE'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {isArabic ? 'تأكيد وحجز الرحلة الفاخرة' : 'Complete Your VIP Excursion Booking'}
        </h1>
      </div>

      {/* Steps Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-2 border border-white/10 text-xs sm:text-sm font-bold">
        {[
          { num: 1, title: isArabic ? 'تفاصيل الرحلة' : 'Trip Details' },
          { num: 2, title: isArabic ? 'الفندق والاستقبال' : 'Hotel Pickup' },
          { num: 3, title: isArabic ? 'بيانات التواصل' : 'Lead Passenger' },
          { num: 4, title: isArabic ? 'الدفع والفوچر' : 'Payment & Confirm' }
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              step === s.num
                ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg'
                : step > s.num
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">
              {step > s.num ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Step Content (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: Trip Summary */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? '١. ملخص وتاريخ الرحلة' : '1. Selected Excursion Summary'}
              </h3>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={bookingDraft.tripCover || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'}
                  alt="Trip"
                  loading="lazy"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-base font-bold text-white">
                    {bookingDraft.tripTitle || (isArabic ? 'رحلة جزيرة جفتون الفاخرة' : 'Giftun Island Paradise Cruise')}
                  </h4>
                  {(bookingDraft.packageNameAr || bookingDraft.packageNameEn) && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold">
                      📦 {isArabic ? (bookingDraft.packageNameAr || bookingDraft.packageNameEn) : (bookingDraft.packageNameEn || bookingDraft.packageNameAr)}
                    </span>
                  )}
                  {bookingDraft.selectedAddons && bookingDraft.selectedAddons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {isArabic ? 'الإضافات المشمولة:' : 'Selected Addons:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {bookingDraft.selectedAddons.map((add, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-semibold">
                            + {isArabic ? add.nameAr : add.nameEn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="text-xs text-[#D4AF37] font-semibold block mt-1">
                    {isArabic ? 'تاريخ المغادرة:' : 'Date:'} {bookingDraft.tripDate || new Date().toISOString().split('T')[0]}
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {isArabic ? `الأفراد: ${bookingDraft.adults || 2} بالغين، ${bookingDraft.children || 0} أطفال` : `Travelers: ${bookingDraft.adults || 2} Adults, ${bookingDraft.children || 0} Children`}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <LuxuryButton onClick={goToStep2} variant="gold" size="md" className="flex items-center gap-2">
                  <span>{isArabic ? 'المتابعة لبيانات الاستقبال والفندق' : 'Continue to Pickup Details'}</span>
                  <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                </LuxuryButton>
              </div>
            </div>
          )}

          {/* STEP 2: Hotel Pickup Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? '٢. تفاصيل استقبال الفندق' : '2. Hotel Pickup Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-300">{isArabic ? 'اسم الفندق (إجباري) *' : 'Hotel Name *'}</label>
                  <input
                    type="text"
                    placeholder={isArabic ? 'مثال: فندق شتايجنبرجر ألدو بيتش الغردقة' : 'e.g. Steigenberger ALDAU Beach Hotel'}
                    value={formData.hotelName}
                    onChange={(e) => handleInputChange('hotelName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">{isArabic ? 'عنوان / منطقة الفندق (إجباري) *' : 'Hotel Address *'}</label>
                  <input
                    type="text"
                    placeholder={isArabic ? 'مثال: طريق يوسف عفيفي، الممشى السياحي' : 'e.g. Youssef Afifi Rd, Hurghada'}
                    value={formData.hotelAddress}
                    onChange={(e) => handleInputChange('hotelAddress', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">{isArabic ? 'رقم الغرفة (اختياري)' : 'Room Number (Optional)'}</label>
                  <input
                    type="text"
                    placeholder="e.g. 402"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <LuxuryButton onClick={() => setStep(1)} variant="ghost" size="md" className="flex items-center gap-2">
                  <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} /> {isArabic ? 'رجوع' : 'Back'}
                </LuxuryButton>
                <LuxuryButton onClick={goToStep3} variant="gold" size="md" className="flex items-center gap-2">
                  <span>{isArabic ? 'المتابعة لبيانات التواصل' : 'Continue to Contact Details'}</span>
                  <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                </LuxuryButton>
              </div>
            </div>
          )}

          {/* STEP 3: Lead Passenger Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? '٣. بيانات المسافر والتواصل' : '3. Lead Passenger Contact Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-300">{isArabic ? 'الاسم بالكامل (إجباري) *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    placeholder="e.g. Zeyad Al-Mansoor"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">{isArabic ? 'البريد الإلكتروني (إجباري) *' : 'Email Address *'}</label>
                    {formData.email && (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ✓ {isArabic ? 'تم التعبئة تلقائياً من حسابك' : 'Auto-filled from account'}
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="zeyad@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Country Code & Phone Number */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-300">{isArabic ? 'اختر رمز الدولة ورقم الهاتف (إجباري) *' : 'Country Code & Phone Number *'}</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 rounded-xl bg-slate-900 border border-white/15 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="+20">🇪🇬 +20 (Egypt)</option>
                      <option value="+49">🇩🇪 +49 (Germany)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+1">🇺🇸 +1 (USA)</option>
                      <option value="+966">🇸🇦 +966 (KSA)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+33">🇫🇷 +33 (France)</option>
                      <option value="+39">🇮🇹 +39 (Italy)</option>
                      <option value="+7">🇷🇺 +7 (Russia)</option>
                      <option value="+41">🇨🇭 +41 (Switzerland)</option>
                      <option value="+43">🇦🇹 +43 (Austria)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="1012345678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-300">{isArabic ? 'الجنسية' : 'Nationality'}</label>
                  <input
                    type="text"
                    placeholder="Egypt"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <LuxuryButton onClick={() => setStep(2)} variant="ghost" size="md" className="flex items-center gap-2">
                  <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} /> {isArabic ? 'رجوع' : 'Back'}
                </LuxuryButton>
                <LuxuryButton onClick={goToStep4} variant="gold" size="md" className="flex items-center gap-2">
                  <span>{isArabic ? 'المتابعة لخطوة الدفع' : 'Continue to Payment'}</span>
                  <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                </LuxuryButton>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Selection & Receipt Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? '٤. طريقة الدفع وتأكيد الحجز' : '4. Select Payment Method'}
              </h3>

              {/* Promo Coupon Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-[#D4AF37]/30 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#D4AF37]" />
                  {isArabic ? 'هل لديك كود خصم ترويجي؟' : 'Have a Promo Discount Code?'}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. VIPSUMMER"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono uppercase text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs hover:bg-[#E5C158]"
                  >
                    {isArabic ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs font-bold ${appliedCoupon ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Payment Gateways Radio */}
              <div className="space-y-3 text-xs">
                {[
                  { id: 'CASH', title: isArabic ? 'الدفع كاش عند الاستقبال' : 'Cash on Arrival', desc: isArabic ? 'الدفع مباشرة للسائق بالدولار أو اليورو أو الجنيه عند التحرك.' : 'Pay your driver directly in USD, EUR, or EGP upon hotel pickup.' },
                  { id: 'INSTAPAY', title: 'InstaPay (إنستا باي)', desc: 'Transfer to InstaPay handle: mrraw@instapay' },
                  { id: 'VODAFONE_CASH', title: isArabic ? 'فودافون كاش (Vodafone Cash)' : 'Vodafone Cash', desc: 'Transfer to wallet: 01099887766' },
                  { id: 'CARD', title: isArabic ? 'بطاقات الائتمان (Stripe / Paymob)' : 'Credit / Debit Card (Stripe / Paymob)', desc: 'Instant 256-bit SSL encrypted online payment.' }
                ].map((mode) => (
                  <label
                    key={mode.id}
                    onClick={() => handleInputChange('paymentMethod', mode.id)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === mode.id
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === mode.id}
                      onChange={() => {}}
                      className="mt-1 accent-[#D4AF37]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{mode.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{mode.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Receipt Upload */}
              {(formData.paymentMethod === 'INSTAPAY' || formData.paymentMethod === 'VODAFONE_CASH') && (
                <div className="p-6 rounded-2xl bg-white/5 border border-[#D4AF37]/30 space-y-4 text-xs">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'إرفاق صوره إيصال التحويل (اختياري)' : 'Upload Payment Screenshot (Receipt)'}
                  </span>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-[#D4AF37] transition-colors">
                    <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                    <span className="font-bold text-white">{isArabic ? 'اضغط لإرفاق سكرين شوت الإيصال' : 'Click or Drag & Drop Transfer Receipt'}</span>
                    <input type="file" accept="image/*" onChange={handleReceiptSimulate} className="hidden" />
                  </label>

                  {formData.receiptUrl && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> {isArabic ? 'تم إرفاق صورة الإيصال بنجاح!' : 'Receipt attached successfully!'}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <LuxuryButton onClick={() => setStep(3)} variant="ghost" size="md" className="flex items-center gap-2">
                  <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} /> {isArabic ? 'رجوع' : 'Back'}
                </LuxuryButton>
                <LuxuryButton
                  onClick={handleSubmitBooking}
                  disabled={loading}
                  variant="gold"
                  size="lg"
                  className="font-bold uppercase tracking-wider"
                >
                  {loading ? (isArabic ? 'جاري التأكيد...' : 'Processing Booking...') : (isArabic ? 'تأكيد واستخراج الفوچر الملكي' : 'Confirm & Issue Voucher')}
                </LuxuryButton>
              </div>
            </div>
          )}

        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-[#D4AF37]/30 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">
            {isArabic ? 'ملخص الفاتورة' : 'Summary Invoice'}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>{bookingDraft.adults || 2} Adults x {formatCurrencyPrice(adultPrice, currency, language)}</span>
              <span className="font-bold text-white">{formatCurrencyPrice((bookingDraft.adults || 2) * adultPrice, currency, language)}</span>
            </div>
            {(bookingDraft.children || 0) > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>{bookingDraft.children} Children x {formatCurrencyPrice(childPrice, currency, language)}</span>
                <span className="font-bold text-white">{formatCurrencyPrice((bookingDraft.children || 0) * childPrice, currency, language)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>{isArabic ? 'خصم البرومو كود:' : 'Promo Discount:'}</span>
                <span>-{formatCurrencyPrice(discountAmount, currency, language)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>{isArabic ? 'انتقالات الفندق:' : 'Hotel Pickup Transfer:'}</span>
              <span className="font-bold text-emerald-400">{isArabic ? 'مجاناً' : 'FREE'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm font-bold text-white">{isArabic ? 'المبلغ الإجمالي:' : 'Total Price:'}</span>
            <span className="text-2xl font-black text-[#D4AF37]">
              {formatCurrencyPrice(totalPrice, currency, language)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200 block">✓ {isArabic ? 'تأكيد فوري للفوچر' : 'Instant Confirmation'}</span>
            <span>{isArabic ? 'إلغاء مجاني حتى 24 ساعة قبل موعد الرحلة.' : 'Free cancellation up to 24 hours prior to excursion.'}</span>
          </div>
        </div>

      </div>

    </div>
  )
}
