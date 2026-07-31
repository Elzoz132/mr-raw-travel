import { prisma } from '@/lib/db'

export interface HomepageConfig {
  heroTitleEn: string
  heroTitleAr: string
  heroTitleDe: string
  heroSubtitleEn: string
  heroSubtitleAr: string
  heroSubtitleDe: string
  heroBadgeEn: string
  heroBadgeAr: string
  heroBadgeDe: string
  heroBtnTextEn: string
  heroBtnTextAr: string
  heroBtnTextDe: string
  heroBtnLink: string
  mediaType: 'IMAGE' | 'VIDEO'
  // Image properties
  imageUrl: string
  // Video properties
  videoUrl: string
  videoAutoPlay: boolean
  videoLoop: boolean
  videoMute: boolean
  videoPoster: string
}

export const defaultHomepageConfig: HomepageConfig = {
  heroTitleEn: 'Unforgettable Red Sea Luxury Excursions',
  heroTitleAr: 'رحلات البحر الأحمر الفخامة والأناقة الملكية',
  heroTitleDe: 'Unvergessliche Rotes Meer Luxus Ausflüge',
  heroSubtitleEn: 'Experience world-class VIP private yachts, Giftun paradise island cruises, mega desert quad safaris, and ancient Luxor historical tours.',
  heroSubtitleAr: 'استمتع بأفضل رحلات اليخوت الخاصة VIP، ورحلات جزيرة جفتون، وسفاري البيتش باجي الشامل، ورحلات الأقصر التاريخية.',
  heroSubtitleDe: 'Erleben Sie VIP-Privatyachten, Insel Giftun Ausflüge, Quad-Safaris und historische Luxor-Touren.',
  heroBadgeEn: '★ #1 Rated Luxury Tourism Company in Hurghada',
  heroBadgeAr: '★ الشركة رقم #1 لرحلات السياحة الملكية بالغردقة',
  heroBadgeDe: '★ #1 Luxus-Reiseveranstalter in Hurghada',
  heroBtnTextEn: 'Explore Excursions',
  heroBtnTextAr: 'استكشف الرحلات',
  heroBtnTextDe: 'Ausflüge Entdecken',
  heroBtnLink: '/trips',
  mediaType: 'IMAGE',
  imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-diving-in-a-coral-reef-with-many-fish-42999-large.mp4',
  videoAutoPlay: true,
  videoLoop: true,
  videoMute: true,
  videoPoster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80'
}

export interface FooterConfig {
  companyName: string
  descriptionEn: string
  descriptionAr: string
  descriptionDe: string
  phone1: string
  phone2: string
  whatsApp: string
  email: string
  addressEn: string
  addressAr: string
  addressDe: string
  googleMapsUrl: string
  facebookUrl: string
  instagramUrl: string
  tikTokUrl: string
  youTubeUrl: string
  xUrl: string
  linkedInUrl: string
  workingHoursEn: string
  workingHoursAr: string
  workingHoursDe: string
  copyrightText: string
  paymentLogos: string[]
  trustBadges: string[]
  awards: string[]
  partners: string[]
  newsletterTextEn: string
  newsletterTextAr: string
  newsletterTextDe: string
  footerBackground: string
  footerLogo: string
}

export const defaultFooterConfig: FooterConfig = {
  companyName: 'Mr.Raw Travel',
  descriptionEn: 'The premier luxury tourism platform in Hurghada, Egypt. Specializing in VIP private yacht charters, Giftun island sea trips, mega desert quad safaris, and ancient Luxor guided tours.',
  descriptionAr: 'منصة السياحة الملكية الأولى في الغردقة، مصر. متخصصون في رحلات اليخوت الخاصة VIP، وجزيرة جفتون، وسفاري البيتش باجي، ورحلات الأقصر.',
  descriptionDe: 'Die führende Luxus-Tourismusplattform in Hurghada, Ägypten. Spezialisiert auf VIP-Yachten, Giftun-Inselausflüge, Wüstensafaris und Luxor-Touren.',
  phone1: '+20 109 988 7766',
  phone2: '+20 107 065 7476',
  whatsApp: '01070657476',
  email: 'info@mrrawtravel.com',
  addressEn: 'Marina Boulevard, VIP Tower 4, Hurghada, Red Sea, Egypt',
  addressAr: 'مارينا يخت الغردقة، برج VIP رقم 4، الغردقة، البحر الأحمر، مصر',
  addressDe: 'Marina Boulevard, VIP Tower 4, Hurghada, Rotes Meer, Ägypten',
  googleMapsUrl: 'https://maps.google.com',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tikTokUrl: 'https://tiktok.com',
  youTubeUrl: 'https://youtube.com',
  xUrl: 'https://x.com',
  linkedInUrl: 'https://linkedin.com',
  workingHoursEn: '24/7 Operations & Pickup Desk',
  workingHoursAr: 'خدمة العملاء والتحرك 24/7 طوال الأسبوع',
  workingHoursDe: '24/7 Betreuung & Abholservice',
  copyrightText: '© Mr.Raw Travel. All Rights Reserved.',
  paymentLogos: ['Cash on Arrival', 'InstaPay', 'Vodafone Cash', 'Bank Wire', 'Visa / Mastercard'],
  trustBadges: ['100% Certified Safety', 'TripAdvisor Excellence', 'Free Cancellation'],
  awards: ['Best Red Sea Tour Operator 2025', 'VIP Luxury Charter Award'],
  partners: ['Ministry of Tourism', 'Red Sea Coast Guard', 'Giftun National Park Authority'],
  newsletterTextEn: 'Subscribe to receive secret VIP discount vouchers for your Hurghada vacation.',
  newsletterTextAr: 'اشترك للحصول على خصومات وقسائم حصرية لرحلتك في الغردقة.',
  newsletterTextDe: 'Abonnieren Sie exklusive Gutscheine für Ihren Hurghada-Urlaub.',
  footerBackground: '#070A0F',
  footerLogo: '/logo.png'
}

export async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'cms_homepage_config' } })
    if (setting && setting.value) {
      return { ...defaultHomepageConfig, ...JSON.parse(setting.value) }
    }
  } catch (error) {
    console.error('Error fetching homepage config:', error)
  }
  return defaultHomepageConfig
}

export async function updateHomepageConfig(config: Partial<HomepageConfig>): Promise<HomepageConfig> {
  const current = await getHomepageConfig()
  const updated = { ...current, ...config }
  await prisma.settings.upsert({
    where: { key: 'cms_homepage_config' },
    update: { value: JSON.stringify(updated) },
    create: { key: 'cms_homepage_config', value: JSON.stringify(updated) }
  })
  return updated
}

export async function getFooterConfig(): Promise<FooterConfig> {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'cms_footer_config' } })
    if (setting && setting.value) {
      return { ...defaultFooterConfig, ...JSON.parse(setting.value) }
    }
  } catch (error) {
    console.error('Error fetching footer config:', error)
  }
  return defaultFooterConfig
}

export async function updateFooterConfig(config: Partial<FooterConfig>): Promise<FooterConfig> {
  const current = await getFooterConfig()
  const updated = { ...current, ...config }
  await prisma.settings.upsert({
    where: { key: 'cms_footer_config' },
    update: { value: JSON.stringify(updated) },
    create: { key: 'cms_footer_config', value: JSON.stringify(updated) }
  })
  return updated
}
