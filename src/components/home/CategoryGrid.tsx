'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useStore'
import { Anchor, Compass, Crown, Landmark, Waves } from 'lucide-react'

export const CategoryGrid: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'
  const isGerman = language === 'de'

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Default fallback if database is empty
  const displayCategories = categories.length > 0 ? categories : [
    {
      id: '1',
      nameEn: 'Sea & Island Trips',
      nameAr: 'رحلات البحر والجزيرة',
      nameDe: 'Meeres- & Inselausflüge',
      slug: 'sea-trips',
      descEn: 'Giftun Island, Orange Bay, Paradise Beach & Coral Snorkeling',
      descAr: 'رحلات أورنج باي وجزيرة جفتون الفاخرة والغوص بالشعاب المرجانية',
      descDe: 'Giftun Island & Schnorcheln',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      icon: 'Anchor',
      _count: { trips: 12 }
    },
    {
      id: '2',
      nameEn: 'Desert Quad Safari',
      nameAr: 'سفاري وركوب الخيل',
      nameDe: 'Wüsten- & Pferdeausflüge',
      slug: 'desert-safari',
      descEn: 'Buggy Racing, Bedouin Village, Horse Riding & Night BBQ Show',
      descAr: 'سباق البيتش باجي، ركوب الخيل، والقرية البدوية وحفلة العشاء البدوي',
      descDe: 'Quad, Kamelritt & Beduinenshow',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      icon: 'Compass',
      _count: { trips: 8 }
    },
    {
      id: '3',
      nameEn: 'Water Sports & Speedboats',
      nameAr: 'الألعاب المائية والاسبيد بوت',
      nameDe: 'Wassersport & Schnellboote',
      slug: 'water-sports',
      descEn: 'Private Speedboat Charter, Parasailing, Banana Boat & Sofa Ride',
      descAr: 'إيجار اسبيد بوت خاص، طيران باراشوت، بنانا بوت، وكوادرا سوفا',
      descDe: 'Schnellboot, Parasailing & Bananenboot',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
      icon: 'Waves',
      _count: { trips: 5 }
    }
  ]

  const getIcon = (iconStr?: string) => {
    switch (iconStr) {
      case 'Anchor': return Anchor
      case 'Compass': return Compass
      case 'Crown': return Crown
      case 'Landmark': return Landmark
      case 'Waves':
      default: return Waves
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12 space-y-2"
      >
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
          {isArabic ? 'استكشف حسب الأقسام' : 'EXPLORE BY CATEGORY'}
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          {isArabic ? 'أقسام رحلات الغردقة والبحر الأحمر' : 'Curated Hurghada Travel Categories'}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCategories.map((cat: any, idx: number) => {
          const Icon = getIcon(cat.icon)
          const title = isArabic ? cat.nameAr : isGerman ? cat.nameDe : cat.nameEn
          const desc = isArabic ? cat.descAr : isGerman ? cat.descDe : cat.descEn
          const count = cat._count?.trips || 5

          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <Link
                href={`/trips?category=${cat.slug}`}
                className="glass-card rounded-3xl overflow-hidden group relative h-80 flex flex-col justify-end p-6 border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-500 block"
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out -z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent -z-10" />

                <div className="space-y-2 relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] text-[#0B0F17] flex items-center justify-center font-bold shadow-lg mb-3 group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-semibold text-[#D4AF37] tracking-wider uppercase block">
                    {count} {isArabic ? 'رحلة متاحة' : 'Excursions'}
                  </span>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {title}
                  </h3>

                  {desc && (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {desc}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
