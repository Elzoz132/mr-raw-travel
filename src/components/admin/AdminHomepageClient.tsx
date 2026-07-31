'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { defaultHomepageConfig, HomepageConfig } from '@/lib/cms'
import { uploadMedia } from '@/lib/cloudinary'
import { Save, Upload, Video, Image as ImageIcon, Sparkles, Play, Check, AlertCircle } from 'lucide-react'

export const AdminHomepageClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/cms/homepage')
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
      const res = await fetch('/api/admin/cms/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConfig(data.config)
        setStatusMsg(isArabic ? 'تم حفظ التعديلات بنجاح! تظهر الآن فورياً على الصفحة الرئيسية.' : 'Homepage CMS updated successfully!')
      } else {
        setStatusMsg(data.error || 'Failed to save')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Saving error')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (
    file: File,
    type: 'IMAGE' | 'VIDEO' | 'POSTER'
  ) => {
    if (type === 'IMAGE') setUploadingImage(true)
    if (type === 'VIDEO') setUploadingVideo(true)
    if (type === 'POSTER') setUploadingPoster(true)

    try {
      const result = await uploadMedia(file)
      if (type === 'IMAGE') setConfig({ ...config, imageUrl: result.url })
      if (type === 'VIDEO') setConfig({ ...config, videoUrl: result.url })
      if (type === 'POSTER') setConfig({ ...config, videoPoster: result.url })
    } catch (err) {
      console.error('File upload failed', err)
    } finally {
      setUploadingImage(false)
      setUploadingVideo(false)
      setUploadingPoster(false)
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
              <Sparkles className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة الهيرو والصفحة الرئيسية CMS' : 'Homepage Hero Manager CMS'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'التحكم الكامل في واجهة الموقع' : 'Homepage Content & Media Control'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic ? 'عدّل كافة النصوص والوسائط بدون تعديل كود. التحديثات تظهر فوراً.' : 'Edit titles, subtitles, badges, and choose between video/image hero media with live previews.'}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving Changes...') : (isArabic ? 'حفظ ونشر التعديلات' : 'Publish Live Updates')}
          </button>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            statusMsg.includes('نجاح') || statusMsg.includes('success')
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
            Loading Homepage CMS Configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Text Config */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Main Titles */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                  {isArabic ? 'العناوين والنصوص الرئيسية (Multilingual Hero Text)' : 'Hero Headlines & Subtitles'}
                </h3>

                {/* Hero Badge */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'بادج الهيرو (Hero Badge)' : 'Top Luxury Hero Badge'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">English</label>
                      <input
                        type="text"
                        value={config.heroBadgeEn}
                        onChange={(e) => setConfig({ ...config, heroBadgeEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">العربية</label>
                      <input
                        type="text"
                        value={config.heroBadgeAr}
                        onChange={(e) => setConfig({ ...config, heroBadgeAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deutsch</label>
                      <input
                        type="text"
                        value={config.heroBadgeDe}
                        onChange={(e) => setConfig({ ...config, heroBadgeDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Title */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'عنوان الهيرو (Hero Main Title)' : 'Hero Headline'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">English</label>
                      <input
                        type="text"
                        value={config.heroTitleEn}
                        onChange={(e) => setConfig({ ...config, heroTitleEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">العربية</label>
                      <input
                        type="text"
                        value={config.heroTitleAr}
                        onChange={(e) => setConfig({ ...config, heroTitleAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deutsch</label>
                      <input
                        type="text"
                        value={config.heroTitleDe}
                        onChange={(e) => setConfig({ ...config, heroTitleDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Subtitle */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'الوصف الفرعي (Hero Subtitle)' : 'Hero Subtitle Paragraph'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">English</label>
                      <textarea
                        rows={3}
                        value={config.heroSubtitleEn}
                        onChange={(e) => setConfig({ ...config, heroSubtitleEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">العربية</label>
                      <textarea
                        rows={3}
                        value={config.heroSubtitleAr}
                        onChange={(e) => setConfig({ ...config, heroSubtitleAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deutsch</label>
                      <textarea
                        rows={3}
                        value={config.heroSubtitleDe}
                        onChange={(e) => setConfig({ ...config, heroSubtitleDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Button Text & Link */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {isArabic ? 'زر البحث والاستكشاف (Action Button & Link)' : 'Call To Action Button & URL'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Text (EN)</label>
                      <input
                        type="text"
                        value={config.heroBtnTextEn}
                        onChange={(e) => setConfig({ ...config, heroBtnTextEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">النص (AR)</label>
                      <input
                        type="text"
                        value={config.heroBtnTextAr}
                        onChange={(e) => setConfig({ ...config, heroBtnTextAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Text (DE)</label>
                      <input
                        type="text"
                        value={config.heroBtnTextDe}
                        onChange={(e) => setConfig({ ...config, heroBtnTextDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Link URL</label>
                      <input
                        type="text"
                        value={config.heroBtnLink}
                        onChange={(e) => setConfig({ ...config, heroBtnLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Col: Hero Media Selector (Video vs Image) */}
            <div className="space-y-6">
              
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 space-y-6">
                <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                  {isArabic ? 'خلفية الهيرو (Hero Media Engine)' : 'Hero Background Media Settings'}
                </h3>

                {/* Media Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                    {isArabic ? 'اختر نوع الخلفية' : 'Select Media Mode'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, mediaType: 'IMAGE' })}
                      className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        config.mediaType === 'IMAGE'
                          ? 'bg-[#D4AF37] text-[#0B0F17] border-[#D4AF37] shadow-lg'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span>{isArabic ? 'صورة فائقة الجودة' : 'High-Res Image'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, mediaType: 'VIDEO' })}
                      className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        config.mediaType === 'VIDEO'
                          ? 'bg-[#D4AF37] text-[#0B0F17] border-[#D4AF37] shadow-lg'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <Video className="w-6 h-6" />
                      <span>{isArabic ? 'فيديو MP4 متفاعل' : 'Interactive MP4 Video'}</span>
                    </button>
                  </div>
                </div>

                {/* If IMAGE Selected */}
                {config.mediaType === 'IMAGE' && (
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {isArabic ? 'رابط صورة الخلفية (Image URL)' : 'Background Image URL'}
                      </label>
                      <input
                        type="text"
                        value={config.imageUrl}
                        onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isArabic ? 'أو رفع صورة من جهازك' : 'Or Upload Local Image'}
                      </label>
                      <label className="w-full py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#D4AF37] text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>{uploadingImage ? 'Uploading Image...' : 'Choose Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'IMAGE')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {config.imageUrl && (
                      <div className="relative h-40 rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                        <img src={config.imageUrl} alt="Hero background preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-[10px] text-white font-bold">Preview</span>
                      </div>
                    )}
                  </div>
                )}

                {/* If VIDEO Selected */}
                {config.mediaType === 'VIDEO' && (
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {isArabic ? 'رابط فيديو MP4' : 'Video MP4 URL'}
                      </label>
                      <input
                        type="text"
                        value={config.videoUrl}
                        onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isArabic ? 'أو رفع ملف فيديو MP4' : 'Or Upload MP4 Video'}
                      </label>
                      <label className="w-full py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#D4AF37] text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>{uploadingVideo ? 'Uploading MP4...' : 'Choose MP4 Video File'}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'VIDEO')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Video Controls Toggles */}
                    <div className="space-y-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                      <span className="font-bold text-[#D4AF37] block mb-2">Video Playback Engine Controls:</span>
                      
                      <div className="flex items-center justify-between">
                        <span>Auto Play Video</span>
                        <input
                          type="checkbox"
                          checked={config.videoAutoPlay}
                          onChange={(e) => setConfig({ ...config, videoAutoPlay: e.target.checked })}
                          className="accent-[#D4AF37]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Loop Video (Repeat)</span>
                        <input
                          type="checkbox"
                          checked={config.videoLoop}
                          onChange={(e) => setConfig({ ...config, videoLoop: e.target.checked })}
                          className="accent-[#D4AF37]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Mute Audio (Muted)</span>
                        <input
                          type="checkbox"
                          checked={config.videoMute}
                          onChange={(e) => setConfig({ ...config, videoMute: e.target.checked })}
                          className="accent-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Poster Image */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {isArabic ? 'صورة الغلاف (Poster Image)' : 'Video Poster Image'}
                      </label>
                      <input
                        type="text"
                        value={config.videoPoster}
                        onChange={(e) => setConfig({ ...config, videoPoster: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>

                    {/* Video Live Preview */}
                    {config.videoUrl && (
                      <div className="relative h-44 rounded-2xl overflow-hidden border border-white/20 bg-black">
                        <video
                          src={config.videoUrl}
                          controls
                          poster={config.videoPoster}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  )
}
