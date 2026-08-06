'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { EmailTemplateKey } from '@/lib/email/resend'
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Settings,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Clock,
  Sparkles,
  Share2,
  Key
} from 'lucide-react'

const TEMPLATE_KEYS: { key: EmailTemplateKey; label: string; desc: string }[] = [
  { key: 'WELCOME', label: '1. Welcome Email', desc: 'Sent when a new VIP user completes registration & email verification' },
  { key: 'VERIFY_EMAIL', label: '2. Verify Email Token', desc: 'Sent after registration with verification link' },
  { key: 'RESET_PASSWORD', label: '3. Reset Password Link', desc: 'Sent when user requests password recovery' },
  { key: 'PASSWORD_CHANGED', label: '4. Password Changed Security Alert', desc: 'Sent after successful password update' },
  { key: 'BOOKING_CONFIRMED', label: '5. Booking Order Received', desc: 'Sent when customer creates a new booking order' },
  { key: 'BOOKING_APPROVED', label: '6. Royal Voucher Approved', desc: 'Sent when admin confirms booking and PDF voucher' },
  { key: 'BOOKING_CANCELLED', label: '7. Booking Cancelled Notice', desc: 'Sent when a booking is cancelled' },
  { key: 'PAYMENT_APPROVED', label: '8. Payment Receipt Verified', desc: 'Sent when admin approves payment screenshot/transfer' },
  { key: 'PAYMENT_REJECTED', label: '9. Payment Receipt Action Required', desc: 'Sent when payment receipt requires re-upload' },
  { key: 'REVIEW_APPROVED', label: '10. Review Published', desc: 'Sent when customer review is approved and live' },
]

export function AdminCommunicationClient() {
  const [activeTab, setActiveTab] = useState<'BRANDING' | 'PROVIDER' | 'TEMPLATES' | 'TEST' | 'LOGS'>('PROVIDER')
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<EmailTemplateKey>('WELCOME')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const [branding, setBranding] = useState({
    email_logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
    email_primary_color: '#D4AF37',
    email_bg_color: '#0B0F17',
    email_company_name: 'MR.RAW Travel',
    email_company_phone: '+20 102 239 2428',
    email_company_email: 'info@mrrawtravel.com',
    email_company_address: 'Hurghada Marina, Red Sea, Egypt',
    email_social_facebook: 'https://facebook.com',
    email_social_instagram: 'https://instagram.com',
    email_social_whatsapp: 'https://wa.me/201022392428',
    gmail_email: '',
    gmail_app_password: '',
    resend_api_key: ''
  })

  const [templateSettings, setTemplateSettings] = useState<Record<string, string>>({})
  const [emailLogs, setEmailLogs] = useState<any[]>([])

  // Test Email state
  const [testEmail, setTestEmail] = useState('')
  const [testTemplate, setTestTemplate] = useState<EmailTemplateKey>('WELCOME')
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/communication')
      const data = await res.json()
      if (data.success) {
        if (data.settings) {
          setTemplateSettings(data.settings)
          setBranding((prev) => ({
            ...prev,
            email_logo: data.settings.email_logo || prev.email_logo,
            email_primary_color: data.settings.email_primary_color || prev.email_primary_color,
            email_bg_color: data.settings.email_bg_color || prev.email_bg_color,
            email_company_name: data.settings.email_company_name || prev.email_company_name,
            email_company_phone: data.settings.email_company_phone || prev.email_company_phone,
            email_company_email: data.settings.email_company_email || prev.email_company_email,
            email_company_address: data.settings.email_company_address || prev.email_company_address,
            email_social_facebook: data.settings.email_social_facebook || prev.email_social_facebook,
            email_social_instagram: data.settings.email_social_instagram || prev.email_social_instagram,
            email_social_whatsapp: data.settings.email_social_whatsapp || prev.email_social_whatsapp,
            gmail_email: data.settings.gmail_email || prev.gmail_email,
            gmail_app_password: data.settings.gmail_app_password || prev.gmail_app_password,
            resend_api_key: data.settings.resend_api_key || prev.resend_api_key
          }))
        }
        if (data.logs) setEmailLogs(data.logs)
      }
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    setMsg('')
    setError('')

    try {
      const payloadSettings = { ...branding, ...templateSettings }
      const res = await fetch('/api/admin/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_SETTINGS', settings: payloadSettings })
      })

      const data = await res.json()
      if (data.success) {
        setMsg(data.message || 'Settings saved successfully!')
      } else {
        setError(data.error || 'Failed to save settings')
      }
    } catch (e: any) {
      setError(e.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testEmail) return
    setTestLoading(true)
    setTestResult(null)

    try {
      const res = await fetch('/api/admin/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SEND_TEST_EMAIL', testEmail, testTemplateKey: testTemplate })
      })

      const data = await res.json()
      setTestResult({ success: data.success, message: data.message })
      if (data.success) fetchData()
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Failed to send test email' })
    } finally {
      setTestLoading(false)
    }
  }

  const toggleTemplateEnabled = (key: EmailTemplateKey) => {
    const settingKey = `email_template_${key}_enabled`
    const current = templateSettings[settingKey] !== 'false'
    setTemplateSettings((prev) => ({
      ...prev,
      [settingKey]: current ? 'false' : 'true'
    }))
  }

  const handleSubjectChange = (key: EmailTemplateKey, val: string) => {
    setTemplateSettings((prev) => ({
      ...prev,
      [`email_template_${key}_subject`]: val
    }))
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
        <p className="text-xs">Loading Communication Center...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-xs">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-[11px] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> DUAL REAL EMAIL DISPATCH ENGINE (RESEND & GMAIL SMTP)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Communication Center</h1>
          <p className="text-slate-400 text-xs mt-1">Configure Gmail App Password or Resend API key to deliver emails directly to Inbox</p>
        </div>

        <LuxuryButton onClick={handleSaveSettings} disabled={saving} variant="gold" size="lg" className="font-bold uppercase tracking-wider shrink-0">
          {saving ? 'Saving...' : 'Save All Settings →'}
        </LuxuryButton>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {msg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
        {[
          { id: 'PROVIDER', label: '🔑 Email Credentials (Gmail / Resend)', icon: Key },
          { id: 'BRANDING', label: '👑 Global Email Branding', icon: Settings },
          { id: 'TEMPLATES', label: '✉️ 10 Email Templates & Subjects', icon: Mail },
          { id: 'TEST', label: '🚀 Send Test Email', icon: Send },
          { id: 'LOGS', label: '📊 Real Dispatched Email Logs', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg shadow-[#D4AF37]/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 0: PROVIDER CREDENTIALS */}
      {activeTab === 'PROVIDER' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gmail App Password Option */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" /> Option 1: Gmail App Password (SMTP)
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">RECOMMENDED</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              ادخل إيميل الجيميل وكلمة سر التطبيقات (Gmail App Password) لتصل الرسائل فوراً وبشكل حقيقي إلى صندوق البريد (Inbox) دون الحاجة لربط نطاق خاص!
            </p>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Gmail Address (البريد)</label>
              <input
                type="email"
                placeholder="your-email@gmail.com"
                value={branding.gmail_email}
                onChange={(e) => setBranding({ ...branding, gmail_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Gmail App Password (كلمة سر التطبيقات)</label>
              <input
                type="password"
                placeholder="xxxx xxxx xxxx xxxx"
                value={branding.gmail_app_password}
                onChange={(e) => setBranding({ ...branding, gmail_app_password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-400 space-y-1">
              <span className="text-white font-bold block">💡 كيف تحصل على Gmail App Password؟</span>
              <p>1. افتح حساب الجيميل ➔ الإعدادات ➔ الأمان (Security).</p>
              <p>2. فعل التحقق بخطوتين (2-Step Verification).</p>
              <p>3. ابحث عن "App passwords" أو كلمة سر التطبيقات وأنشئ كود جديد للموقع.</p>
            </div>
          </div>

          {/* Resend API Key Option */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4">
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" /> Option 2: Resend API Key
            </h3>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              إذا كان لديك حساب على Resend.com مفعل ومربوط بنطاقك، ادخل الـ API Key لتصل الرسائل بشكل احترافي.
            </p>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Resend API Key</label>
              <input
                type="password"
                placeholder="re_123456789..."
                value={branding.resend_api_key}
                onChange={(e) => setBranding({ ...branding, resend_api_key: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-400">
              ملاحظة: إذا تركت كلاً الخيارين فارغين، سيتم تسجيل الرسائل في قاعدة البيانات والتجربة دون إرسال إيميل حقيقي لحين إدخال البيانات.
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: BRANDING */}
      {activeTab === 'BRANDING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" /> Visual Style & Header Branding
            </h3>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Header Logo Image URL</label>
              <input
                type="text"
                value={branding.email_logo}
                onChange={(e) => setBranding({ ...branding, email_logo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.email_primary_color}
                    onChange={(e) => setBranding({ ...branding, email_primary_color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={branding.email_primary_color}
                    onChange={(e) => setBranding({ ...branding, email_primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.email_bg_color}
                    onChange={(e) => setBranding({ ...branding, email_bg_color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={branding.email_bg_color}
                    onChange={(e) => setBranding({ ...branding, email_bg_color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Company Display Name</label>
              <input
                type="text"
                value={branding.email_company_name}
                onChange={(e) => setBranding({ ...branding, email_company_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Contact & Social Links in Email Footer
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Company Phone</label>
                <input
                  type="text"
                  value={branding.email_company_phone}
                  onChange={(e) => setBranding({ ...branding, email_company_phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Support Email</label>
                <input
                  type="text"
                  value={branding.email_company_email}
                  onChange={(e) => setBranding({ ...branding, email_company_email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Physical Address</label>
              <input
                type="text"
                value={branding.email_company_address}
                onChange={(e) => setBranding({ ...branding, email_company_address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">WhatsApp Link</label>
              <input
                type="text"
                value={branding.email_social_whatsapp}
                onChange={(e) => setBranding({ ...branding, email_social_whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Template List */}
          <div className="lg:col-span-5 space-y-3">
            {TEMPLATE_KEYS.map((item) => {
              const isEnabled = templateSettings[`email_template_${item.key}_enabled`] !== 'false'
              return (
                <div
                  key={item.key}
                  onClick={() => setSelectedTemplateKey(item.key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTemplateKey === item.key
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">{item.label}</h4>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleTemplateEnabled(item.key) }}
                      className="text-lg text-[#D4AF37]"
                    >
                      {isEnabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Template Details & Subject Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" /> Editing Template: {selectedTemplateKey}
              </h3>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject Line</label>
                <input
                  type="text"
                  placeholder="Default Subject Line..."
                  value={templateSettings[`email_template_${selectedTemplateKey}_subject`] || ''}
                  onChange={(e) => handleSubjectChange(selectedTemplateKey, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                <span className="font-bold text-[#D4AF37] text-xs">Available Dynamic Variables:</span>
                <p className="text-[11px] text-slate-400 font-mono">
                  {`{name}, {verifyUrl}, {resetUrl}, {bookingNumber}, {tripTitle}, {date}, {amount}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEST EMAIL */}
      {activeTab === 'TEST' && (
        <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-[#D4AF37]/30 space-y-6">
          <div className="text-center space-y-2">
            <Send className="w-10 h-10 text-[#D4AF37] mx-auto" />
            <h2 className="text-xl font-bold text-white">Send Real Test Email</h2>
            <p className="text-xs text-slate-400">Test actual email delivery directly to your inbox</p>
          </div>

          {testResult && (
            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${testResult.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <form onSubmit={handleSendTestEmail} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Recipient Email *</label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Select Email Template to Test *</label>
              <select
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value as EmailTemplateKey)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold"
              >
                {TEMPLATE_KEYS.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>

            <LuxuryButton
              type="submit"
              disabled={testLoading}
              variant="gold"
              size="lg"
              className="w-full font-bold uppercase tracking-wider"
            >
              {testLoading ? 'Sending Test Email...' : 'Dispatch Test Email Now 🚀'}
            </LuxuryButton>
          </form>
        </div>
      )}

      {/* TAB 4: LOGS */}
      {activeTab === 'LOGS' && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between font-bold">
            <span className="text-[#D4AF37]">Recent 50 Email Dispatch Logs</span>
            <button onClick={fetchData} className="text-[#D4AF37] hover:underline flex items-center gap-1 text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-slate-400 font-bold border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Sent Date</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Template</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No email logs recorded yet.</td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(log.sentAt).toLocaleString()}</td>
                      <td className="p-3 font-bold text-white">{log.email}</td>
                      <td className="p-3 font-mono text-[#D4AF37]">{log.templateKey}</td>
                      <td className="p-3 text-slate-300">{log.subject}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          log.status === 'SIMULATED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px] truncate max-w-xs">{log.error || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
