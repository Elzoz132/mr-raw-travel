'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sparkles } from 'lucide-react'

export const LuxurySplashLoader: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Only show once per session
    const hasLoaded = sessionStorage.getItem('mr_raw_splash_loaded')
    if (hasLoaded) {
      setLoading(false)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setLoading(false)
            sessionStorage.setItem('mr_raw_splash_loaded', 'true')
          }, 400)
          return 100
        }
        return prev + 10
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#070A0F] flex flex-col items-center justify-center p-4 selection:bg-[#D4AF37]"
        >
          {/* Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#0EA5E9]/10 blur-[140px] pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
            
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-24 h-24 rounded-3xl bg-[#0B0F17] p-2 border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.4)] flex items-center justify-center"
            >
              <img src="/images/logo.png" alt="Mr.Raw Travel Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight gold-gradient-text">
                MR.RAW TRAVEL
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                Luxury Red Sea Excursions & Charters
              </span>
            </motion.div>

            {/* Progress Bar & Counter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-64 space-y-2"
            >
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div
                  className="h-full rounded-full gold-gradient-btn"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PREPARING LUXURY ENGINE</span>
                <span className="font-bold text-[#D4AF37]">{progress}%</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
