'use client'

import React, { useState, useEffect } from 'react'
import { uploadMedia } from '@/lib/cloudinary'
import { User, Phone, Globe, Lock, Camera, Check, ShieldCheck, Sparkles } from 'lucide-react'

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

export const CustomerProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<{
    name: string
    email: string
    phone: string
    country: string
    avatar: string
  }>({
    name: '',
    email: '',
    phone: '',
    country: 'Egypt',
    avatar: ''
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      const data = await res.json()
      if (data.success && data.user) {
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          country: data.user.country || 'Egypt',
          avatar: data.user.avatar || ''
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setStatusMsg({ type: '', text: '' })
    try {
      const res = await uploadMedia(file)
      if (res.url) {
        setProfile((prev) => ({ ...prev, avatar: res.url }))
        setStatusMsg({ type: 'success', text: 'تم رفع الصورة الشخصية بنجاح! لا تنسَ حفظ التعديلات.' })
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'فشل رفع الصورة الشخصية' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg({ type: '', text: '' })

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'كلمة السر الجديدة وتأكيدها غير متطابقين.' })
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          country: profile.country,
          nationality: profile.country,
          avatar: profile.avatar,
          ...(newPassword && { currentPassword, newPassword })
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: 'تم حفظ وتحديث بيانات حسابك والبروفايل بنجاح! 👑' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        window.dispatchEvent(new Event('auth-state-change'))
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'فشل حفظ التعديلات' })
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'حدث خطأ أثناء الاتصال' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-xs text-slate-400">جاري تحميل إعدادات الحساب والبروفايل...</div>
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            إعدادات الحساب والبروفايل الشخصي
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            عدّل بياناتك، رقم الهاتف، الدولة، وارفع صورتك الشخصية لحسابك الذهبي
          </p>
        </div>
      </div>

      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        
        {/* Avatar Photo Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#D4AF37] shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E5C158] to-[#D4AF37] text-[#0B0F17] font-black text-3xl flex items-center justify-center border-2 border-[#D4AF37] shadow-xl">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
              <Camera className="w-5 h-5 mb-1 text-[#D4AF37]" />
              <span>تغيير الصورة</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <span className="font-bold text-white text-sm block">صورة البروفايل الشخصية</span>
            <p className="text-[11px] text-slate-400 max-w-sm">
              اضغط على الصورة لرفع صورة جديدة خاصة بك (يدعم JPG, PNG, WEBP).
            </p>
            {uploadingAvatar && (
              <span className="text-[10px] text-[#D4AF37] font-bold block animate-pulse">
                جاري رفع الصورة بالسحابة...
              </span>
            )}
          </div>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">الاسم بالكامل</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">البريد الإلكتروني (غير قابل للتعديل)</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">رقم الهاتف / الواتساب</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="+20 100 000 0000"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">الدولة / الجنسية</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-bold focus:outline-none focus:border-[#D4AF37]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.nameEn}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
            تغيير كلمة السر (اختياري)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 block">كلمة السر الحالية</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block">كلمة السر الجديدة</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block">تأكيد كلمة السر الجديدة</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17] shadow-lg flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{saving ? 'جاري حفظ البيانات...' : 'حفظ وتحديث البروفايل'}</span>
          </button>
        </div>

      </form>
    </div>
  )
}
