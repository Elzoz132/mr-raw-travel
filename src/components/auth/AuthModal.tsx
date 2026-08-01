'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { X, Lock, Mail, User, Phone, Globe, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const COUNTRIES = [
  { code: 'EG', nameAr: 'مصر (Egypt)', nameEn: 'Egypt' },
  { code: 'DE', nameAr: 'ألمانيا (Germany)', nameEn: 'Germany' },
  { code: 'GB', nameAr: 'المملكة المتحدة (UK)', nameEn: 'United Kingdom' },
  { code: 'US', nameAr: 'الولايات المتحدة (USA)', nameEn: 'United States' },
  { code: 'SA', nameAr: 'السعودية (KSA)', nameEn: 'Saudi Arabia' },
  { code: 'AE', nameAr: 'الإمارات (UAE)', nameEn: 'United Arab Emirates' },
  { code: 'KW', nameAr: 'الكويت (Kuwait)', nameEn: 'Kuwait' },
  { code: 'FR', nameAr: 'فرنسا (France)', nameEn: 'France' },
  { code: 'IT', nameAr: 'إيطاليا (Italy)', nameEn: 'Italy' },
  { code: 'RU', nameAr: 'روسيا (Russia)', nameEn: 'Russia' },
  { code: 'OTHER', nameAr: 'دولة أخرى (Other Country)', nameEn: 'Other Country' }
]

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter()
  const { language, setCurrentUser } = useAppStore()
  const isArabic = language === 'ar'

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'Egypt'
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      if (mode === 'LOGIN') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || (isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'))
        }

        if (data.user) {
          setCurrentUser(data.user)
        }

        window.dispatchEvent(new Event('auth-state-change'))
        onClose()
        if (onSuccess) onSuccess()
        router.push(data.redirect || '/customer')
        router.refresh()

      } else if (mode === 'SIGNUP') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
            nationality: formData.country
          })
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || (isArabic ? 'فشل إنشاء الحساب' : 'Signup failed.'))
        }

        if (data.user) {
          setCurrentUser(data.user)
        }

        setSuccessMsg(isArabic ? 'تم إنشاء حسابك بنجاح!' : 'Account created successfully!')
        window.dispatchEvent(new Event('auth-state-change'))
        onClose()
        if (onSuccess) onSuccess()
        router.push('/customer')
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg(err.message || (isArabic ? 'حدث خطأ أثناء الاتصال.' : 'An error occurred.'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            MR.RAW LUXURY CLUB
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'LOGIN'
              ? (isArabic ? 'تسجيل الدخول للحساب' : 'Sign In to Your Account')
              : (isArabic ? 'إنشاء حساب مسافر جديد' : 'Create New Traveler Account')}
          </h2>
          <p className="text-xs text-slate-400">
            {isArabic ? 'استمتع بإدارة حجوزاتك، العروض الحصرية، والتأكيد الفوري' : 'Access your bookings, VIP perks, and instant vouchers'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMsg('') }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'LOGIN' ? 'bg-[#D4AF37] text-[#0B0F17] font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('SIGNUP'); setErrorMsg('') }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'SIGNUP' ? 'bg-[#D4AF37] text-[#0B0F17] font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'إنشاء حساب جديد' : 'Create Account'}
          </button>
        </div>

        {/* Single Click Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.05.01 12c0 1.95.45 3.8 1.26 5.42l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isArabic ? 'متابعة بضغطة واحدة بحساب Google' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#0B0F17] px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">
            {isArabic ? 'أو بالبريد الإلكتروني' : 'OR WITH EMAIL'}
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'SIGNUP' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isArabic ? 'الاسم بالكامل' : 'Full Name'}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder={isArabic ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-300">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="example@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {mode === 'SIGNUP' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isArabic ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+20 100 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isArabic ? 'الدولة / الجنسية' : 'Country / Residence'}</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.nameEn}>
                        {isArabic ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-300">{isArabic ? 'كلمة السر' : 'Password'}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <LuxuryButton
            type="submit"
            disabled={loading}
            variant="gold"
            size="lg"
            className="w-full font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {loading
                ? (isArabic ? 'جاري الاتصال...' : 'Connecting...')
                : mode === 'LOGIN'
                ? (isArabic ? 'تسجيل الدخول الحساب' : 'Sign In Now')
                : (isArabic ? 'إنشاء حساب جديد فوراً' : 'Create Account Now')}
            </span>
            <ArrowLeft className={`w-4 h-4 ${isArabic ? '' : 'rotate-180'}`} />
          </LuxuryButton>
        </form>

      </div>
    </div>
  )
}
