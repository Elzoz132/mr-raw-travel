'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'glass' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  variant = 'gold',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50'
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-3 text-sm tracking-wide',
    lg: 'px-8 py-4 text-base tracking-wide',
  }

  const variantStyles = {
    gold: 'gold-gradient-btn text-[#0B0F17] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]',
    outline: 'border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/30',
    ghost: 'text-slate-300 hover:text-[#D4AF37] hover:bg-white/5',
  }

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
