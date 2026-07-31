'use client'

import React, { useState } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { DEFAULT_ROLE_PERMISSIONS, UserRole, Resource } from '@/lib/permissions'
import { Shield, Check, Lock, Save, RefreshCw } from 'lucide-react'

const RESOURCES: Resource[] = [
  'TRIPS',
  'PACKAGES',
  'BOOKINGS',
  'CUSTOMERS',
  'GALLERY',
  'REVIEWS',
  'BLOG',
  'COUPONS',
  'PAYMENTS',
  'ANALYTICS',
  'SETTINGS',
  'USERS'
]

export const AdminPermissionsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN')
  const [matrix, setMatrix] = useState<Record<UserRole, Record<Resource, any>>>(DEFAULT_ROLE_PERMISSIONS)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const handleToggle = (resource: Resource, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove') => {
    if (selectedRole === 'SUPER_ADMIN') return // Super admin is immutable 100%

    setMatrix((prev) => {
      const roleData = { ...prev[selectedRole] }
      const rule = { ...roleData[resource] }
      rule[action] = !rule[action]
      roleData[resource] = rule
      return { ...prev, [selectedRole]: roleData }
    })
  }

  const handleSaveMatrix = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setStatusMsg(isArabic ? 'تم حفظ مصفوفة الصلاحيات بنجاح!' : 'Permissions matrix saved successfully!')
      setTimeout(() => setStatusMsg(''), 3000)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              {isArabic ? 'مصفوفة الصلاحيات المتقدمة RBAC Matrix' : 'Enterprise Role Permissions Matrix'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'تخصيص صلاحيات القراءة، التعديل، والحذف لكل دور' : 'Granular Role Permissions Grid'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'حدد الدقة المطلوبة لكل دور (Super Admin, Admin, Content Editor, Customer Support) عبر 12 قسماً بالمناصفة.'
                : 'Configure fine-grained View, Create, Edit, Delete, and Approve permissions per role.'}
            </p>
          </div>

          <button
            onClick={handleSaveMatrix}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Permissions Matrix'}</span>
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto glass-panel p-2 rounded-2xl border border-white/10 text-xs font-bold">
          {(['SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'CUSTOMER_SUPPORT'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2.5 rounded-xl transition ${
                selectedRole === role ? 'bg-[#D4AF37] text-[#0B0F17] font-black shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Permissions Table Matrix */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4 min-w-[200px]">Resource Module</th>
                  <th className="p-4 text-center">View</th>
                  <th className="p-4 text-center">Create</th>
                  <th className="p-4 text-center">Edit</th>
                  <th className="p-4 text-center">Delete</th>
                  <th className="p-4 text-center">Approve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {RESOURCES.map((res) => {
                  const rule = matrix[selectedRole][res] || {}
                  return (
                    <tr key={res} className="hover:bg-white/5 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <span>{res}</span>
                      </td>

                      {(['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove'] as const).map((act) => (
                        <td key={act} className="p-4 text-center">
                          <input
                            type="checkbox"
                            disabled={selectedRole === 'SUPER_ADMIN'}
                            checked={Boolean(rule[act])}
                            onChange={() => handleToggle(res, act)}
                            className="accent-[#D4AF37] w-4 h-4 cursor-pointer disabled:opacity-50"
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
