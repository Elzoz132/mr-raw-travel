import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'

export const metadata: Metadata = {
  title: 'دليل السفر ورحلات الغردقة | Mr.Raw Travel',
  description: 'نصائح ومعلومات شاملة لزوار الغردقة والبحر الأحمر. اكتشف أفضل المواعيد والأماكن لرحلات السنوركلينج، Orange Bay، ورحلات السفاري.',
  alternates: {
    canonical: 'https://mrrawtravel.com/blog',
    languages: {
      'ar-EG': 'https://mrrawtravel.com/blog',
      'en-US': 'https://mrrawtravel.com/blog',
      'de-DE': 'https://mrrawtravel.com/blog'
    }
  },
  openGraph: {
    title: 'دليل السفر ورحلات الغردقة | Mr.Raw Travel',
    description: 'نصائح ومعلومات حصرية لمسافري الغردقة والبحر الأحمر مع Mr.Raw Travel.',
    url: 'https://mrrawtravel.com/blog',
    images: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }]
  }
}

export default function BlogPage() {
  const posts = [
    {
      title: 'Complete Guide to Giftun Island & Orange Bay 2026',
      slug: 'giftun-island-orange-bay-guide',
      excerpt: 'Everything you need to know before visiting Orange Bay and Paradise Beach in Hurghada: best months, snorkeling spots, and what to pack.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      date: 'July 2026',
      readTime: '6 min read'
    },
    {
      title: 'Luxor Day Tour from Hurghada: Valley of Kings Tips',
      slug: 'luxor-day-tour-hurghada-guide',
      excerpt: 'How to make the most of your 1-day trip from Hurghada to Luxor. Explore Karnak temple, Hatshepsut, and royal tombs in comfort.',
      image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
      date: 'June 2026',
      readTime: '8 min read'
    },
    {
      title: 'Top 5 Snorkeling Spots in the Red Sea',
      slug: 'top-red-sea-snorkeling-spots',
      excerpt: 'Discover Dolphin House, Abu Dabbab, and Giftun National Park coral reefs inhabited by sea turtles and colorful reef fish.',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80',
      date: 'May 2026',
      readTime: '5 min read'
    }
  ]

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <Breadcrumbs items={[{ name: 'دليل السفر والمقالات السياحية', url: 'https://mrrawtravel.com/blog' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          TRAVEL INSIGHTS & GUIDES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          دليل زوار الغردقة والبحر الأحمر
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.slug} className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white hover:text-[#D4AF37] transition-colors">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{post.excerpt}</p>
              </div>

              <Link href="/trips" className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:gap-2 transition-all">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
