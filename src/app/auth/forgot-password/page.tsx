'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Crown, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        setMessage(data.message)
      } else {
        setErrorMsg(data.error || 'Failed to process request.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" /> ACCOUNT RECOVERY
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Forgot Password</h1>
          <p className="text-xs text-slate-400">Enter your email to receive a secure password reset link</p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 text-xs text-emerald-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
            <p className="leading-relaxed">{message}</p>
            <div className="pt-2">
              <Link href="/auth/login" className="inline-block px-6 py-2.5 rounded-xl gold-gradient-btn font-bold text-[#0B0F17]">
                Back to Sign In →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <LuxuryButton
              type="submit"
              disabled={loading}
              variant="gold"
              size="lg"
              className="w-full font-bold uppercase tracking-wider mt-2"
            >
              {loading ? 'Processing Request...' : 'Send Reset Link →'}
            </LuxuryButton>
          </form>
        )}

        <div className="pt-4 border-t border-white/10 text-center">
          <Link href="/auth/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
