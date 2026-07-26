import { MasonryGallery } from '@/components/home/MasonryGallery'

export default function GalleryPage() {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          HIGH-DEFINITION MEDIA GALLERY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Hurghada Tourism Photo Showcase
        </h1>
        <p className="text-sm text-slate-300">
          Explore captured moments from Giftun island, Dolphin reefs, VIP motor yachts, and desert quad safaris.
        </p>
      </div>

      <MasonryGallery />
    </div>
  )
}
