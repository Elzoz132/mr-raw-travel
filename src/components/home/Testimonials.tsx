'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useStore'
import { Star, Quote, CheckCircle } from 'lucide-react'

export const Testimonials: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const defaultReviews = [
    {
      id: '1',
      author: 'Alexander & Family',
      country: 'Germany 🇩🇪',
      rating: 5,
      packageName: 'Giftun Island & Orange Bay VIP',
      comment: 'From the VIP pickup in Steigenberger hotel to the incredible seafood lunch buffet on board, Mr.Raw Travel exceeded all our expectations! The snorkeling guide stayed with our child the entire time.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      author: 'Elena & Dmitry',
      country: 'Russia 🇷🇺',
      rating: 5,
      packageName: 'Royal Private Yacht Charter',
      comment: 'Renting the private yacht for my birthday was the highlight of our Red Sea holiday! Dolphin House was magical, and the private chef prepared fresh seafood.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      author: 'Sarah & James',
      country: 'United Kingdom 🇬🇧',
      rating: 5,
      packageName: 'Mega Desert Safari & Bedouin Show',
      comment: 'The quad safari across golden sand dunes was thrilling! Bedouin tea, camel ride, fire show, and stargazing telescope made it an unforgettable evening.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
          {isArabic ? 'تقييمات وآراء العملاء' : 'REAL GUEST REVIEWS'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          {isArabic ? 'آراء أكثر من 50,000 سائح من جميع أنحاء العالم' : 'Loved by Over 50,000 Tourists'}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayReviews.map((rev: any, idx: number) => (
          <motion.div
            key={rev.id || idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -8 }}
            className="glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 relative border border-white/10 hover:border-[#D4AF37]/40 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] transition-all duration-300"
          >
            <Quote className="w-10 h-10 text-[#D4AF37]/20 absolute top-6 right-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current animate-pulse" />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center gap-4">
              <img
                src={rev.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt={rev.author || 'Guest'}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {rev.author || 'Verified Traveler'}
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <span className="text-[11px] text-slate-400 block">{rev.country || 'International'}</span>
                {rev.packageName && (
                  <span className="text-[10px] text-[#D4AF37] font-medium block">{rev.packageName}</span>
                )}
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  )
}
