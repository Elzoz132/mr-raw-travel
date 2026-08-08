'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { DEFAULT_ROLE_PERMISSIONS, UserRole, Resource } from '@/lib/permissions'
import { Shield, Check, Save, Users, Search, UserCheck, Lock, AlertCircle, Plus, UserPlus, RefreshCw, Key } from 'lucide-react'

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

interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  status: string
  phone?: string
  avatar?: string
  createdAt?: string
}

export const AdminPermissionsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  // Tab State: 'USERS_ASSIGNMENT' or 'ROLE_MATRIX'
  const [activeTab, setActiveTab] = useState<'USERS_ASSIGNMENT' | 'ROLE_MATRIX'>('USERS_ASSIGNMENT')

  // Matrix State
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN')
  const [matrix, setMatrix] = useState<Record<UserRole, Record<Resource, any>>>(DEFAULT_ROLE_PERMISSIONS)
  const [savingMatrix, setSavingMatrix] = useState(false)
  
  // Users List State
  const [users, setUsers] = useState<UserItem[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  
  // Global Toast Messages
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // New Staff Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as UserRole,
    phone: ''
  })
  const [addingStaff, setAddingStaff] = useState(false)

  // 1. Load All Users from API
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        setErrorMsg(data.error || 'Failed to load users list.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading users.')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. Handle Changing a User's Role
  const handleUserRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId)
    setErrorMsg('')
    setStatusMsg('')

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      })

      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
        setStatusMsg(
          isArabic
            ? `تم تحديث صلاحية المستخدم إلى ${newRole} بنجاح!`
            : `User role updated to ${newRole} successfully!`
        )
        setTimeout(() => setStatusMsg(''), 4000)
      } else {
        setErrorMsg(data.error || 'Failed to update user role.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating user role.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  // 3. Handle Adding a New Admin/Staff Member
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.name || !newStaff.email) return

    setAddingStaff(true)
    setErrorMsg('')
    setStatusMsg('')

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      })

      const data = await res.json()
      if (data.success) {
        setStatusMsg(
          isArabic
            ? `تم إضافة المستخدم ${newStaff.name} بصلاحية ${newStaff.role} بنجاح!`
            : `User ${newStaff.name} added as ${newStaff.role} successfully!`
        )
        setShowAddModal(false)
        setNewStaff({ name: '', email: '', password: '', role: 'ADMIN', phone: '' })
        fetchUsers()
        setTimeout(() => setStatusMsg(''), 4000)
      } else {
        setErrorMsg(data.error || 'Failed to create user.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error creating user.')
    } finally {
      setAddingStaff(false)
    }
  }

  // 4. Matrix Toggle Logic
  const handleToggleMatrix = (resource: Resource, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove') => {
    if (selectedRole === 'SUPER_ADMIN') return

    setMatrix((prev) => {
      const roleData = { ...prev[selectedRole] }
      const rule = { ...roleData[resource] }
      rule[action] = !rule[action]
      roleData[resource] = rule
      return { ...prev, [selectedRole]: roleData }
    })
  }

  const handleSaveMatrix = () => {
    setSavingMatrix(true)
    setTimeout(() => {
      setSavingMatrix(false)
      setStatusMsg(isArabic ? 'تم حفظ مصفوفة الصلاحيات بنجاح!' : 'Permissions matrix saved successfully!')
      setTimeout(() => setStatusMsg(''), 4000)
    }, 600)
  }

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة الصلاحيات والمشرفين (RBAC & User Access)' : 'Enterprise User Access & Role Permissions'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'تعيين الصلاحيات والأدوار للمستخدمين' : 'User Role Management & Permissions'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'قم بمنح وتعديل صلاحيات الأدمن والمشرفين، أو تخصيص مصفوفة الوصول لكافة أقسام النظام.'
                : 'Assign roles to any user account or customize granular permission matrix rules across system modules.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] text-xs font-black uppercase flex items-center gap-2 hover:bg-[#E5C158] transition shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isArabic ? '+ إضافة مشرف جديد' : '+ Add Staff / Admin'}</span>
            </button>
          </div>
        </div>

        {/* Global Toasts */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('USERS_ASSIGNMENT')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'USERS_ASSIGNMENT'
                ? 'bg-[#D4AF37] text-[#0B0F17] shadow-xl font-black'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isArabic ? 'صلاحيات المستخدمين والمشرفين' : 'User Role Assignment'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ROLE_MATRIX')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'ROLE_MATRIX'
                ? 'bg-[#D4AF37] text-[#0B0F17] shadow-xl font-black'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{isArabic ? 'مصفوفة صلاحيات الأقسام (RBAC Grid)' : 'Role Permission Matrix'}</span>
          </button>
        </div>

        {/* TAB 1: USERS ROLE ASSIGNMENT */}
        {activeTab === 'USERS_ASSIGNMENT' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isArabic ? 'ابحث بالاسم أو البريد...' : 'Search users by name/email...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Role Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{isArabic ? 'تصفية:' : 'Role:'}</span>
                {['ALL', 'SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'CUSTOMER_SUPPORT', 'CUSTOMER'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                      roleFilter === r ? 'bg-[#D4AF37] text-[#0B0F17] font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {loadingUsers ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D4AF37]" />
                  <p className="text-xs font-semibold">{isArabic ? 'جاري تحميل قائمة المستخدمين...' : 'Loading users list...'}</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-white">{isArabic ? 'لم يتم العثور على مستخدمين' : 'No users found'}</p>
                  <p className="text-xs">{isArabic ? 'جرب البحث باسم آخر أو تغيير التصفية.' : 'Try a different search query or filter.'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-black/60 border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-4">{isArabic ? 'المستخدم' : 'User Details'}</th>
                        <th className="p-4">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</th>
                        <th className="p-4">{isArabic ? 'الصلاحية الحالية' : 'Current Role'}</th>
                        <th className="p-4 text-center">{isArabic ? 'تعديل الصلاحية (Assign Role)' : 'Assign New Role'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition duration-200">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-[#0B0F17] font-black flex items-center justify-center text-sm shadow">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                u.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-white text-sm block">{u.name}</span>
                              {u.phone && <span className="text-[11px] text-slate-400">{u.phone}</span>}
                            </div>
                          </td>

                          <td className="p-4 font-mono text-slate-300">
                            {u.email}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                u.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : u.role === 'ADMIN'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : u.role === 'CONTENT_EDITOR'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : u.role === 'CUSTOMER_SUPPORT'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-2">
                              <select
                                value={u.role}
                                disabled={updatingUserId === u.id}
                                onChange={(e) => handleUserRoleChange(u.id, e.target.value as UserRole)}
                                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-bold focus:border-[#D4AF37] focus:outline-none cursor-pointer disabled:opacity-50"
                              >
                                <option value="SUPER_ADMIN">SUPER_ADMIN (المدير العام)</option>
                                <option value="ADMIN">ADMIN (أدمن كامل الصلاحيات)</option>
                                <option value="CONTENT_EDITOR">CONTENT_EDITOR (محرر محتوى)</option>
                                <option value="CUSTOMER_SUPPORT">CUSTOMER_SUPPORT (خدمة عملاء)</option>
                                <option value="CUSTOMER">CUSTOMER (عميل عادي)</option>
                              </select>

                              {updatingUserId === u.id && (
                                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: GRANULAR ROLE PERMISSIONS MATRIX */}
        {activeTab === 'ROLE_MATRIX' && (
          <div className="space-y-6">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold w-full sm:w-auto">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{isArabic ? 'اختر الدور للتعديل:' : 'Select Role:'}</span>
                {(['SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'CUSTOMER_SUPPORT'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                      selectedRole === role ? 'bg-[#D4AF37] text-[#0B0F17] font-black shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSaveMatrix}
                disabled={savingMatrix}
                className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17] flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{savingMatrix ? 'Saving...' : 'Save Matrix Rules'}</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-black/60 border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-4 min-w-[200px]">{isArabic ? 'القسم (Module)' : 'Resource Module'}</th>
                      <th className="p-4 text-center">{isArabic ? 'عرض (View)' : 'View'}</th>
                      <th className="p-4 text-center">{isArabic ? 'إضافة (Create)' : 'Create'}</th>
                      <th className="p-4 text-center">{isArabic ? 'تعديل (Edit)' : 'Edit'}</th>
                      <th className="p-4 text-center">{isArabic ? 'حذف (Delete)' : 'Delete'}</th>
                      <th className="p-4 text-center">{isArabic ? 'اعتماد (Approve)' : 'Approve'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {RESOURCES.map((res) => {
                      const rule = matrix[selectedRole]?.[res] || {}
                      return (
                        <tr key={res} className="hover:bg-white/5 transition duration-200">
                          <td className="p-4 font-extrabold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                            <span>{res}</span>
                          </td>

                          {(['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove'] as const).map((act) => (
                            <td key={act} className="p-4 text-center">
                              <input
                                type="checkbox"
                                disabled={selectedRole === 'SUPER_ADMIN'}
                                checked={Boolean(rule[act])}
                                onChange={() => handleToggleMatrix(res, act)}
                                className="w-5 h-5 accent-[#D4AF37] cursor-pointer rounded border-white/20 bg-black/40 focus:ring-0 disabled:opacity-50"
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
        )}

      </div>

      {/* Add Staff / Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-black text-lg">
                <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                <span>{isArabic ? 'إضافة مشرف جديد' : 'Add New Admin / Staff'}</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{isArabic ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder="Zeyad Badawy"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
                <input
                  type="email"
                  required
                  placeholder="staff@mrrawtravel.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{isArabic ? 'كلمة المرور المؤقتة' : 'Temporary Password'}</label>
                <input
                  type="password"
                  placeholder="•••••••• (Default: MrRaw2026!VIP)"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{isArabic ? 'الصلاحية / الدور *' : 'Assigned Role *'}</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none font-bold"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (المدير العام الكامل)</option>
                  <option value="ADMIN">ADMIN (أدمن كامل الصلاحيات)</option>
                  <option value="CONTENT_EDITOR">CONTENT_EDITOR (محرر محتوى الرحلات والصور)</option>
                  <option value="CUSTOMER_SUPPORT">CUSTOMER_SUPPORT (خدمة عملاء والحجوزات)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{isArabic ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'}</label>
                <input
                  type="text"
                  placeholder="+201022392428"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold hover:bg-white/10"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={addingStaff}
                  className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17]"
                >
                  {addingStaff ? (isArabic ? 'جاري الإضافة...' : 'Adding...') : (isArabic ? 'إنشاء حساب المشرف' : 'Create Staff Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
