'use client'

import React from 'react'

interface JsonLdProps {
  type: 'TouristTrip' | 'Product' | 'TravelAgency' | 'FAQPage' | 'BreadcrumbList' | 'TouristAttraction'
  data: Record<string, any>
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
  let schemaData: Record<string, any> = {}

  if (type === 'TouristTrip' || type === 'Product' || type === 'TouristAttraction') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': ['Product', 'TouristTrip'],
      name: data.title,
      description: data.description,
      image: data.image,
      offers: {
        '@type': 'Offer',
        price: data.priceUsd || data.price || 45,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
        url: data.url || 'https://mrrawtravel.com',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating || 4.95,
        reviewCount: data.reviewCount || 450,
        bestRating: 5,
        worstRating: 1,
      },
    }
  } else if (type === 'TravelAgency') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: data.title || 'Mr.Raw Travel',
      description: data.description,
      image: data.image,
      priceRange: '$$$',
      telephone: '+201022392428',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hurghada',
        addressRegion: 'Red Sea',
        addressCountry: 'EG',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating || 4.95,
        reviewCount: data.reviewCount || 450,
        bestRating: 5,
        worstRating: 1,
      },
    }
  } else if (type === 'FAQPage') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data.faqs || []).map((faq: { q: string; a: string }) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }
  } else if (type === 'BreadcrumbList') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data.items || []).map((item: { name: string; url: string }, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
