'use client'

import React from 'react'

interface JsonLdProps {
  type: 'TouristAttraction' | 'Product' | 'FAQPage' | 'BreadcrumbList'
  data: Record<string, any>
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
  let schemaData: Record<string, any> = {}

  if (type === 'TouristAttraction') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: data.title,
      description: data.description,
      image: data.image,
      touristType: ['Luxury', 'Adventure', 'Family', 'VIP'],
      location: {
        '@type': 'Place',
        name: data.location || 'Hurghada, Red Sea, Egypt',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hurghada',
          addressRegion: 'Red Sea',
          addressCountry: 'EG',
        },
      },
      offers: {
        '@type': 'Offer',
        price: data.priceUsd,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating || 4.95,
        reviewCount: data.reviewCount || 100,
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
