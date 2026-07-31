'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldAlert, Lock, ArrowLeft, Home } from 'lucide-react'

export const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full glass-panel rounded-3xl p-8 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-center space-y-6 relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest">
            ERROR 403 • ACCESS RESTRICTED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Permission Denied
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your assigned role does not have administrative clearance to view or edit this module. Contact your Super Admin to request elevated access.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>

      </motion.div>
    </div>
  )
}
