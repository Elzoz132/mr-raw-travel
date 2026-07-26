'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { LayoutDashboard, Palmtree, Users, Ticket, ShoppingBag, LogOut, Crown } from 'lucide-react'

export const AdminHeader: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/admin/dashboard', label: isArabic ? '📊 الإحصائيات والإيرادات' : 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/trips', label: isArabic ? '🌴 إدارة الباقات والأسعار' : 'Manage Packages', icon: Palmtree },
    { href: '/admin/crm', label: isArabic ? '👥 قاعدة بيانات العملاء' : 'Customer Database', icon: Users },
    { href: '/admin/coupons', label: isArabic ? '🎟️ أكواد الخصم والبرومو' : 'Promo Coupons', icon: Ticket },
    { href: '/admin/bookings', label: isArabic ? '📋 إدارة الحجوزات' : 'All Bookings', icon: ShoppingBag },
  ]

  return (
    <div className="bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#D4AF37]/30 py-4 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">MR.RAW BACKOFFICE CMS</span>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Executive Operations Hub</span>
          </div>
        </div>

        {/* Dynamic Admin Navigation Links */}
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500/20 flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>{isArabic ? 'خروج الإدارة' : 'Logout'}</span>
        </button>

      </div>
    </div>
  )
}
