'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, Navigation, Anchor, Utensils, Waves, Sun, Compass } from 'lucide-react'

export interface ItineraryStep {
  time?: string
  title?: string
  titleEn?: string
  titleAr?: string
  titleDe?: string
  desc?: string
  descEn?: string
  descAr?: string
  descDe?: string
  icon?: string
}

interface PackageItineraryTimelineProps {
  steps?: ItineraryStep[] | null
  language: string
}

// Auto-translation dictionary for common excursion timeline items
const timelineTranslations: Record<string, { ar: string; de: string }> = {
  'hotel pickup': { ar: 'الانتقال والتوصيل من الفندق بالباص المكيف', de: 'Hotelabholung und Transfer' },
  'hotel pickup & transfer': { ar: 'الانتقال والتوصيل من الفندق بالباص المكيف', de: 'Hotelabholung und Transfer' },
  'arrival at safari station': { ar: 'الوصول إلى محطة السفاري وتلقي التعليمات', de: 'Ankunft an der Safari-Station' },
  'quad bike ride': { ar: 'قيادة البيتش باجي (Quad Bike) في الصحراء', de: 'Quad-Bike-Fahrt in der Wüste' },
  'quad bike riding': { ar: 'قيادة البيتش باجي (Quad Bike) في الصحراء', de: 'Quad-Bike-Fahrt in der Wüste' },
  'bedouin village visit': { ar: 'زيارة القرية البدوية وتناول الشاي الجبلي', de: 'Besuch des Beduinendorfs' },
  'camel ride': { ar: 'تجربة ركوب الجمال في قلب الصحراء', de: 'Kamelreiten in der Wüste' },
  'camel riding': { ar: 'تجربة ركوب الجمال في قلب الصحراء', de: 'Kamelreiten in der Wüste' },
  'dinner': { ar: 'وجبة العشاء البدوي الفاخر والمشويات', de: 'Beduinen-Abendessen vom Grill' },
  'bedouin dinner': { ar: 'وجبة العشاء البدوي الفاخر والمشويات', de: 'Beduinen-Abendessen vom Grill' },
  'oriental show': { ar: 'العرض الشرقي والحفلة الفلكلورية (تنورة وحواة)', de: 'Orient-Show und Folklore' },
  'oriental show & folklore': { ar: 'العرض الشرقي والحفلة الفلكلورية (تنورة وحواة)', de: 'Orient-Show und Folklore' },
  'return to hotel': { ar: 'العودة والتوصيل إلى الفندق', de: 'Rücktransfer zum Hotel' },
  'return transfer to hotel': { ar: 'العودة والتوصيل إلى الفندق', de: 'Rücktransfer zum Hotel' },
  'boat departure': { ar: 'الإبحار وتوجيهات السلامة من طاقم اليخت', de: 'Abfahrt des Bootes und Sicherheitsbriefing' },
  'boat departure & safety briefing': { ar: 'الإبحار وتوجيهات السلامة من طاقم اليخت', de: 'Abfahrt des Bootes und Sicherheitsbriefing' },
  'first coral reef snorkeling stop': { ar: 'وقفة السنوركلينج الأولى لمشاهدة الشعاب المرجانية', de: 'Erster Schnorchelstopp an den Korallenriffen' },
  'open buffet seafood & bbq lunch': { ar: 'وجبة الغداء بوفيه مفتوح ومأكولات بحرية ومشروبات', de: 'Mittagsbuffet mit Meeresfrüchten an Bord' },
  'island stay & relaxation': { ar: 'النزول والاسترخاء على شاطئ الجزيرة', de: 'Inselaufenthalt und Entspannung' }
}

export const PackageItineraryTimeline: React.FC<PackageItineraryTimelineProps> = ({ steps, language }) => {
  const isArabic = language === 'ar'
  const isGerman = language === 'de'

  let safeSteps: ItineraryStep[] = Array.isArray(steps) ? steps.filter(Boolean) : []

  if (safeSteps.length === 0) {
    // Fallback default timeline steps if package doesn't have custom itinerary steps
    safeSteps = [
      { time: '08:00 AM', titleEn: 'Hotel Pickup & Transfer', titleAr: 'الانتقال من الفندق بالباص المكيف', titleDe: 'Hotelabholung und Transfer' },
      { time: '09:00 AM', titleEn: 'Boat Departure & Safety Briefing', titleAr: 'الإبحار وتوجيهات السلامة', titleDe: 'Abfahrt des Bootes' },
      { time: '10:30 AM', titleEn: 'First Coral Reef Snorkeling Stop', titleAr: 'وقفة السنوركلينج الأولى للشعاب المرجانية', titleDe: 'Erster Schnorchelstopp' },
      { time: '12:30 PM', titleEn: 'Open Buffet Seafood & BBQ Lunch', titleAr: 'وجبة الغداء بوفيه مفتوح ومأكولات بحرية', titleDe: 'Mittagsbuffet an Bord' },
      { time: '02:00 PM', titleEn: 'Island Stay & Relaxation', titleAr: 'النزول والاسترخاء على الجزيرة', titleDe: 'Inselaufenthalt' },
      { time: '04:30 PM', titleEn: 'Return Transfer to Hotel', titleAr: 'العودة والتوصيل للفندق', titleDe: 'Rücktransfer zum Hotel' }
    ]
  }

  const getTitle = (step: ItineraryStep) => {
    let rawTitle = isArabic
      ? (step.titleAr || step.title)
      : isGerman
      ? (step.titleDe || step.titleEn || step.title)
      : (step.titleEn || step.title || step.titleAr)

    if (!rawTitle) rawTitle = step.titleEn || step.titleAr || ''

    // If language is Arabic or German and the text is English, attempt auto-translation from dictionary
    const key = rawTitle.trim().toLowerCase()
    if (isArabic && timelineTranslations[key]) {
      return timelineTranslations[key].ar
    }
    if (isGerman && timelineTranslations[key]) {
      return timelineTranslations[key].de
    }

    return rawTitle
  }

  const getDesc = (step: ItineraryStep) => {
    const rawDesc = isArabic
      ? (step.descAr || step.desc)
      : isGerman
      ? (step.descDe || step.descEn || step.desc)
      : (step.descEn || step.desc || step.descAr)

    return rawDesc || ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#D4AF37]">
        <Clock className="w-4 h-4" />
        <span>{isArabic ? 'جدول وبرنامج الرحلة التفصيلي' : isGerman ? 'Detaillierter Reiseverlauf' : 'Interactive Excursion Timeline'}</span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#D4AF37]/40 before:to-transparent">
        {safeSteps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                  {step.time || `Phase ${idx + 1}`}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{isArabic ? `المرحلة ${idx + 1}` : `Step ${idx + 1}`}</span>
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

