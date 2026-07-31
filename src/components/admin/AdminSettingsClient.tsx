'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { uploadMedia } from '@/lib/cloudinary'
import { Settings, Phone, Mail, Globe, Search, ShieldAlert, Upload, Check } from 'lucide-react'

export const AdminSettingsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'Mr.Raw Travel',
    site_logo: '/logo.png',
    site_favicon: '/favicon.ico',
    seo_title: 'Mr.Raw Travel | #1 Rated Luxury Excursions in Hurghada',
    seo_desc: 'Book VIP private yachts, Giftun island sea trips, mega desert quad safaris, and ancient Luxor guided tours in Hurghada.',
    seo_keywords: 'Hurghada excursions, Giftun island, VIP yacht charter, quad safari, Luxor tour',
    google_analytics_id: 'G-XXXXXXXXXX',
    meta_pixel_id: '1234567890',
    google_maps_key: '',
    whatsapp_number: '01070657476',
    support_email: 'info@mrrawtravel.com',
    default_currency: 'USD',
    maintenance_mode: 'false'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }))
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      // Save all setting keys
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        })
      )

      await Promise.all(promises)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
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
              <Settings className="w-3.5 h-3.5" />
              {isArabic ? 'الإعدادات العامة للشركة والمنصة' : 'Enterprise Global Settings'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'إعدادات الموقع، SEO، والتتبع الإحصائي' : 'Global Platform & SEO Configuration'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'إدارة اسم المنصة، اللوجو، الفافيكون، إعدادات محركات البحث SEO، كود التحليلات Google Analytics، ورقم الواتساب.'
                : 'Configure platform branding, SEO meta tags, tracking pixels, WhatsApp API, and maintenance mode.'}
            </p>
          </div>

          <LuxuryButton onClick={handleSaveSettings} disabled={saving} variant="gold" size="md">
            {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ الإعدادات العامة' : 'Save Global Settings')}
          </LuxuryButton>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{isArabic ? 'تم حفظ كافة الإعدادات العامة وتطبيقها بنجاح!' : 'Global platform settings updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Branding & Identity */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
              Branding & Identity
            </h3>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Logo Image URL</label>
                <input
                  type="text"
                  value={settings.site_logo}
                  onChange={(e) => setSettings({ ...settings, site_logo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Favicon Icon URL</label>
                <input
                  type="text"
                  value={settings.site_favicon}
                  onChange={(e) => setSettings({ ...settings, site_favicon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Official Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Official WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold text-emerald-400"
              />
            </div>
          </div>

          {/* Section 2: SEO & Analytics */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
              SEO & Analytics Tracking
            </h3>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Default Meta Title</label>
              <input
                type="text"
                value={settings.seo_title}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Meta Description</label>
              <textarea
                rows={3}
                value={settings.seo_desc}
                onChange={(e) => setSettings({ ...settings, seo_desc: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.google_analytics_id}
                  onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Meta Pixel ID</label>
                <input
                  type="text"
                  value={settings.meta_pixel_id}
                  onChange={(e) => setSettings({ ...settings, meta_pixel_id: e.target.value })}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Maintenance Mode</span>
                <span className="text-[10px] text-slate-400">Temporarily disable public bookings during system updates</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode === 'true'}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked ? 'true' : 'false' })}
                className="accent-[#D4AF37] w-5 h-5"
              />
            </div>

          </div>

        </form>

      </div>
    </div>
  )
}
