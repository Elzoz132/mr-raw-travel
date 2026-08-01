'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, PhoneCall } from 'lucide-react'
import { useAppStore } from '@/store/useStore'

export const FloatingWhatsAppWidget: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'
  const [whatsappNumber, setWhatsappNumber] = useState('01022392428')

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.whatsapp_number) {
          setWhatsappNumber(data.settings.whatsapp_number)
        }
      })
      .catch(() => {})
  }, [])

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  const formattedWaUrl = `https://wa.me/${cleanNumber.startsWith('0') ? '2' + cleanNumber : cleanNumber}?text=${encodeURIComponent(
    isArabic ? 'مرحباً، أود الاستفسار عن باقات ورحلات Mr.Raw Travel 🌴' : 'Hello, I would like to inquire about Mr.Raw Travel excursions 🌴'
  )}`

  return (
    <a
      href={formattedWaUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 border-2 border-white/20"
    >
      <MessageSquare className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline font-black text-xs tracking-wider uppercase">
        {isArabic ? 'الدعم عبر الواتساب' : 'WhatsApp Support'}
      </span>
      <span className="relative flex h-3 w-3 -ml-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  )
}
