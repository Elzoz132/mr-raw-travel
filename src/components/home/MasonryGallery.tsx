'use client'

import React, { useState } from 'react'

export const MasonryGallery: React.FC = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', title: 'Giftun Island Beach', cat: 'Sea' },
    { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80', title: 'Desert Quad Safari', cat: 'Safari' },
    { url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', title: 'VIP Sunset Yacht', cat: 'Yacht' },
    { url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80', title: 'Luxor Karnak Temple', cat: 'Luxor' },
    { url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80', title: 'Red Sea Snorkeling', cat: 'Sea' },
    { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', title: 'Bedouin Night Show', cat: 'Safari' },
  ]

  const [activeTab, setActiveTab] = useState('ALL')
  const filtered = activeTab === 'ALL' ? images : images.filter((img) => img.cat === activeTab)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
          CAPTURED MOMENTS
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          Red Sea Excursion Photo Gallery
        </h2>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {['ALL', 'Sea', 'Safari', 'Yacht', 'Luxor'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl overflow-hidden group relative h-64 shadow-xl"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {img.cat}
              </span>
              <h4 className="text-sm font-bold text-white">{img.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
