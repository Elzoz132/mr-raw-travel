'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { useAppStore } from '@/store/useStore'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const homeItem: BreadcrumbItem = {
    name: isArabic ? 'الرئيسية' : 'Home',
    url: 'https://mrrawtravel.com'
  }

  const allItems = [homeItem, ...items]

  // Schema.org JSON-LD BreadcrumbList
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://mrrawtravel.com${item.url}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <nav aria-label="Breadcrumb" className="py-3 px-1 text-xs font-semibold text-slate-400">
        <ol className="flex flex-wrap items-center gap-2">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const isHome = index === 0

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  isArabic ? (
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  )
                )}

                {isLast ? (
                  <span className="text-[#D4AF37] font-bold truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url.replace('https://mrrawtravel.com', '') || '/'}
                    className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
                  >
                    {isHome && <Home className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
