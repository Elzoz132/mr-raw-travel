'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { evaluatePasswordStrength } from '@/lib/auth-helpers'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Crown, Mail, Lock, User, Phone, Globe, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    country: 'Egypt',
    nationality: 'Egyptian',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const strength = evaluatePasswordStrength(formData.password)

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val }
      if (field === 'firstName' || field === 'lastName') {
        updated.fullName = `${updated.firstName} ${updated.lastName}`.trim()
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!formData.termsAccepted) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (strength.score < 2) {
      setErrorMsg(`Password is too weak. Please include numbers, uppercase letters, or special characters.`)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setSuccessMsg(data.message || 'Account created successfully! Please check your email inbox to activate your account.')
      } else {
        setErrorMsg(data.error || 'Registration failed.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" /> MR.RAW VIP TRAVEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Luxury Account</h1>
          <p className="text-xs text-slate-400">Join our exclusive Red Sea VIP tourism & yacht booking club</p>
        </div>

        {/* OAuth Buttons */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/google'}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] text-xs font-extrabold text-white transition-all hover:bg-white/10 shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            Continue with Google / التسجيل بجوجل
          </button>
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">OR REGISTER WITH EMAIL</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 text-xs text-emerald-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Verification Link Dispatched!</h3>
            <p>{successMsg}</p>
            <div className="pt-2">
              <Link href="/auth/login" className="inline-block px-6 py-2.5 rounded-xl gold-gradient-btn font-bold text-[#0B0F17]">
                Go to Login →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+49 170 1234567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Country & Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Country of Residence *</label>
                <input
                  type="text"
                  required
                  placeholder="Germany, Egypt, UK..."
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nationality *</label>
                <input
                  type="text"
                  required
                  placeholder="German, Egyptian, British..."
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">Password Strength:</span>
                  <span className="font-extrabold" style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color
                    }}
                  />
                </div>
                {strength.suggestions.length > 0 && (
                  <p className="text-[10px] text-slate-400">Suggestions: {strength.suggestions.join(', ')}</p>
                )}
              </div>
            )}

            {/* Terms & Privacy */}
            <label className="flex items-start gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.termsAccepted}
                onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                className="mt-1 accent-[#D4AF37]"
              />
              <span className="text-slate-400 text-[11px] leading-relaxed">
                I agree to the <Link href="/terms" className="text-[#D4AF37] underline">Terms of Service</Link> & <Link href="/privacy" className="text-[#D4AF37] underline">Privacy Policy</Link> of MR.RAW Luxury Travel.
              </span>
            </label>

            <LuxuryButton
              type="submit"
              disabled={loading}
              variant="gold"
              size="lg"
              className="w-full font-bold uppercase tracking-wider mt-4"
            >
              {loading ? 'Creating Account & Dispatching Verification...' : 'Register VIP Account →'}
            </LuxuryButton>
          </form>
        )}

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 pt-4 border-t border-white/10">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#D4AF37] font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
