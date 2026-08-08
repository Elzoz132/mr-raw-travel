import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mrrawtravel.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/trips', '/trips/*', '/gallery', '/blog'],
        disallow: ['/admin/', '/api/', '/customer/', '/auth/', '/booking/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
