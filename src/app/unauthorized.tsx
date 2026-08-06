'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, Lock, LogIn } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" /> 401 UNAUTHORIZED
        </div>

        <h1 className="text-5xl font-black text-white">Access Restricted</h1>

        <p className="text-xs text-slate-300 leading-relaxed">
          You must be logged in to view this page or perform this VIP reservation action. Please sign in to your MR.RAW Travel account to continue.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link href="/auth/login">
            <LuxuryButton variant="gold" size="md" className="font-bold flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Sign In Now →
            </LuxuryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
