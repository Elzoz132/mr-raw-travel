'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { evaluatePasswordStrength } from '@/lib/auth-helpers'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Crown, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const strength = evaluatePasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!token) {
      setErrorMsg('No reset token provided in URL.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (strength.score < 2) {
      setErrorMsg(`Password is too weak. ${strength.suggestions.join('. ')}`)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setErrorMsg(data.error || 'Failed to reset password.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4 text-xs">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Missing Password Reset Token</h2>
        <p className="text-slate-400">Please request a new reset link from the forgot password page.</p>
        <Link href="/auth/forgot-password" className="inline-block px-6 py-2.5 rounded-xl gold-gradient-btn font-bold text-[#0B0F17]">
          Go to Forgot Password →
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6 relative z-10"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
          <Crown className="w-3.5 h-3.5" /> SECURITY UPDATE
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Set New Password</h1>
        <p className="text-xs text-slate-400">Choose a strong, secure password for your account</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {success ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 text-xs text-emerald-300">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Password Updated! 🎉</h3>
          <p className="leading-relaxed">Your password has been changed. A security confirmation email was sent to your inbox.</p>
          <div className="pt-2">
            <LuxuryButton onClick={() => router.push('/auth/login')} variant="gold" size="lg" className="w-full font-bold uppercase tracking-wider">
              Proceed to Sign In →
            </LuxuryButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {password && (
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

          <LuxuryButton
            type="submit"
            disabled={loading}
            variant="gold"
            size="lg"
            className="w-full font-bold uppercase tracking-wider mt-2"
          >
            {loading ? 'Updating Password...' : 'Save New Password →'}
          </LuxuryButton>
        </form>
      )}
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
}
