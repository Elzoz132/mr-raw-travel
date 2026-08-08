'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Crown, Mail, Lock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isUnverified, setIsUnverified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccessMsg, setResendSuccessMsg] = useState('')

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          router.replace('/')
        }
      })
      .catch(() => {})
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsUnverified(false)
    setResendSuccessMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        window.dispatchEvent(new Event('auth-state-change'))
        router.push(data.redirect || '/customer')
        router.refresh()
      } else {
        setErrorMsg(data.error || 'Login failed.')
        if (data.isUnverified) {
          setIsUnverified(true)
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) return
    setResendLoading(true)
    setErrorMsg('')
    setResendSuccessMsg('')

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        setResendSuccessMsg(data.message || 'A new verification link has been dispatched to your inbox.')
      } else {
        setErrorMsg(data.error || 'Failed to resend verification email.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to send request.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" /> MR.RAW VIP PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Sign In to Account</h1>
          <p className="text-xs text-slate-400">Access your VIP excursions, bookings & digital vouchers</p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/google'}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] text-xs font-bold text-white transition-all hover:bg-white/10"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            Google Login
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/apple'}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] text-xs font-bold text-white transition-all hover:bg-white/10"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.13-.98.04-2.18.66-2.88 1.48-.62.72-1.16 1.89-1.01 3.03 1.1.09 2.23-.56 2.9-1.38z"/>
            </svg>
            Apple Login
          </button>
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">OR WITH EMAIL</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
            {isUnverified && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full py-2 rounded-lg bg-[#D4AF37] text-[#0B0F17] font-extrabold flex items-center justify-center gap-2 hover:bg-[#E5C158] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendLoading ? 'Sending...' : 'Resend Verification Email Now'}
              </button>
            )}
          </div>
        )}

        {resendSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {resendSuccessMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-bold">Password *</label>
              <Link href="/auth/forgot-password" className="text-[#D4AF37] text-[11px] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <LuxuryButton
            type="submit"
            disabled={loading}
            variant="gold"
            size="lg"
            className="w-full font-bold uppercase tracking-wider mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In Now →'}
          </LuxuryButton>
        </form>

        <p className="text-center text-xs text-slate-400 pt-4 border-t border-white/10">
          Don&apos;t have a VIP account?{' '}
          <Link href="/auth/register" className="text-[#D4AF37] font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
