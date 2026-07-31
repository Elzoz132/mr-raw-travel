'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  Edit3,
  Trash2,
  Lock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Check,
  Download,
  KeyRound,
  RefreshCw,
  Crown
} from 'lucide-react'

const ROLES = ['ALL', 'SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'CUSTOMER_SUPPORT']

export const AdminUsersClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [users, setUsers] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let url = `/api/admin/users?role=${selectedRole}&status=${selectedStatus}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedRole, selectedStatus])

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setSaving(true)
    setStatusMsg('')

    try {
      const method = editingUser.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMsg(isArabic ? 'تم حفظ بيانات المستخدم بنجاح!' : 'User updated successfully!')
        setEditingUser(null)
        fetchUsers()
      } else {
        setStatusMsg(data.error || 'Failed to save user')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error saving user')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف هذا الحساب نهائياً؟' : 'Are you sure you want to permanently delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchUsers()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleSuspend = async (user: any) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus })
      })
      const data = await res.json()
      if (data.success) fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const exportCSV = () => {
    const headers = 'ID,Name,Email,Role,Status,Phone,Created\n'
    const rows = users.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.phone || ''}","${u.createdAt}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة المستخدمين والأدوار والتعليق' : 'Users Management & RBAC Center'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'إدارة مدراء وموظفي وحسابات المنصة' : 'Platform Users & Administrative Roles'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'أنشئ حسابات إدارية جديدة، حدد الأدوار (Super Admin, Admin, Content Editor, Customer Support)، وعلّق أو أحذف أي حساب.'
                : 'Manage system accounts across 4 distinct roles with instant permission enforcement, suspension, and invitations.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() =>
                setEditingUser({
                  name: 'Samir Mansour',
                  email: 'samir@mrrawtravel.com',
                  role: 'ADMIN',
                  status: 'ACTIVE',
                  phone: '01070657476'
                })
              }
              className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? 'إضافة مستخدم جديد' : 'Add New User'}
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-slate-400 shrink-0">Role:</span>
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedRole === r ? 'bg-[#D4AF37] text-[#0B0F17] font-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

        </div>

        {/* Users Data Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 animate-pulse">
                      Loading users list...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      No system users found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold flex items-center justify-center">
                          {u.name?.charAt(0) || u.email.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-white block text-sm">{u.name || 'User'}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'SUPER_ADMIN' ? 'bg-[#D4AF37] text-[#0B0F17]' :
                          u.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          u.role === 'CONTENT_EDITOR' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="p-4 font-mono">{u.phone || 'N/A'}</td>
                      <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B0F17] transition"
                            title="Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition"
                            title="Toggle Suspend"
                          >
                            {u.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5 text-amber-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>

                          {u.role !== 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit / Add Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingUser.id ? 'Edit User Configuration' : 'Create New System Account'}
                </h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1">Role Permission</label>
                    <select
                      value={editingUser.role || 'ADMIN'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    >
                      <option value="SUPER_ADMIN" className="bg-[#0F172A]">SUPER_ADMIN (Owner)</option>
                      <option value="ADMIN" className="bg-[#0F172A]">ADMIN (Operations)</option>
                      <option value="CONTENT_EDITOR" className="bg-[#0F172A]">CONTENT_EDITOR (Media/Text)</option>
                      <option value="CUSTOMER_SUPPORT" className="bg-[#0F172A]">CUSTOMER_SUPPORT (Bookings)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Account Status</label>
                    <select
                      value={editingUser.status || 'ACTIVE'}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    >
                      <option value="ACTIVE" className="bg-[#0F172A]">ACTIVE</option>
                      <option value="SUSPENDED" className="bg-[#0F172A]">SUSPENDED</option>
                      <option value="UNVERIFIED" className="bg-[#0F172A]">UNVERIFIED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl gold-gradient-btn text-[#0B0F17] font-black">
                    {saving ? 'Saving...' : 'Save User Account'}
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
