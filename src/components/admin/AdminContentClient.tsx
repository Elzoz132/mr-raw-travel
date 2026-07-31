'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { Search, Plus, Save, Globe, Check, Edit3, Filter } from 'lucide-react'

interface SiteContentItem {
  id?: string
  key: string
  section: string
  textEn: string
  textAr: string
  textDe: string
}

const SECTIONS = [
  'ALL',
  'HOME',
  'FOOTER',
  'FAQ',
  'TESTIMONIALS',
  'CONTACT',
  'ABOUT',
  'TRIPS',
  'CATEGORIES',
  'SPECIAL_OFFERS',
  'BLOG',
  '404_PAGE',
  'BOOKING',
  'CONFIRMATION'
]

export const AdminContentClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [items, setItems] = useState<SiteContentItem[]>([])
  const [selectedSection, setSelectedSection] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<SiteContentItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const url = selectedSection === 'ALL' ? '/api/admin/cms/content' : `/api/admin/cms/content?section=${selectedSection}`
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
    fetchItems()
  }, [selectedSection])

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setSaving(true)
    setStatusMsg('')

    try {
      const res = await fetch('/api/admin/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMsg(isArabic ? 'تم حفظ النص بنجاح!' : 'Text content saved successfully!')
        setEditingItem(null)
        fetchItems()
      } else {
        setStatusMsg(data.error || 'Failed to save content')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.textEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.textAr.includes(searchQuery) ||
      item.textDe.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              {isArabic ? 'نظام إدارة كافة نصوص الموقع CMS' : 'All Website Text CMS'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'القاموس والنصوص التفاعلية' : 'Site Translation & Text Editor'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'تحكم كامل بكل جملة ونسبة في جميع صفحات الموقع (العربية والإنجليزية والألمانية) بدون تعديل السورس كود.'
                : 'Edit any text snippet on Home, Footer, FAQ, Blog, 404, Booking, and Confirmation pages across EN, AR, and DE.'}
            </p>
          </div>

          <button
            onClick={() =>
              setEditingItem({
                key: '',
                section: selectedSection === 'ALL' ? 'HOME' : selectedSection,
                textEn: '',
                textAr: '',
                textDe: ''
              })
            }
            className="px-5 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة مفتاح نص جديد' : 'Create New Text Key'}
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Section Filters & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-white/10">
          
          {/* Section Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSection === sec
                    ? 'bg-[#D4AF37] text-[#0B0F17]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث في النصوص...' : 'Search keys or text...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

        </div>

        {/* Content Table */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Fetching dynamic text dictionary items...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <p>{isArabic ? 'لا توجد نصوص مضافة لهذا القسم حالياً.' : 'No custom text items found for this filter.'}</p>
              <button
                onClick={() =>
                  setEditingItem({
                    key: 'home.sample.key',
                    section: selectedSection === 'ALL' ? 'HOME' : selectedSection,
                    textEn: 'Sample English Text',
                    textAr: 'نص عربي تجريبي',
                    textDe: 'Beispiel Deutscher Text'
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold"
              >
                {isArabic ? 'إضافة أو نص جديد' : 'Add First Text Snippet'}
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-white font-bold">
                  <th className="p-3">Section</th>
                  <th className="p-3">Key Identifier</th>
                  <th className="p-3">English (EN)</th>
                  <th className="p-3">العربية (AR)</th>
                  <th className="p-3">Deutsch (DE)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <tr key={item.key} className="hover:bg-white/5 transition">
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/20">
                        {item.section}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#D4AF37] font-semibold">{item.key}</td>
                    <td className="p-3 max-w-xs truncate">{item.textEn}</td>
                    <td className="p-3 max-w-xs truncate font-arabic">{item.textAr}</td>
                    <td className="p-3 max-w-xs truncate">{item.textDe}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B0F17] font-bold text-xs transition flex items-center justify-center gap-1 mx-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for Editing / Creating Text Item */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingItem.id ? 'Edit Site Text Item' : 'Create New Site Text Key'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Section Page</label>
                    <select
                      value={editingItem.section}
                      onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    >
                      {SECTIONS.filter((s) => s !== 'ALL').map((sec) => (
                        <option key={sec} value={sec} className="bg-[#0F172A]">{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Key Identifier (Unique)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.key}
                      onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })}
                      placeholder="e.g. home.hero.title"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">English Text (EN)</label>
                  <textarea
                    required
                    rows={2}
                    value={editingItem.textEn}
                    onChange={(e) => setEditingItem({ ...editingItem, textEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">النص العربي (AR)</label>
                  <textarea
                    required
                    rows={2}
                    value={editingItem.textAr}
                    onChange={(e) => setEditingItem({ ...editingItem, textAr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-arabic"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Deutscher Text (DE)</label>
                  <textarea
                    required
                    rows={2}
                    value={editingItem.textDe}
                    onChange={(e) => setEditingItem({ ...editingItem, textDe: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
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
                    {saving ? 'Saving...' : 'Save Text Item'}
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
