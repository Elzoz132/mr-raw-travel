'use client'

import React from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { Crown, Phone, Mail, MapPin, ShieldCheck, Award, Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  const { language } = useAppStore()
  const t = dictionaries[language].nav

  return (
    <footer className="bg-[#070A0F] border-t border-[#D4AF37]/20 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5C158] via-[#D4AF37] to-[#B8860B] p-[1px]">
                <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight gold-gradient-text">
                Mr.Raw Travel
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The premier luxury tourism platform in Hurghada, Egypt. Specializing in VIP private yacht charters, Giftun island sea trips, mega desert quad safaris, and ancient Luxor guided tours.
            </p>
            <div className="flex items-center gap-3 text-[#D4AF37] text-xs font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" /> 100% Certified Safety & Insurance
            </div>
          </div>

          {/* Column 2: Quick Excursions */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              Top Excursions
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
              <li>
                <Link href="/trips" className="hover:text-[#D4AF37] transition-colors">
                  Semi-Submarine & Coral Reef Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              Hurghada HQ Office
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <span>Marina Boulevard, VIP Tower 4, Hurghada, Red Sea, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:+201099887766" className="hover:text-[#D4AF37]">
                  +20 109 988 7766 (24/7 VIP Line)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:info@mrrawtravel.com" className="hover:text-[#D4AF37]">
                  vip@mrrawtravel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Accepted Payment Options */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-3">
              VIP Privileges
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to receive exclusive secret offers and discount vouchers for your Hurghada vacation.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-btn text-xs font-bold text-[#0B0F17] shrink-0"
              >
                Join
              </button>
            </form>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Accepted Payment Methods:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-300">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Cash on Pickup</span>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">InstaPay</span>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">Vodafone Cash</span>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Visa / Mastercard</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Mr.Raw Travel. All Rights Reserved. Hurghada, Egypt.</p>
          <div className="flex items-center gap-6">
            <Link href="/trips" className="hover:text-[#D4AF37]">Privacy Policy</Link>
            <Link href="/trips" className="hover:text-[#D4AF37]">Terms of Service</Link>
            <Link href="/admin/dashboard" className="hover:text-[#D4AF37] text-[#D4AF37]">Admin CMS Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
