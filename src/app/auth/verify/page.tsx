'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Crown, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setErrorMsg('No verification token provided in URL.')
      return
    }

    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true)
          window.dispatchEvent(new Event('auth-state-change'))
        } else {
          setErrorMsg(data.error || 'Verification failed.')
        }
      })
      .catch((err) => setErrorMsg(err.message || 'Network error'))
      .finally(() => setLoading(false))
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail) return
    setResendLoading(true)
    setResendMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail })
      })
      const data = await res.json()
      if (data.success) {
        setResendMsg(data.message || 'A new verification link has been sent to your email.')
      } else {
        setErrorMsg(data.error || 'Failed to send verification link.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl text-center space-y-6 relative z-10"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
        <Crown className="w-3.5 h-3.5" /> MR.RAW EMAIL VERIFICATION
      </div>

      {loading && (
        <div className="py-12 space-y-4">
          <RefreshCw className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Verifying Your Email Address...</h2>
          <p className="text-xs text-slate-400">Communicating with security servers</p>
        </div>
      )}

      {!loading && success && (
        <div className="space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Email Verified Successfully! 🎉</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your MR.RAW Travel account is now fully activated and verified. You have instant access to VIP member prices and reservations.
            </p>
          </div>
          <div className="pt-4">
            <LuxuryButton onClick={() => router.push('/customer/dashboard')} variant="gold" size="lg" className="w-full font-bold uppercase tracking-wider">
              Go to Customer Dashboard →
            </LuxuryButton>
          </div>
        </div>
      )}

      {!loading && !success && (
        <div className="space-y-6">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Verification Link Expired or Invalid</h2>
            <p className="text-xs text-rose-300">{errorMsg}</p>
          </div>

          {resendMsg ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              {resendMsg}
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-3 text-xs text-left pt-2 border-t border-white/10">
              <label className="block text-slate-300 font-bold">Resend Verification Link</label>
              <input
                type="email"
                required
                placeholder="Enter your registered email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full py-3 rounded-xl gold-gradient-btn text-[#0B0F17] font-bold text-xs uppercase"
              >
                {resendLoading ? 'Sending Email...' : 'Send New Link →'}
              </button>
            </form>
          )}

          <div className="pt-2">
            <Link href="/auth/login" className="text-xs text-slate-400 hover:text-white underline">
              Return to Login Page
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
