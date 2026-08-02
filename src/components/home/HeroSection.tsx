'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { defaultHomepageConfig, HomepageConfig } from '@/lib/cms'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Search, Calendar, Users, Compass, ShieldCheck, Star, Award, Sparkles } from 'lucide-react'

export const HeroSection: React.FC = () => {
  const { language } = useAppStore()
  const t = dictionaries[language].hero
  const router = useRouter()

  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('2')
  const [category, setCategory] = useState('all')
  const [cmsConfig, setCmsConfig] = useState<HomepageConfig>(defaultHomepageConfig)

  useEffect(() => {
    fetch('/api/admin/cms/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setCmsConfig(data.config)
        }
      })
      .catch((err) => console.error('Failed to load live hero CMS:', err))
  }, [])

  const isArabic = language === 'ar'
  const isGerman = language === 'de'

  const heroBadge = isArabic
    ? cmsConfig.heroBadgeAr || t.badge
    : isGerman
    ? cmsConfig.heroBadgeDe || t.badge
    : cmsConfig.heroBadgeEn || t.badge

  const heroTitle = isArabic
    ? cmsConfig.heroTitleAr || `${t.titleLine1} ${t.titleLine2}`
    : isGerman
    ? cmsConfig.heroTitleDe || `${t.titleLine1} ${t.titleLine2}`
    : cmsConfig.heroTitleEn || `${t.titleLine1} ${t.titleLine2}`

  const heroSubtitle = isArabic
    ? cmsConfig.heroSubtitleAr || t.subtitle
    : isGerman
    ? cmsConfig.heroSubtitleDe || t.subtitle
    : cmsConfig.heroSubtitleEn || t.subtitle

  const heroBtnText = isArabic
    ? cmsConfig.heroBtnTextAr || t.exploreBtn
    : isGerman
    ? cmsConfig.heroBtnTextDe || t.exploreBtn
    : cmsConfig.heroBtnTextEn || t.exploreBtn

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/trips?category=${category}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Gradient & Ambient Glows */}
      <div className="absolute inset-0 bg-[#0B0F17] -z-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#D4AF37]/15 via-[#0EA5E9]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[10000ms]" />
      
      {/* Background Media: VIDEO vs IMAGE */}
      {cmsConfig.mediaType === 'VIDEO' && cmsConfig.videoUrl ? (
        <video
          autoPlay={cmsConfig.videoAutoPlay}
          loop={cmsConfig.videoLoop}
          muted={cmsConfig.videoMute}
          playsInline
          preload="metadata"
          poster={cmsConfig.videoPoster || cmsConfig.imageUrl}
          className="absolute inset-0 w-full h-full object-cover -z-20 opacity-40 scale-105"
        >
          <source src={cmsConfig.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center -z-20 opacity-35 scale-105 transition-transform duration-10000"
          style={{
            backgroundImage: `url('${cmsConfig.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80'}')`
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-[#0B0F17]/30 -z-10" />

      <div className="max-w-6xl mx-auto w-full text-center space-y-8 relative z-10">
        
        {/* Top Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#D4AF37]/40 backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)]"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin duration-[4000ms]" />
          <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
            {heroBadge}
          </span>
        </motion.div>

        {/* Main Headline */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            {heroTitle}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        </div>

        {/* Quick Search Widget Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto glass-panel rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-500"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-left">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="all" className="bg-[#0F172A] text-white">All Excursions</option>
                <option value="sea-trips" className="bg-[#0F172A] text-white">Sea & Island Trips</option>
                <option value="desert-safari" className="bg-[#0F172A] text-white">Desert Quad Safari</option>
                <option value="vip-yacht" className="bg-[#0F172A] text-white">VIP Private Yacht</option>
                <option value="historical-tours" className="bg-[#0F172A] text-white">Historical Luxor & Pyramids</option>
              </select>
            </div>

            {/* Date Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t.date}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Guests Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t.guests}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="1" className="bg-[#0F172A] text-white">1 Traveler</option>
                <option value="2" className="bg-[#0F172A] text-white">2 Travelers</option>
                <option value="4" className="bg-[#0F172A] text-white">4 Travelers</option>
                <option value="6+" className="bg-[#0F172A] text-white">6+ Family / VIP Group</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div>
              <LuxuryButton
                type="submit"
                variant="gold"
                size="lg"
                data-cursor-text="SEARCH"
                className="w-full py-3.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <Search className="w-4 h-4" />
                {heroBtnText}
              </LuxuryButton>
            </div>

          </form>
        </motion.div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-slate-400 text-xs sm:text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] animate-pulse" />
            <span className="text-slate-200 font-bold">{t.statsRating}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-slate-200 font-bold">{t.statsTrips}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-slate-200 font-bold">{t.statsSafety}</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

