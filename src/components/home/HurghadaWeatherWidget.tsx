'use client'

import React from 'react'
import { Sun, Waves, Thermometer, Wind } from 'lucide-react'

export const HurghadaWeatherWidget: React.FC = () => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-[#D4AF37] flex items-center justify-center text-[#0B0F17] shadow-xl shrink-0">
            <Sun className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">LIVE HURGHADA CONDITIONS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white">Sunny & Perfect Red Sea Water</h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-12 text-center text-xs">
          <div>
            <span className="text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-[#D4AF37]" /> Air Temp
            </span>
            <span className="text-lg font-extrabold text-white">32°C / 90°F</span>
          </div>

          <div>
            <span className="text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Waves className="w-3.5 h-3.5 text-[#0EA5E9]" /> Sea Temp
            </span>
            <span className="text-lg font-extrabold text-[#0EA5E9]">27°C / 81°F</span>
          </div>

          <div>
            <span className="text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Wind className="w-3.5 h-3.5 text-[#D4AF37]" /> Wind
            </span>
            <span className="text-lg font-extrabold text-white">12 knots (Mild)</span>
          </div>
        </div>

      </div>
    </section>
  )
}
