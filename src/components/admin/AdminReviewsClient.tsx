'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import {
  Star,
  CheckCircle,
  XCircle,
  Pin,
  MessageSquare,
  Trash2,
  BadgeCheck,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react'

export const AdminReviewsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [reviews, setReviews] = useState<any[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING')
  const [loading, setLoading] = useState(true)
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const url = selectedStatus === 'ALL' ? '/api/admin/reviews' : `/api/admin/reviews?status=${selectedStatus}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setReviews(data.reviews || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [selectedStatus])

  const handleUpdateReview = async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })

      const data = await res.json()
      if (data.success) {
        setStatusMsg(isArabic ? 'تم تحديث حالة التقييم بنجاح!' : 'Review status updated successfully!')
        setReplyingReviewId(null)
        setReplyText('')
        fetchReviews()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) return
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchReviews()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              {isArabic ? 'مركز مراجعة تقييمات العملاء الموثقة' : 'Verified Reviews Moderation Hub'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'اعتماد ومراجعة تقييمات المسافرين' : 'Review Moderation & Customer Responses'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'وافق على تقييمات العملاء الحقيقية، ثبّت الأهم، أضف ردود الإدارة الرسمية، وارفض التقييمات الوهمية.'
                : 'Approve genuine customer reviews, pin top testimonials, add official management responses, and hide/reject invalid reviews.'}
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            {statusMsg}
          </div>
        )}

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 glass-panel rounded-2xl p-2 border border-white/10 text-xs font-bold">
          {['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedStatus === st
                  ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {st === 'PENDING' && (isArabic ? '⏳ قيد المراجعة' : 'Pending Review')}
              {st === 'APPROVED' && (isArabic ? '✓ المعتمدة' : 'Approved')}
              {st === 'REJECTED' && (isArabic ? '✕ المرفوضة' : 'Rejected')}
              {st === 'HIDDEN' && (isArabic ? '👁️ المخفية' : 'Hidden')}
              {st === 'ALL' && (isArabic ? 'الكل' : 'All Reviews')}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading reviews moderation queue...
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No reviews found under the selected status filter.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className={`glass-panel rounded-3xl p-6 border space-y-4 transition-all ${
                  rev.isPinned
                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 bg-[#D4AF37]/5'
                    : 'border-white/10'
                }`}
              >
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{rev.author}</span>
                        <span className="text-xs text-slate-400">({rev.country})</span>
                        {rev.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Verified Customer
                          </span>
                        )}
                        {rev.isPinned && (
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0B0F17] text-[10px] font-black uppercase">
                            Pinned Top Review
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Excursion: <strong className="text-[#D4AF37]">{rev.trip?.titleEn}</strong></span>
                        {rev.package && <span>• Package: <strong>{rev.package.nameEn}</strong></span>}
                        <span>• Date: {new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Status Badge */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-amber-400 font-bold text-sm bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span>{rev.rating} / 5</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase ${
                      rev.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      rev.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {rev.status}
                    </span>
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-2 text-xs">
                  {rev.title && <h4 className="text-sm font-bold text-[#D4AF37]">{rev.title}</h4>}
                  <p className="text-slate-200 leading-relaxed text-sm">"{rev.comment}"</p>
                </div>

                {/* Admin Reply Display */}
                {rev.adminReply && (
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-[#D4AF37] block">Official Operations Reply:</span>
                    <p>{rev.adminReply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {replyingReviewId === rev.id && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/30 space-y-3">
                    <label className="text-xs font-bold text-[#D4AF37] block">Write Official Reply</label>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Thank you for joining our VIP cruise..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateReview(rev.id, { adminReply: replyText })}
                        className="px-4 py-1.5 rounded-lg gold-gradient-btn text-xs font-bold text-[#0B0F17]"
                      >
                        Submit Reply
                      </button>
                      <button
                        onClick={() => setReplyingReviewId(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateReview(rev.id, { status: 'APPROVED' })}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateReview(rev.id, { status: 'REJECTED' })}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white font-bold transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateReview(rev.id, { isPinned: !rev.isPinned })}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                        rev.isPinned ? 'bg-[#D4AF37] text-[#0B0F17]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{rev.isPinned ? 'Unpin' : 'Pin Review'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setReplyingReviewId(rev.id)
                        setReplyText(rev.adminReply || '')
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Reply</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
