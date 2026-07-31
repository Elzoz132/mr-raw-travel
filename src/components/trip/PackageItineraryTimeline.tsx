'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, Navigation, Anchor, Utensils, Waves, Sun, Compass } from 'lucide-react'

export interface ItineraryStep {
  time: string
  titleEn: string
  titleAr: string
  titleDe: string
  descEn?: string
  descAr?: string
  descDe?: string
  icon?: string
}

interface PackageItineraryTimelineProps {
  steps: ItineraryStep[]
  language: string
}

export const PackageItineraryTimeline: React.FC<PackageItineraryTimelineProps> = ({ steps, language }) => {
  const isArabic = language === 'ar'
  const isGerman = language === 'de'

  if (!steps || steps.length === 0) {
    // Fallback default timeline steps if package doesn't have custom itinerary steps
    steps = [
      { time: '08:00 AM', titleEn: 'Hotel Pickup & Transfer', titleAr: 'الانتقال من الفندق بالباص المكيف', titleDe: 'Hotelabholung und Transfer' },
      { time: '09:00 AM', titleEn: 'Boat Departure & Safety Briefing', titleAr: 'الإبحار وتوجيهات السلامة', titleDe: 'Abfahrt des Bootes' },
      { time: '10:30 AM', titleEn: 'First Coral Reef Snorkeling Stop', titleAr: 'وقفة السنوركلينج الأولى للشعاب المرجانية', titleDe: 'Erster Schnorchelstopp' },
      { time: '12:30 PM', titleEn: 'Open Buffet Seafood & BBQ Lunch', titleAr: 'وجبة الغداء بوفيه مفتوح ومأكولات بحرية', titleDe: 'Mittagsbuffet an Bord' },
      { time: '02:00 PM', titleEn: 'Island Stay & Relaxation', titleAr: 'النزول والاسترخاء على الجزيرة', titleDe: 'Inselaufenthalt' },
      { time: '04:30 PM', titleEn: 'Return Transfer to Hotel', titleAr: 'العودة والتوصيل للفندق', titleDe: 'Rücktransfer zum Hotel' }
    ]
  }

  const getTitle = (step: ItineraryStep) => isArabic ? step.titleAr : isGerman ? step.titleDe : step.titleEn
  const getDesc = (step: ItineraryStep) => isArabic ? step.descAr : isGerman ? step.descDe : step.descEn

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#D4AF37]">
        <Clock className="w-4 h-4" />
        <span>{isArabic ? 'جدول وبرنامج الرحلة التفصيلي' : 'Interactive Excursion Timeline'}</span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#D4AF37]/40 before:to-transparent">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative flex items-start gap-4 group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#0B0F17] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            {/* Step Card */}
            <div className="glass-panel rounded-2xl p-4 border border-white/10 w-full space-y-1 group-hover:border-[#D4AF37]/50 transition-all">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                  {step.time}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Step {idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                {getTitle(step)}
              </h4>
              {getDesc(step) && (
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {getDesc(step)}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
