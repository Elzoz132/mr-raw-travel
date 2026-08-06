'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Server Exception:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center py-20 px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 space-y-6 relative z-10"
      >
        <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto" />

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Application Exception (500)</h1>
          <p className="text-xs text-rose-300 font-mono">
            {error?.message || 'An unexpected server operation error occurred.'}
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <LuxuryButton onClick={() => reset()} variant="gold" size="md" className="font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </LuxuryButton>

          <Link href="/">
            <LuxuryButton variant="ghost" size="md" className="font-bold flex items-center gap-2 text-white">
              <Home className="w-4 h-4 text-[#D4AF37]" /> Go Home
            </LuxuryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
