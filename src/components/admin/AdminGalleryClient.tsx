'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { uploadMedia } from '@/lib/cloudinary'
import { Image as ImageIcon, Video, Plus, Upload, Trash2, Edit3, Star, Check, Sparkles, Filter } from 'lucide-react'

interface GalleryCMSItem {
  id: string
  titleEn: string
  titleAr: string
  titleDe: string
  category: string
  url: string
  location: string
  mediaType: 'IMAGE' | 'VIDEO' | 'PANORAMA_360' | 'DRONE'
  order: number
  isFeatured: boolean
  altTextEn?: string | null
  altTextAr?: string | null
  altTextDe?: string | null
}

const CATEGORIES = ['ALL', 'SEA', 'DESERT', 'YACHT', 'LUXOR', 'PYRAMIDS', 'UNDERWATER']

export const AdminGalleryClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [items, setItems] = useState<GalleryCMSItem[]>([])
  const [selectedCat, setSelectedCat] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Partial<GalleryCMSItem> | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const url = selectedCat === 'ALL' ? '/api/admin/gallery' : `/api/admin/gallery?category=${selectedCat}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setItems(data.items || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [selectedCat])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await uploadMedia(file)
      setEditingItem((prev) => ({
        ...prev,
        url: res.url,
        mediaType: res.mediaType as any
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setSaving(true)
    setStatusMsg('')

    try {
      const method = editingItem.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMsg(isArabic ? 'تم حفظ عنصر المعرض بنجاح!' : 'Gallery item saved successfully!')
        setEditingItem(null)
        fetchGallery()
      } else {
        setStatusMsg(data.error || 'Failed to save item')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error saving item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this media item?')) return
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchGallery()
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
              <ImageIcon className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة معرض الصور والفيديوهات الديناميكي' : 'Dynamic Photo & Video Gallery CMS'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'التحكم الكامل بمعرض صور الموقع' : 'Gallery Media & SEO Alt Text Manager'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'ارفع صور وفيديوهات فائقة الجودة، قسمها لفئات، خصص نصوص SEO، وفعّل التحميل الذكي Lazy Loading.'
                : 'Upload, replace, reorder, categorize high-res photos & videos with SEO alt tags and featured flags.'}
            </p>
          </div>

          <button
            onClick={() =>
              setEditingItem({
                titleEn: 'Giftun Coral Paradise',
                titleAr: 'شعاب جزيرة جفتون الفاخرة',
                titleDe: 'Giftun Korallenparadies',
                category: 'SEA',
                location: 'Hurghada',
                mediaType: 'IMAGE',
                order: 0,
                isFeatured: true,
                url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
                altTextEn: 'Hurghada Red Sea VIP Yacht Coral Reef'
              })
            }
            className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'رفع وسيط جديد' : 'Upload New Media'}
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto glass-panel rounded-2xl p-2 border border-white/10 text-xs font-bold">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedCat === cat
                  ? 'bg-[#D4AF37] text-[#0B0F17]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading gallery CMS items...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400">
              No media items found for this category. Click "Upload New Media" to add your first photo/video.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/10 space-y-3 p-3 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all"
              >
                {/* Media Preview */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-black">
                  {item.mediaType === 'VIDEO' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.altTextEn || item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}

                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0B0F17] text-[10px] font-black uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs px-1">
                  <h4 className="font-bold text-white truncate">{item.titleEn}</h4>
                  <p className="text-slate-400 text-[11px] truncate font-arabic">{item.titleAr}</p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B0F17] text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal for Editing / Creating Media */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingItem.id ? 'Edit Gallery Item' : 'Upload New Gallery Media'}
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                
                {/* File Upload / URL */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-semibold block">Media File (Upload or URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingItem.url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold shrink-0 flex items-center gap-1 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.titleEn || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">الاسم (AR)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.titleAr || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Title (DE)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.titleDe || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, titleDe: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Category</label>
                    <select
                      value={editingItem.category || 'SEA'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    >
                      {CATEGORIES.filter((c) => c !== 'ALL').map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Media Type</label>
                    <select
                      value={editingItem.mediaType || 'IMAGE'}
                      onChange={(e) => setEditingItem({ ...editingItem, mediaType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    >
                      <option value="IMAGE" className="bg-[#0F172A]">IMAGE</option>
                      <option value="VIDEO" className="bg-[#0F172A]">VIDEO</option>
                      <option value="PANORAMA_360" className="bg-[#0F172A]">360 PANORAMA</option>
                      <option value="DRONE" className="bg-[#0F172A]">DRONE FOOTAGE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">SEO Alt Text (EN)</label>
                    <input
                      type="text"
                      value={editingItem.altTextEn || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, altTextEn: e.target.value })}
                      placeholder="Red Sea luxury boat trip"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={editingItem.isFeatured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="accent-[#D4AF37]"
                  />
                  <label htmlFor="feat" className="text-xs text-slate-300 cursor-pointer font-bold">
                    Mark as Featured Media (Displayed prominently on Homepage Gallery)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17]"
                  >
                    {saving ? 'Saving...' : 'Save Media Item'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
