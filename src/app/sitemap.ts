import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mrrawtravel.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/trips`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }
  ]

  try {
    const trips = await prisma.trip.findMany({
      where: {
        isPublished: true,
        isIndexed: true,
        deletedAt: null
      },
      select: {
        slug: true,
        seoSlug: true,
        updatedAt: true
      }
    })

    const tripRoutes: MetadataRoute.Sitemap = trips.map((t: any) => ({
      url: `${baseUrl}/trips/${t.seoSlug || t.slug}`,
      lastModified: t.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }))

    return [...staticRoutes, ...tripRoutes]
  } catch (e) {
    return staticRoutes
  }
}
