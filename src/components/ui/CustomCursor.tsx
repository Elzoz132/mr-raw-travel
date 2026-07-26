'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Hide cursor on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = requestAnimationFrame(() => setIsVisible(true))

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      const target = e.target as HTMLElement
      if (!target) return

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .glass-card, .interactive')
      if (interactive) {
        setIsHovered(true)
        const customText = interactive.getAttribute('data-cursor-text')
        setCursorText(customText || '')
      } else {
        setIsHovered(false)
        setCursorText('')
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(timer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [mouseX, mouseY])

  if (!isVisible) return null

  return (
    <>
      {/* Outer Luxury Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: isClicking ? 0.7 : isHovered ? (cursorText ? 2.8 : 1.8) : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div
          className={`rounded-full border flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-[#0B0F17] transition-all duration-300 ${
            isHovered
              ? 'w-10 h-10 border-[#D4AF37] bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)]'
              : 'w-8 h-8 border-[#D4AF37]/50 bg-transparent'
          }`}
        >
          {cursorText && <span className="px-1 truncate">{cursorText}</span>}
        </div>
      </motion.div>

      {/* Inner Pin Point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
      </motion.div>
    </>
  )
}
