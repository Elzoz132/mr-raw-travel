'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { Currency } from '@/lib/currency'
import { SearchModal } from './SearchModal'
import { AuthModal } from '@/components/auth/AuthModal'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { 
  Globe, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  Crown
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { currency, setCurrency, language, setLanguage, setSearchOpen } = useAppStore()

  const t = dictionaries[language].nav
  const isArabic = language === 'ar'

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Auth User State
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; role: string } | null>(null)

  const checkUserAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.authenticated && data.user) {
        setCurrentUser(data.user)
      } else {
        setCurrentUser(null)
      }
    } catch (e) {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    let isMounted = true
    const updateAuth = () => {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            if (data.authenticated && data.user) {
              setCurrentUser(data.user)
            } else {
              setCurrentUser(null)
            }
          }
        })
        .catch(() => {
          if (isMounted) setCurrentUser(null)
        })
    }

    updateAuth()
    window.addEventListener('auth-state-change', updateAuth)

    return () => {
      isMounted = false
      window.removeEventListener('auth-state-change', updateAuth)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    router.push('/')
    router.refresh()
  }

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Chic Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#E5C158]/30 via-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300">
              <img
                src="/images/logo.png"
                alt="Mr.Raw Travel Official Logo"
                className="h-11 w-auto object-contain rounded-xl"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-white tracking-wider uppercase block leading-none">
                MR.RAW
              </span>
              <span className="text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase block mt-1">
                LUXURY TRAVEL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-200">
            <Link href="/" className={`hover:text-[#D4AF37] transition-colors ${pathname === '/' ? 'text-[#D4AF37]' : ''}`}>
              {t.home}
            </Link>
            <Link href="/trips" className={`hover:text-[#D4AF37] transition-colors ${pathname.startsWith('/trips') ? 'text-[#D4AF37]' : ''}`}>
              {t.trips}
            </Link>
            <Link href="/gallery" className={`hover:text-[#D4AF37] transition-colors ${pathname === '/gallery' ? 'text-[#D4AF37]' : ''}`}>
              {t.gallery}
            </Link>
            <Link href="/blog" className={`hover:text-[#D4AF37] transition-colors ${pathname === '/blog' ? 'text-[#D4AF37]' : ''}`}>
              {t.blog}
            </Link>

            {/* ONLY SHOW ADMIN DASHBOARD LINK IF LOGGED IN USER IS ADMIN */}
            {currentUser?.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-extrabold flex items-center gap-1 hover:bg-[#D4AF37] hover:text-[#0B0F17] transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{isArabic ? 'لوحة الإدارة' : 'Admin Panel'}</span>
              </Link>
            )}

            {/* Customer Bookings link */}
            {currentUser && currentUser.role !== 'ADMIN' && (
              <Link href="/customer" className="hover:text-[#D4AF37] text-emerald-400">
                {isArabic ? 'حجوزاتي' : 'My Bookings'}
              </Link>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#D4AF37] transition-all"
              title="Search Excursions"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
              {(['en', 'ar', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-lg uppercase transition-all ${
                    language === lang ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
              {(['USD', 'EUR', 'EGP'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    currency === c ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white px-2">
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <LuxuryButton
                onClick={() => setAuthModalOpen(true)}
                variant="gold"
                size="sm"
                className="flex items-center gap-1.5 font-bold"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تسجيل دخول' : 'Sign In'}</span>
              </LuxuryButton>
            )}

          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0B0F17]/95 backdrop-blur-xl pt-24 px-6 space-y-6 lg:hidden overflow-y-auto">
          
          {/* Quick Action Tools */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
            <button
              onClick={() => { setMobileMenuOpen(false); setSearchOpen(true) }}
              className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>{isArabic ? 'البحث عن رحلة' : 'Search Excursions'}</span>
            </button>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true) }}
                className="py-2.5 px-3 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>{isArabic ? 'تسجيل دخول' : 'Sign In'}</span>
              </button>
            )}
          </div>

          {/* Language & Currency selectors in Mobile Drawer */}
          <div className="space-y-3 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">{isArabic ? 'اللغة / Language' : 'Language'}</span>
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 font-bold">
                {(['en', 'ar', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[11px] ${
                      language === lang ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">{isArabic ? 'العملة / Currency' : 'Currency'}</span>
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 font-bold">
                {(['USD', 'EUR', 'EGP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${
                      currency === c ? 'bg-[#D4AF37] text-[#0B0F17]' : 'text-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 text-base font-bold text-white">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
            <Link href="/trips" onClick={() => setMobileMenuOpen(false)}>{t.trips}</Link>
            <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>{t.gallery}</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>{t.blog}</Link>

            {currentUser?.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-between font-black"
              >
                <span>👑 {isArabic ? 'لوحة التحكم الإدارية' : 'Admin Executive Panel'}</span>
              </Link>
            )}

            {currentUser && currentUser.role !== 'ADMIN' && (
              <Link href="/customer" onClick={() => setMobileMenuOpen(false)} className="text-emerald-400">
                {isArabic ? 'حجوزاتي وحسابي' : 'My Bookings & Account'}
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={checkUserAuth}
      />
    </>
  )
}
