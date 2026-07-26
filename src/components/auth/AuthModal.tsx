'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { X, Lock, Mail, User, Phone, KeyRound, Shield, Globe } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter()
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'CHANGE_PASS'>('LOGIN')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleAuthSubmit = async (e: React.FormEvent) => {
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
          throw new Error(data.error || 'Invalid credentials')
        }

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
            phone: formData.phone
          })
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Signup failed.')
        }

        onClose()
        if (onSuccess) onSuccess()
        router.push('/customer')
        router.refresh()
      } else if (mode === 'CHANGE_PASS') {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to change password.')
        }

        setSuccessMsg(isArabic ? 'تم تغيير كلمة السر بنجاح!' : 'Password changed successfully!')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Tabs */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            MR.RAW TRAVEL MEMBERSHIP
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'LOGIN'
              ? (isArabic ? 'تسجيل الدخول' : 'Sign In to Your Account')
              : mode === 'SIGNUP'
              ? (isArabic ? 'إنشاء حساب جديد' : 'Create VIP Traveler Account')
              : (isArabic ? 'تغيير كلمة السر' : 'Change Password')}
          </h2>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setMode('LOGIN')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'LOGIN' ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'تسجيل دخول' : 'Sign In'}
          </button>
          <button
            onClick={() => setMode('SIGNUP')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'SIGNUP' ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'حساب جديد' : 'Sign Up'}
          </button>
          <button
            onClick={() => setMode('CHANGE_PASS')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'CHANGE_PASS' ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'كلمة السر' : 'Password'}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        {mode !== 'CHANGE_PASS' && (
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span>{isArabic ? 'التسجيل الفوري بواسطة جوجل' : 'Continue with Google Account'}</span>
          </button>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          
          {mode === 'SIGNUP' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{isArabic ? 'الاسم بالكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                placeholder="e.g. Zeyad Al-Mansoor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          {mode !== 'CHANGE_PASS' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                placeholder="zeyad@example.com (or admin@mrrawtravel.com)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          {mode === 'SIGNUP' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</label>
              <input
                type="tel"
                placeholder="+201012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          {mode !== 'CHANGE_PASS' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{isArabic ? 'كلمة السر' : 'Password'}</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          {mode === 'CHANGE_PASS' && (
            <>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{isArabic ? 'كلمة السر الحالية' : 'Current Password'}</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{isArabic ? 'كلمة السر الجديدة' : 'New Password'}</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </>
          )}

          <LuxuryButton
            type="submit"
            disabled={loading}
            variant="gold"
            size="lg"
            className="w-full font-bold uppercase tracking-wider"
          >
            {loading
              ? isArabic ? 'جاري المعالجة...' : 'Processing...'
              : mode === 'LOGIN'
              ? isArabic ? 'تسجيل الدخول' : 'Sign In'
              : mode === 'SIGNUP'
              ? isArabic ? 'إنشاء حساب جديد' : 'Create Account'
              : isArabic ? 'حفظ كلمة السر الجديدة' : 'Update Password'}
          </LuxuryButton>
        </form>

      </div>
    </div>
  )
}
