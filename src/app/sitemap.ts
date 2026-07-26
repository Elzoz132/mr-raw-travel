import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mrrawtravel.com'

  let tripUrls: MetadataRoute.Sitemap = []

  try {
    const trips = await prisma.trip.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true }
    })

    tripUrls = trips.map((t: any) => ({
      url: `${baseUrl}/trips/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  } catch (e) {
    console.error('Sitemap DB error:', e)
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/trips`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/customer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  return [...staticUrls, ...tripUrls]
}
