'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { defaultFooterConfig, FooterConfig } from '@/lib/cms'
import { Crown, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react'

import { usePathname } from 'next/navigation'

export const Footer: React.FC = () => {
  const pathname = usePathname()
  const { language } = useAppStore()
  const isArabic = language === 'ar'
  const isGerman = language === 'de'
  const [footerCms, setFooterCms] = useState<FooterConfig>(defaultFooterConfig)

  if (pathname.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    fetch('/api/admin/cms/footer')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setFooterCms(data.config)
        }
      })
      .catch((err) => console.error('Failed to load footer CMS:', err))
  }, [])

  const companyDesc = isArabic
    ? footerCms.descriptionAr
    : isGerman
    ? footerCms.descriptionDe
    : footerCms.descriptionEn

  const address = isArabic
    ? footerCms.addressAr
    : isGerman
    ? footerCms.addressDe
    : footerCms.addressEn

  const newsletter = isArabic
    ? footerCms.newsletterTextAr
    : isGerman
    ? footerCms.newsletterTextDe
    : footerCms.newsletterTextEn

  return (
    <footer
      style={{ backgroundColor: footerCms.footerBackground || '#070A0F' }}
      className="border-t border-[#D4AF37]/20 pt-16 pb-12 text-slate-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-1 rounded-2xl bg-gradient-to-br from-[#E5C158]/30 via-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <img
                  src="/images/logo.png"
                  alt="Mr.Raw Travel Official Logo"
                  className="h-11 w-auto object-contain rounded-xl"
                />
              </div>
              <span className="text-xl font-black tracking-tight gold-gradient-text">
                {footerCms.companyName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {companyDesc}
            </p>
            
            {/* Social Media Links Icons */}
            <div className="flex items-center gap-3 pt-2">
              {footerCms.facebookUrl && (
                <a
                  href={footerCms.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-slate-300 flex items-center justify-center transition-all shadow-md"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {footerCms.instagramUrl && (
                <a
                  href={footerCms.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-slate-300 flex items-center justify-center transition-all shadow-md"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {footerCms.tikTokUrl && (
                <a
                  href={footerCms.tikTokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-slate-300 flex items-center justify-center transition-all shadow-md"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.47-1.41 2.47-.04.83.27 1.66.82 2.27.69.77 1.76 1.16 2.78 1.05.99-.08 1.92-.64 2.42-1.49.43-.72.6-1.57.58-2.41V.02z"/>
                  </svg>
                </a>
              )}
              {footerCms.whatsApp && (
                <a
                  href={`https://wa.me/20${footerCms.whatsApp.replace(/^0+/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-400 flex items-center justify-center transition-all shadow-md"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 text-[#D4AF37] text-xs font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{footerCms.trustBadges[0] || '100% Certified Safety'}</span>
            </div>
          </div>

          {/* Column 2: Quick Excursions */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              {isArabic ? 'أهم الرحلات الملكية' : 'Top Excursions'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/trips" className="hover:text-[#D4AF37] transition-colors">
                  Giftun Island & Orange Bay VIP
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#D4AF37] transition-colors">
                  Mega Quad Desert Safari & Bedouin Show
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#D4AF37] transition-colors">
                  Royal Private Yacht Charter
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#D4AF37] transition-colors">
                  Historical Luxor & Valley of Kings Day Trip
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              {isArabic ? 'مكتب الغردقة الرئيسي' : 'Hurghada HQ Office'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <a href={footerCms.googleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#D4AF37]">
                  {address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${footerCms.phone1}`} className="hover:text-[#D4AF37]">
                  {footerCms.phone1} (24/7 VIP)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${footerCms.email}`} className="hover:text-[#D4AF37]">
                  {footerCms.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Accepted Payment Options */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              {isArabic ? 'امتيازات كبار الزوار' : 'VIP Privileges'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {newsletter}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your Email'}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-btn text-xs font-bold text-[#0B0F17] shrink-0"
              >
                {isArabic ? 'اشترك' : 'Join'}
              </button>
            </form>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                {isArabic ? 'طرق الدفع المعتمدة:' : 'Accepted Payment Methods:'}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-300">
                {footerCms.paymentLogos.map((logo, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>{footerCms.copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link href="/trips" className="hover:text-[#D4AF37]">{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <Link href="/trips" className="hover:text-[#D4AF37]">{isArabic ? 'الشروط والأحكام' : 'Terms of Service'}</Link>
            <Link href="/admin/dashboard" className="hover:text-[#D4AF37] text-[#D4AF37]">Admin CMS Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

