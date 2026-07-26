'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      q: 'Is hotel pickup and drop-off included in all Hurghada excursions?',
      a: 'Yes! Roundtrip transfers in clean, air-conditioned Mercedes Sprinter or VIP vehicles are included from all hotels in Hurghada, El Gouna, Sahl Hasheesh, Soma Bay, and Makadi Bay.'
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept Cash on Arrival (pay driver directly upon pickup), InstaPay, Vodafone Cash, Bank Transfers, as well as Credit/Debit Cards via Stripe and Paymob.'
    },
    {
      q: 'What is your cancellation policy?',
      a: 'We offer 100% free cancellation up to 24 hours before your excursion pickup time. No questions asked!'
    },
    {
      q: 'What should I bring for Giftun Island & Sea Trips?',
      a: 'Bring your swimwear, towels, sunblock, sunglasses, and camera. High-quality snorkeling masks, fins, and life jackets are provided free on board.'
    },
    {
      q: 'Are your tour guides fluent in German, English, and Arabic?',
      a: 'Yes, all our licensed marine guides and Egyptologists are fluent in English, German, and Arabic.'
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-white hover:text-[#D4AF37] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
