'use client'

import React from 'react'
import Link from 'next/link'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Sparkles, Flame, Clock } from 'lucide-react'

export const SpecialOffers: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-400" />
              SPECIAL VIP SUMMER CAMPAIGN
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Save Up to <span className="gold-gradient-text">20% Off</span> <br />
              Private Yacht Charters
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Book your private motor yacht excursion or mega desert safari this week and unlock complimentary hotel transfers in Mercedes V-Class and a gourmet 5-course seafood buffet prepared by our private chef.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <Link href="/trips/luxury-sunset-charter-private-yacht">
                <LuxuryButton variant="gold" size="lg">
                  Claim VIP Offer Now
                </LuxuryButton>
              </Link>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Limited Seats Remaining
              </div>
            </div>
          </div>

          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80"
              alt="VIP Private Yacht"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 bg-[#0B0F17]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37]">
              ★ 100% Satisfaction Guaranteed
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
