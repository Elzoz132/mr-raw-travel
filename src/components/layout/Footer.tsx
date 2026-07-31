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
              <img
                src="/images/logo.png"
                alt="Mr.Raw Travel Official Logo"
                className="h-12 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              />
              <span className="text-xl font-black tracking-tight gold-gradient-text">
                {footerCms.companyName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {companyDesc}
            </p>
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

