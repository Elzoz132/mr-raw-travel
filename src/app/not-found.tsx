'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, Compass, Home } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full glass-panel p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" /> 404 PAGE NOT FOUND
        </div>

        <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF099] via-[#D4AF37] to-[#AA7C11]">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Destination Uncharted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or excursion route you are looking for has moved, expired, or does not exist on our VIP servers.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <LuxuryButton variant="gold" size="md" className="font-bold flex items-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </LuxuryButton>
          </Link>
          <Link href="/trips">
            <LuxuryButton variant="ghost" size="md" className="font-bold flex items-center gap-2 text-white">
              <Compass className="w-4 h-4 text-[#D4AF37]" /> Explore Trips
            </LuxuryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
