'use client'

import React, { useEffect, useRef } from 'react'

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Particle definition
    const particleCount = Math.min(35, Math.floor(width / 35))
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.3 - 0.1,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.y < 0) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = '#D4AF37'
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Slow Moving Golden Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4AF37]/10 via-[#E5C158]/5 to-transparent blur-[120px] animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#D4AF37]/8 via-amber-500/5 to-transparent blur-[150px] animate-pulse duration-[12000ms]" />
      
      {/* Light Dust Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      {/* Luxury Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,15,23,0.5)_100%)] pointer-events-none" />
    </div>
  )
}
