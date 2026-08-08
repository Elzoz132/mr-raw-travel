import type { Metadata } from 'next'
import { MasonryGallery } from '@/components/home/MasonryGallery'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'

export const metadata: Metadata = {
  title: 'معرض صور وفيديوهات رحلات الغردقة | Mr.Raw Travel',
  description: 'شاهد أجمل اللقطات والصور الحية لرحلات أورنج باي، السنوركلينج، جزيرة جفتون، رحلات اليخت، وسفاري البيتش باجي في الغردقة مع Mr.Raw Travel.',
  alternates: {
    canonical: 'https://mrrawtravel.com/gallery',
    languages: {
      'ar-EG': 'https://mrrawtravel.com/gallery',
      'en-US': 'https://mrrawtravel.com/gallery',
      'de-DE': 'https://mrrawtravel.com/gallery'
    }
  },
  openGraph: {
    title: 'معرض صور وفيديوهات رحلات الغردقة | Mr.Raw Travel',
    description: 'شاهد أجمل اللقطات والصور الحية لرحلات الغردقة والبحر الأحمر.',
    url: 'https://mrrawtravel.com/gallery',
    images: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }]
  }
}

export default function GalleryPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Breadcrumbs items={[{ name: 'معرض الصور والفيديوهات', url: 'https://mrrawtravel.com/gallery' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          HIGH-DEFINITION MEDIA GALLERY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          معرض صور وفيديوهات مستر رو ترافيل
        </h1>
        <p className="text-sm text-slate-300">
          استكشف أحدث اللقطات والصور الحية من رحلات جفتون، أورنج باي، السنوركلينج وسفاري الصحراء بالغردقة.
        </p>
      </div>

      <MasonryGallery />
    </div>
  )
}
