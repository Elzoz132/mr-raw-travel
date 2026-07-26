'use client'

import React from 'react'
import { Star, Quote, CheckCircle } from 'lucide-react'

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Alexander & Family',
      country: 'Germany 🇩🇪',
      rating: 5,
      trip: 'Giftun Island & Orange Bay VIP',
      comment: 'From the VIP pickup in Steigenberger hotel to the incredible seafood lunch buffet on board, Mr.Raw Travel exceeded all our expectations! The snorkeling guide stayed with our 7-year-old child the entire time.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Elena & Dmitry',
      country: 'Russia 🇷🇺',
      rating: 5,
      trip: 'Royal Private Yacht Charter',
      comment: 'Renting the private yacht for my birthday was the highlight of our Red Sea holiday! Dolphin House was magical, and the private chef prepared lobster tails and fresh prawns.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sarah & James',
      country: 'United Kingdom 🇬🇧',
      rating: 5,
      trip: 'Mega Desert Safari & Bedouin Show',
      comment: 'The quad safari across the golden sand dunes was thrilling! The Bedouin tea, camel ride, fire show, and stargazing telescope made it an unforgettable evening.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
          REAL GUEST REVIEWS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Loved by Over 50,000 Tourists
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 relative"
          >
            <Quote className="w-10 h-10 text-[#D4AF37]/20 absolute top-6 right-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center gap-4">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
              />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {rev.name}
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <span className="text-[11px] text-slate-400 block">{rev.country}</span>
                <span className="text-[10px] text-[#D4AF37] font-medium block">{rev.trip}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
