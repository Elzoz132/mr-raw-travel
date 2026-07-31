'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { defaultFooterConfig, FooterConfig } from '@/lib/cms'
import { uploadMedia } from '@/lib/cloudinary'
import { Save, Upload, Crown, Check, Shield, MapPin, Phone, Mail, Globe } from 'lucide-react'

export const AdminFooterClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [config, setConfig] = useState<FooterConfig>(defaultFooterConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/cms/footer')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg('')

    try {
      const res = await fetch('/api/admin/cms/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConfig(data.config)
        setStatusMsg(isArabic ? 'تم حفظ إعدادات الفوتر بنجاح!' : 'Footer CMS updated successfully!')
      } else {
        setStatusMsg(data.error || 'Failed to save')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Saving error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true)
    try {
      const res = await uploadMedia(file)
      setConfig({ ...config, footerLogo: res.url })
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Crown className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة الفوتر والمعلومات القانونية CMS' : 'Footer CMS Manager'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'التحكم الشامل بفوتر الموقع' : 'Footer Content & Branding Control'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic ? 'تحديث أرقام الهاتف، الواتساب، العناوين، وسائل التواصل الاجتماعي، وأيقونات الدفع والشهادات.' : 'Update phone lines, WhatsApp, headquarters address, map links, payment badges, and social media.'}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving Changes...') : (isArabic ? 'حفظ إعدادات الفوتر' : 'Save Footer Changes')}
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
            Loading Footer CMS Configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Contact, Address, Description */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Company Info & Description */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                  {isArabic ? 'اسم الشركة والوصف' : 'Company Branding & Bio'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Company Name</label>
                    <input
                      type="text"
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Footer Background Color</label>
                    <input
                      type="text"
                      value={config.footerBackground}
                      onChange={(e) => setConfig({ ...config, footerBackground: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'وصف الشركة المكتوب بالفوتر (Multilingual Bio)' : 'Company Footer Bio'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">English</label>
                      <textarea
                        rows={3}
                        value={config.descriptionEn}
                        onChange={(e) => setConfig({ ...config, descriptionEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">العربية</label>
                      <textarea
                        rows={3}
                        value={config.descriptionAr}
                        onChange={(e) => setConfig({ ...config, descriptionAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deutsch</label>
                      <textarea
                        rows={3}
                        value={config.descriptionDe}
                        onChange={(e) => setConfig({ ...config, descriptionDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phones, Email, WhatsApp, Maps */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                  {isArabic ? 'أرقام الاتصال والمقر والخرائط' : 'HQ Address & Direct Contacts'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Phone Line 1</label>
                    <input
                      type="text"
                      value={config.phone1}
                      onChange={(e) => setConfig({ ...config, phone1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Phone Line 2 / VIP</label>
                    <input
                      type="text"
                      value={config.phone2}
                      onChange={(e) => setConfig({ ...config, phone2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">WhatsApp Number</label>
                    <input
                      type="text"
                      value={config.whatsApp}
                      onChange={(e) => setConfig({ ...config, whatsApp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Official Email Address</label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Google Maps Location Link</label>
                    <input
                      type="text"
                      value={config.googleMapsUrl}
                      onChange={(e) => setConfig({ ...config, googleMapsUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* HQ Address Input */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'عنوان المقر الرئيسي (HQ Address)' : 'HQ Physical Address'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">English</label>
                      <input
                        type="text"
                        value={config.addressEn}
                        onChange={(e) => setConfig({ ...config, addressEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">العربية</label>
                      <input
                        type="text"
                        value={config.addressAr}
                        onChange={(e) => setConfig({ ...config, addressAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deutsch</label>
                      <input
                        type="text"
                        value={config.addressDe}
                        onChange={(e) => setConfig({ ...config, addressDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 3: Social Links & Payment Options */}
            <div className="space-y-6">
              
              {/* Social Media Links */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 text-xs">
                <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                  {isArabic ? 'سوشيال ميديا (Social Media)' : 'Social Handles'}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={config.facebookUrl}
                      onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={config.instagramUrl}
                      onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">TikTok URL</label>
                    <input
                      type="text"
                      value={config.tikTokUrl}
                      onChange={(e) => setConfig({ ...config, tikTokUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">YouTube URL</label>
                    <input
                      type="text"
                      value={config.youTubeUrl}
                      onChange={(e) => setConfig({ ...config, youTubeUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 text-xs">
                <h3 className="font-bold text-white">Copyright Footer Text</h3>
                <input
                  type="text"
                  value={config.copyrightText}
                  onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  )
}
