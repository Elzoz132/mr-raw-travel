'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { LayoutDashboard, Palmtree, Users, Ticket, ShoppingBag, LogOut, Crown, Settings } from 'lucide-react'

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
    { href: '/admin/dashboard', label: isArabic ? '📊 الإحصائيات' : 'Dashboard' },
    { href: '/admin/homepage', label: isArabic ? '🏠 الرئيسية' : 'Homepage CMS' },
    { href: '/admin/content', label: isArabic ? '📝 النصوص واللغات' : 'Site Text CMS' },
    { href: '/admin/footer', label: isArabic ? '🦶 الفوتر' : 'Footer CMS' },
    { href: '/admin/packages', label: isArabic ? '🌴 الباقات والأسعار' : 'Packages & Pricing' },
    { href: '/admin/reviews', label: isArabic ? '⭐ مراجعة التقييمات' : 'Review Moderation' },
    { href: '/admin/gallery', label: isArabic ? '🖼️ معرض الصور' : 'Gallery CMS' },
    { href: '/admin/bookings', label: isArabic ? '📋 الحجوزات' : 'Bookings' },
    { href: '/admin/crm', label: isArabic ? '👥 العملاء' : 'Customers' },
    { href: '/admin/coupons', label: isArabic ? '🎟️ الخصومات' : 'Coupons' },
    { href: '/admin/gateways', label: isArabic ? '💳 بوابات الدفع' : 'Payment Gateways' },
    { href: '/admin/users', label: isArabic ? '👤 المستخدمين' : 'Users' },
    { href: '/admin/permissions', label: isArabic ? '🛡️ الصلاحيات' : 'Permissions' },
    { href: '/admin/activity', label: isArabic ? '📜 سجل الأنشطة' : 'Activity Log' },
    { href: '/admin/settings', label: isArabic ? '⚙️ الإعدادات العامة' : 'Global Settings' },
  ]

  return (
    <div className="bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#D4AF37]/30 py-4 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-gradient-to-br from-[#E5C158]/30 via-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <img
              src="/images/logo.png"
              alt="Mr.Raw Logo"
              className="h-9 w-auto object-contain rounded-lg"
            />
          </div>
          <div>
            <span className="text-sm font-black text-white block leading-none">MR.RAW BACKOFFICE CMS</span>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mt-1">Executive Operations Hub</span>
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
