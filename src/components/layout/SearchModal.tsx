'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { Search, X, Compass, ArrowRight, Star } from 'lucide-react'

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, language } = useAppStore()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSearchOpen])

  if (!isSearchOpen) return null

  const popularSuggestions = [
    { title: 'Giftun Island & Orange Bay VIP', slug: 'giftun-island-vip-snorkeling', cat: 'Sea Trips' },
    { title: 'Mega Desert Safari & Quad Bike', slug: 'mega-desert-safari-quad-bedouin-dinner', cat: 'Safari' },
    { title: 'Royal Private Yacht Charter', slug: 'sunset-charter-private-yacht', cat: 'VIP Yacht' },
    { title: 'Historical Luxor & Valley of Kings', slug: 'luxor-valley-of-the-kings-vip-day-tour', cat: 'Luxor' },
  ]

  const filtered = popularSuggestions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header Search Input */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#D4AF37]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search excursions, Giftun island, Luxor, quad safari..."
              className="w-full bg-transparent text-white text-base placeholder-slate-400 focus:outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {query ? 'Search Results' : 'Popular Searches'}
          </span>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/trips/${item.slug}`}
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Category: {item.cat}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                No excursions match "{query}". Try searching "Giftun", "Luxor", or "Safari".
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
