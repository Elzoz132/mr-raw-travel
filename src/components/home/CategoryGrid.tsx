'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Anchor, Compass, Crown, Landmark } from 'lucide-react'

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      title: 'Sea & Island Trips',
      slug: 'sea-trips',
      desc: 'Giftun Island, Orange Bay, Paradise Beach & Coral Snorkeling',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      icon: Anchor,
      count: '12 Excursions'
    },
    {
      title: 'Desert Quad Safari',
      slug: 'desert-safari',
      desc: 'Buggy Racing, Bedouin Village, Camel Ride & Night BBQ Show',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      icon: Compass,
      count: '8 Excursions'
    },
    {
      title: 'VIP Private Yacht',
      slug: 'vip-yacht',
      desc: 'Exclusive Charter, Private Chef, Sunset Cruise & Dolphin Reefs',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
      icon: Crown,
      count: '5 Charters'
    },
    {
      title: 'Historical Luxor & Pyramids',
      slug: 'historical-tours',
      desc: 'Karnak Temple, Valley of the Kings & Giza Pyramids Day Trips',
      image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
      icon: Landmark,
      count: '6 Day Tours'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
          EXPLORE BY CATEGORY
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          Curated Hurghada Travel Categories
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon
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
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out -z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent -z-10" />

                <div className="space-y-2 relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] text-[#0B0F17] flex items-center justify-center font-bold shadow-lg mb-3 group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-semibold text-[#D4AF37] tracking-wider uppercase block">
                    {cat.count}
                  </span>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
