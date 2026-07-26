'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  onClick,
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || disabled) return
    const { left, top, width, height } = btnRef.current.getBoundingClientRect()
    const x = (e.clientX - (left + width / 2)) * 0.25
    const y = (e.clientY - (top + height / 2)) * 0.25
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center font-bold rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 select-none'
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-3 text-sm tracking-wide',
    lg: 'px-8 py-4 text-base tracking-wide',
  }

  const variantStyles = {
    gold: 'gold-gradient-btn text-[#0B0F17] shadow-lg hover:shadow-[0_0_35px_rgba(212,175,55,0.5)]',
    outline: 'border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/40',
    ghost: 'text-slate-300 hover:text-[#D4AF37] hover:bg-white/5',
  }

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.96 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...(props as any)}
    >
      {/* Light Shimmer Sweep Overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
