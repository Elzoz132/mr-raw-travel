'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { History, Search, Filter, ShieldCheck, Download, Laptop, Globe, Clock, User } from 'lucide-react'

export const AdminActivityLogClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      let url = '/api/admin/activity'
      if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setLogs(data.logs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            {isArabic ? 'سجل التدقيق والأنشطة الدائم Permanent Audit System' : 'Permanent Immutable Audit & Activity Log'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isArabic ? 'سجل الأنشطة وتتبع العمليات بالإدارة' : 'System Audit Trail & Operations Log'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'سجل دائم ومحفوظ لا يُحذف لأي عملية تم إجراؤها (اسم المستخدم، الدور، العملية، عنوان IP، المتصفح، والنظام).'
              : 'Immutable record logging all administrative actions, target resources, IP addresses, browsers, and timestamps.'}
          </p>
        </div>

        {/* Search */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center justify-between text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by User, Action, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
            />
          </div>
          <span className="text-slate-400">Total Immutable Records: <strong className="text-[#D4AF37]">{logs.length}</strong></span>
        </div>

        {/* Log Data Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">User & Role</th>
                  <th className="p-4">Action Performed</th>
                  <th className="p-4">Resource & Details</th>
                  <th className="p-4">IP Address & Device</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse font-sans">
                      Loading immutable audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-sans">
                      No audit records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-sans">
                        <strong className="text-white block">{log.userName || 'Admin'}</strong>
                        <span className="text-[10px] text-[#D4AF37] font-bold">{log.userRole || 'SUPER_ADMIN'}</span>
                      </td>

                      <td className="p-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
                          {log.action}
                        </span>
                      </td>

                      <td className="p-4 font-sans text-slate-200">
                        {log.details || log.resource || 'Operations Event'}
                      </td>

                      <td className="p-4 text-slate-400">
                        <span className="block text-emerald-400 font-bold">{log.ipAddress || '127.0.0.1'}</span>
                        <span className="text-[10px] text-slate-400">{log.browser || 'Chrome'} on {log.os || 'Windows'}</span>
                      </td>

                      <td className="p-4 text-slate-400 font-sans">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
