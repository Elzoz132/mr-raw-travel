'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Lock, Shield, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'كلمة السر غير صحيحة')
      }

      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول كإدارة.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            بوابة الإدارة التنفيذية العليا
          </span>
          <h1 className="text-2xl font-black text-white">
            تسجيل دخول السوبر أدمن
          </h1>
          <p className="text-xs text-slate-400">
            أدخل كلمة السر الخاصة بالإدارة للوصول للوحة التحكم الكاملة
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">كلمة سر الإدارة (Admin Password)</label>
            <input
              type="password"
              placeholder="أدخل كلمة السر (الافتراضية: admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37] text-right"
            />
          </div>

          <LuxuryButton
            type="submit"
            disabled={loading}
            variant="gold"
            size="lg"
            className="w-full font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>{loading ? 'جاري التحقق من الصلاحيات...' : 'دخول لوحة التحكم الإدارية'}</span>
            <ArrowLeft className="w-4 h-4" />
          </LuxuryButton>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            بوابة مشفرة بأعلى معايير الأمان 256-Bit
          </span>
        </div>

      </div>
    </div>
  )
}
