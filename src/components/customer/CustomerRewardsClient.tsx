'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { Crown, Sparkles, Ticket, Gift, ArrowRight, CheckCircle2, History, Copy, Check } from 'lucide-react'

interface TransactionItem {
  id: string
  points: number
  type: string
  description: string
  createdAt: string
}

export const CustomerRewardsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [pointsBalance, setPointsBalance] = useState(0)
  const [lifetimePoints, setLifetimePoints] = useState(0)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')
  const [generatedCoupon, setGeneratedCoupon] = useState<{ code: string; discountPercent: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchLoyaltyData = async () => {
    try {
      const res = await fetch('/api/customer/loyalty')
      const data = await res.json()
      if (data.success) {
        setPointsBalance(data.pointsBalance || 0)
        setLifetimePoints(data.lifetimePoints || 0)
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoyaltyData()
  }, [])

  const handleRedeemCoupon = async (pointsToRedeem: number) => {
    if (pointsBalance < pointsToRedeem) {
      alert(isArabic ? 'عفواً، رصيد نقاطك الحالي غير كافٍ لهذا الكوبون.' : 'Insufficient points for this reward.')
      return
    }

    setGenerating(true)
    setMsg('')
    setGeneratedCoupon(null)

    try {
      const res = await fetch('/api/customer/coupons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsToRedeem })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل استبدال النقاط.')
      }

      setGeneratedCoupon({ code: data.couponCode, discountPercent: data.discountPercent })
      setMsg(data.message)
      await fetchLoyaltyData()
    } catch (err: any) {
      alert(err.message || 'حدث خطأ في إنشاء الكوبون.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0F17] via-[#1E1B10] to-[#0B0F17] border border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>{isArabic ? 'برنامج ولاء مستر رو الملكي' : 'Royal Loyalty Rewards'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {isArabic ? 'جوائزي ونقاط الولاء الملكية' : 'My Royal Loyalty Rewards'}
            </h1>
            <p className="text-sm text-slate-300">
              {isArabic
                ? 'تكسب 500 نقطة ولاء ملَكية مقابل كل 1000 جنيه مصري تدفعها في حجز رحلاتك! استبدل نقاطك بكوبونات خصم حقيقية تصل إلى 20% عند الدفع.'
                : 'Earn 500 Royal Loyalty points for every 1,000 EGP spent on confirmed trips. Redeem points for instant discount coupons!'}
            </p>
          </div>

          {/* Current Points Card */}
          <div className="w-full md:w-auto glass-panel p-6 rounded-2xl border border-[#D4AF37]/50 text-center space-y-2 bg-[#0B0F17]/80 min-w-[240px]">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              {isArabic ? 'رصيد نقاطك الحالي' : 'Current Loyalty Points'}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              <span>{pointsBalance.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-400 block pt-1 border-t border-white/10">
              {isArabic ? `إجمالي النقاط المكتسبة: ${lifetimePoints.toLocaleString()}` : `Total Earned: ${lifetimePoints.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Generated Coupon Modal / Alert */}
      {generatedCoupon && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-black border-2 border-emerald-500/60 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isArabic ? `تم إنشاء كوبون خصم ${generatedCoupon.discountPercent}% بنجاح!` : `Discount Coupon Generated!`}
                </h3>
                <p className="text-xs text-slate-300">
                  {isArabic ? 'استخدم كود الكوبون الموضح أدناه في خزانة الدفع للحصول على خصمك التلقائي.' : 'Use this coupon code on checkout for instant discount.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-emerald-500/40">
            <span className="text-2xl font-black text-emerald-300 font-mono tracking-wider flex-1">
              {generatedCoupon.code}
            </span>
            <button
              onClick={() => handleCopyCode(generatedCoupon.code)}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الكود' : 'Copy Code')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Rewards Redemption Tier Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#D4AF37]" />
          <span>{isArabic ? 'استبدال النقاط بكوبونات خصم' : 'Redeem Points for Discount Coupons'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tier 1: 1000 Points */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black">
                  1,000 {isArabic ? 'نقطة' : 'Pts'}
                </span>
                <Ticket className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-black text-white">
                {isArabic ? 'كوبون خصم 10% على أي رحلة' : '10% OFF Any Excursion Coupon'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'يمكنك استبدال 1000 نقطة ولاء للحصول فوراً على كوبون خصم بنسبة 10% يعمل على كافة الرحلات والباقات.'
                  : 'Redeem 1,000 points for an instant 10% discount promo code.'}
              </p>
            </div>

            <button
              onClick={() => handleRedeemCoupon(1000)}
              disabled={generating || pointsBalance < 1000}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                pointsBalance >= 1000
                  ? 'gold-gradient-btn text-[#0B0F17] hover:scale-[1.02]'
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {pointsBalance >= 1000
                  ? (isArabic ? 'استبدال 1,000 نقطة (خصم 10%)' : 'Redeem 1,000 Points (10% OFF)')
                  : (isArabic ? 'نقاطك غير كافية (مطلوب 1000)' : 'Insufficient Points (1000 Needed)')}
              </span>
            </button>
          </div>

          {/* Tier 2: 2000 Points */}
          <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/30 space-y-5 flex flex-col justify-between hover:border-[#D4AF37] transition-all bg-gradient-to-b from-[#0B0F17] to-[#1E1B10]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
                  2,000 {isArabic ? 'نقطة' : 'Pts'} VIP
                </span>
                <Crown className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-black text-white">
                {isArabic ? 'كوبون خصم 20% الملكي VIP' : '20% OFF Royal VIP Coupon'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'احصل على أعلى نسبة خصم ملكية 20% باستبدال 2000 نقطة ولاء لاستخدامها في حجزك القادم.'
                  : 'Get the highest 20% discount coupon by redeeming 2,000 Royal Loyalty points.'}
              </p>
            </div>

            <button
              onClick={() => handleRedeemCoupon(2000)}
              disabled={generating || pointsBalance < 2000}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                pointsBalance >= 2000
                  ? 'gold-gradient-btn text-[#0B0F17] hover:scale-[1.02]'
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>
                {pointsBalance >= 2000
                  ? (isArabic ? 'استبدال 2,000 نقطة (خصم 20%)' : 'Redeem 2,000 Points (20% OFF)')
                  : (isArabic ? 'نقاطك غير كافية (مطلوب 2000)' : 'Insufficient Points (2000 Needed)')}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Transaction History Log */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#D4AF37]" />
          <span>{isArabic ? 'سِجل حركة ونقاط الولاء' : 'Points Transaction History'}</span>
        </h2>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 divide-y divide-white/5">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">جاري تحميل سجل النقاط...</div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <span className="text-4xl block">✨</span>
              <p className="text-sm font-bold text-white">لا يوجد عمليات نقاط سابقة حتى الآن</p>
              <p className="text-xs text-slate-400">ستظهر جميع النقاط التي تكسبها أو تستبدلها هنا فور تأكيد حجوزاتك.</p>
              <Link href="/trips" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient-btn text-xs font-bold text-[#0B0F17]">
                <span>تصفح الرحلات والاحجز الآن</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            transactions.map((tx) => {
              const isPositive = tx.points > 0
              return (
                <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{tx.description}</p>
                    <span className="text-[11px] text-slate-400 block">
                      {new Date(tx.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`text-base font-black font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? `+${tx.points}` : tx.points} {isArabic ? 'نقطة' : 'pts'}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}
