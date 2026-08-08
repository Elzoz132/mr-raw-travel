import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- SEEDING NEW TRIPS & PACKAGES ---')

  // 1. Get or Create Categories
  const horseCat = await prisma.tripCategory.upsert({
    where: { slug: 'horse-riding' },
    update: {
      nameEn: 'Horse Riding Excursions',
      nameAr: 'رحلة ركوب الخيل',
      nameDe: 'Pferde-Reitausflüge'
    },
    create: {
      slug: 'horse-riding',
      nameEn: 'Horse Riding Excursions',
      nameAr: 'رحلة ركوب الخيل',
      nameDe: 'Pferde-Reitausflüge',
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Horse'
    }
  })

  const waterSportsCat = await prisma.tripCategory.upsert({
    where: { slug: 'water-sports' },
    update: {
      nameEn: 'Water Sports',
      nameAr: 'الألعاب المائية',
      nameDe: 'Wassersport'
    },
    create: {
      slug: 'water-sports',
      nameEn: 'Water Sports',
      nameAr: 'الألعاب المائية',
      nameDe: 'Wassersport',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      icon: 'Waves'
    }
  })

  // -------------------------------------------------------------
  // TRIP 1: HORSE RIDING
  // -------------------------------------------------------------
  const horseTrip = await prisma.trip.upsert({
    where: { slug: 'horse-riding-hurghada' },
    update: {
      titleAr: 'ركوب الخيل - مغامرة بين الصحراء والبحر',
      titleEn: 'Horse Riding - Desert & Sea Adventure',
      titleDe: 'Horse Riding - Desert & Sea Adventure',
      location: 'Hurghada, Egypt',
      duration: '2 Hours',
      pickupTime: '03:00 PM',
      meetingPoint: 'Hotel pickup / Hurghada hotels',
      maxSeats: 30,
      priceAdultEgp: 1000,
      priceAdultUsd: 20,
      priceAdultEur: 18,
      priceChildEgp: 1000,
      priceChildUsd: 20,
      priceChildEur: 18,
      rating: 4.98,
      reviewCount: 45,
      isFeatured: true,
      isPublished: true,
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      descAr: 'استمتع بتجربة مختلفة في الغردقة تجمع بين ركوب الخيل وسط أجواء الصحراء والاستمتاع بركوب الخيل على البحر. رحلة لمدة ساعتين تمنحك فرصة لاكتشاف الطبيعة الصحراوية والمناظر الساحلية للبحر الأحمر بطريقة ممتعة ومميزة، مع مدرب مرافق ومعدات أمان مناسبة.',
      descEn: 'Enjoy a unique horseback riding experience in Hurghada combining the beauty of the desert with the Red Sea coastline. During this two-hour adventure, ride through the desert and enjoy a memorable horseback experience by the sea, accompanied by a professional guide and safety equipment.',
      descDe: 'Genießen Sie ein einzigartiges Reiterlebnis in Hurghada, das die Schönheit der Wüste mit der Küste des Roten Meeres verbindet. Reiten Sie während dieses zweistündigen Abenteuers durch die Wüste und am Meer.',
      seoTitle: 'Horse Riding in Hurghada | Desert & Sea Horse Riding | Mr.Raw Travel',
      seoDescription: 'Enjoy a 2-hour horse riding adventure in Hurghada combining desert landscapes and the Red Sea. Hotel transfers, safety equipment and professional guidance included.',
      includedAr: JSON.stringify([
        'ساعة ركوب في الصحراء',
        'ساعة ركوب في البحر',
        'تجربة مناسبة للعائلات والأصدقاء',
        'مدرب مرافق',
        'خوذة ومعدات أمان',
        'انتقالات من وإلى الفندق',
        'مياه معدنية',
        'فرصة للتصوير أثناء الرحلة'
      ]),
      includedEn: JSON.stringify([
        '2-hour horse riding experience',
        '1 hour desert horse riding',
        '1 hour beach/sea horse riding',
        'Hotel transportation',
        'Professional guide/instructor',
        'Safety helmet/equipment',
        'Bottled water'
      ]),
      includedDe: JSON.stringify([
        '2-Stunden-Pferdeabenteuer',
        '1 Std. Wüstenritt',
        '1 Std. Strand/Meeresritt',
        'Hoteltransfer',
        'Professioneller Guide',
        'Sicherheitsausrüstung',
        'Wasser'
      ]),
      excludedAr: JSON.stringify([
        'أي خدمات أو أنشطة إضافية غير مذكورة في البرنامج',
        'المصروفات الشخصية',
        'أي صور أو خدمات إضافية إذا كانت مدفوعة بشكل منفصل'
      ]),
      excludedEn: JSON.stringify([
        'Any additional services or activities not mentioned in program',
        'Personal expenses',
        'Photos/videos if charged separately'
      ]),
      excludedDe: JSON.stringify([
        'Zusätzliche Dienstleistungen',
        'Persönliche Ausgaben',
        'Fotos/Videos'
      ]),
      itineraryAr: JSON.stringify([
        { time: '03:00 PM', title: 'Pickup from hotel', desc: 'التوصيل من الفندق بالباص المكيف' },
        { time: '03:30 PM', title: 'Transfer & Briefing', desc: 'الوصول وارتداء خوذة السلامة ومعدات الأمان' },
        { time: '03:45 PM', title: 'Start Desert Riding', desc: 'ساعة كاملة ركوب خيل وسط جبال الصحراء' },
        { time: '04:45 PM', title: 'Sea Swimming Riding', desc: 'ساعة ركوب خيل ممتعة داخل مياه البحر' },
        { time: '05:45 PM', title: 'Return Transfer', desc: 'انتهاء الرحلة والتوصيل للفندق' }
      ]),
      itineraryEn: JSON.stringify([
        { time: '03:00 PM', titleEn: 'Pickup from hotel', descEn: 'Pickup from hotel by AC vehicle' },
        { time: '03:30 PM', titleEn: 'Arrival & Safety briefing', descEn: 'Briefing and preparation' },
        { time: '03:45 PM', titleEn: 'Desert Horse Riding', descEn: 'Horse riding through desert for approx 1 hour' },
        { time: '04:45 PM', titleEn: 'Sea Horse Riding', descEn: 'Horse riding by the sea for approx 1 hour' },
        { time: '05:45 PM', titleEn: 'Return Transfer', descEn: 'Return transfer to hotel' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '03:00 PM', titleDe: 'Hotelabholung', descDe: 'Abholung vom Hotel' },
        { time: '03:30 PM', titleDe: 'Einweisung', descDe: 'Sicherheitseinweisung' },
        { time: '03:45 PM', titleDe: 'Wüstenritt', descDe: '1 Std. Wüstenritt' },
        { time: '04:45 PM', titleDe: 'Meeresritt', descDe: '1 Std. Meeresritt' },
        { time: '05:45 PM', titleDe: 'Rücktransfer', descDe: 'Rücktransfer zum Hotel' }
      ])
    },
    create: {
      slug: 'horse-riding-hurghada',
      categoryId: horseCat.id,
      titleAr: 'ركوب الخيل - مغامرة بين الصحراء والبحر',
      titleEn: 'Horse Riding - Desert & Sea Adventure',
      titleDe: 'Horse Riding - Desert & Sea Adventure',
      location: 'Hurghada, Egypt',
      duration: '2 Hours',
      pickupTime: '03:00 PM',
      meetingPoint: 'Hotel pickup / Hurghada hotels',
      maxSeats: 30,
      priceAdultEgp: 1000,
      priceAdultUsd: 20,
      priceAdultEur: 18,
      priceChildEgp: 1000,
      priceChildUsd: 20,
      priceChildEur: 18,
      rating: 4.98,
      reviewCount: 45,
      isFeatured: true,
      isPublished: true,
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      descAr: 'استمتع بتجربة مختلفة في الغردقة تجمع بين ركوب الخيل وسط أجواء الصحراء والاستمتاع بركوب الخيل على البحر. رحلة لمدة ساعتين تمنحك فرصة لاكتشاف الطبيعة الصحراوية والمناظر الساحلية للبحر الأحمر بطريقة ممتعة ومميزة، مع مدرب مرافق ومعدات أمان مناسبة.',
      descEn: 'Enjoy a unique horseback riding experience in Hurghada combining the beauty of the desert with the Red Sea coastline. During this two-hour adventure, ride through the desert and enjoy a memorable horseback experience by the sea, accompanied by a professional guide and safety equipment.',
      descDe: 'Genießen Sie ein einzigartiges Reiterlebnis in Hurghada, das die Schönheit der Wüste mit der Küste des Roten Meeres verbindet. Reiten Sie während dieses zweistündigen Abenteuers durch die Wüste und am Meer.',
      seoTitle: 'Horse Riding in Hurghada | Desert & Sea Horse Riding | Mr.Raw Travel',
      seoDescription: 'Enjoy a 2-hour horse riding adventure in Hurghada combining desert landscapes and the Red Sea. Hotel transfers, safety equipment and professional guidance included.',
      includedAr: JSON.stringify([
        'ساعة ركوب في الصحراء',
        'ساعة ركوب في البحر',
        'تجربة مناسبة للعائلات والأصدقاء',
        'مدرب مرافق',
        'خوذة ومعدات أمان',
        'انتقالات من وإلى الفندق',
        'مياه معدنية',
        'فرصة للتصوير أثناء الرحلة'
      ]),
      includedEn: JSON.stringify([
        '2-hour horse riding experience',
        '1 hour desert horse riding',
        '1 hour beach/sea horse riding',
        'Hotel transportation',
        'Professional guide/instructor',
        'Safety helmet/equipment',
        'Bottled water'
      ]),
      includedDe: JSON.stringify([
        '2-Stunden-Pferdeabenteuer',
        '1 Std. Wüstenritt',
        '1 Std. Strand/Meeresritt',
        'Hoteltransfer',
        'Professioneller Guide',
        'Sicherheitsausrüstung',
        'Wasser'
      ]),
      excludedAr: JSON.stringify([
        'أي خدمات أو أنشطة إضافية غير مذكورة في البرنامج',
        'المصروفات الشخصية',
        'أي صور أو خدمات إضافية إذا كانت مدفوعة بشكل منفصل'
      ]),
      excludedEn: JSON.stringify([
        'Any additional services or activities not mentioned in program',
        'Personal expenses',
        'Photos/videos if charged separately'
      ]),
      excludedDe: JSON.stringify([
        'Zusätzliche Dienstleistungen',
        'Persönliche Ausgaben',
        'Fotos/Videos'
      ]),
      itineraryAr: JSON.stringify([
        { time: '03:00 PM', title: 'Pickup from hotel', desc: 'التوصيل من الفندق بالباص المكيف' },
        { time: '03:30 PM', title: 'Transfer & Briefing', desc: 'الوصول وارتداء خوذة السلامة ومعدات الأمان' },
        { time: '03:45 PM', title: 'Start Desert Riding', desc: 'ساعة كاملة ركوب خيل وسط جبال الصحراء' },
        { time: '04:45 PM', title: 'Sea Swimming Riding', desc: 'ساعة ركوب خيل ممتعة داخل مياه البحر' },
        { time: '05:45 PM', title: 'Return Transfer', desc: 'انتهاء الرحلة والتوصيل للفندق' }
      ]),
      itineraryEn: JSON.stringify([
        { time: '03:00 PM', titleEn: 'Pickup from hotel', descEn: 'Pickup from hotel by AC vehicle' },
        { time: '03:30 PM', titleEn: 'Arrival & Safety briefing', descEn: 'Briefing and preparation' },
        { time: '03:45 PM', titleEn: 'Desert Horse Riding', descEn: 'Horse riding through desert for approx 1 hour' },
        { time: '04:45 PM', titleEn: 'Sea Horse Riding', descEn: 'Horse riding by the sea for approx 1 hour' },
        { time: '05:45 PM', titleEn: 'Return Transfer', descEn: 'Return transfer to hotel' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '03:00 PM', titleDe: 'Hotelabholung', descDe: 'Abholung vom Hotel' },
        { time: '03:30 PM', titleDe: 'Einweisung', descDe: 'Sicherheitseinweisung' },
        { time: '03:45 PM', titleDe: 'Wüstenritt', descDe: '1 Std. Wüstenritt' },
        { time: '04:45 PM', titleDe: 'Meeresritt', descDe: '1 Std. Meeresritt' },
        { time: '05:45 PM', titleDe: 'Rücktransfer', descDe: 'Rücktransfer zum Hotel' }
      ])
    }
  })

  // Upsert Package 1 for Horse Riding
  await prisma.tripPackage.deleteMany({
    where: { tripId: horseTrip.id }
  })

  await prisma.tripPackage.create({
    data: {
      tripId: horseTrip.id,
      nameAr: 'ركوب الخيل - الصحراء والبحر',
      nameEn: 'Horse Riding - Desert & Sea',
      nameDe: 'Pferdereiten - Wüste & Meer',
      descAr: 'رحلة ركوب خيل لمدة ساعتين تجمع بين ركوب الخيل في الصحراء وركوب الخيل على البحر، مع انتقالات من وإلى الفندق ومدرب مرافق ومعدات أمان ومياه معدنية.',
      descEn: 'A 2-hour horseback riding experience combining desert riding and beach/sea riding, including hotel transfers, professional guidance, safety equipment and bottled water.',
      descDe: 'Ein 2-stündiges Reiterlebnis, das Wüsten- und Strandreiten kombiniert, inklusive Hoteltransfer, professioneller Führung, Sicherheitsausrüstung und Mineralwasser.',
      duration: '2 Hours',
      startTime: '03:00 PM',
      endTime: '05:00 PM',
      capacity: 30,
      badge: 'BEST VALUE',
      priceAdultEgp: 1000,
      priceAdultUsd: 20,
      priceAdultEur: 18,
      priceChildEgp: 1000,
      priceChildUsd: 20,
      priceChildEur: 18,
      currency: 'EGP',
      status: 'ACTIVE',
      isBestSeller: true,
      includedAr: JSON.stringify([
        'ركوب الخيل في الصحراء لمدة ساعة',
        'ركوب الخيل على البحر لمدة ساعة',
        'انتقالات من وإلى الفندق',
        'مدرب مرافق',
        'خوذة ومعدات أمان',
        'مياه معدنية'
      ]),
      includedEn: JSON.stringify([
        '1 hour desert horse riding',
        '1 hour beach/sea horse riding',
        'Hotel transfers',
        'Professional instructor',
        'Safety helmet & equipment',
        'Bottled water'
      ]),
      excludedAr: JSON.stringify([
        'المصروفات الشخصية',
        'أي خدمات إضافية غير مذكورة',
        'أي صور أو خدمات إضافية مدفوعة بشكل منفصل'
      ]),
      excludedEn: JSON.stringify([
        'Personal expenses',
        'Any extra unmentioned services',
        'Photos/videos if charged separately'
      ])
    }
  })

  console.log('✅ Horse Riding Trip & Package Created Successfully!')

  // -------------------------------------------------------------
  // TRIP 2: WATER SPORTS
  // -------------------------------------------------------------
  const waterSportsTrip = await prisma.trip.upsert({
    where: { slug: 'water-sports-hurghada' },
    update: {
      titleAr: 'الألعاب المائية',
      titleEn: 'Water Sports in Hurghada - Parasailing, Banana Boat & Quattro',
      titleDe: 'Wassersport in Hurghada - Parasailing, Bananenboot & Quattro',
      location: 'Hurghada, Egypt',
      duration: '15 Minutes',
      pickupTime: '10:00 AM',
      meetingPoint: 'Water Sports Center - Hurghada',
      maxSeats: 30,
      priceAdultEgp: 600,
      priceAdultUsd: 12,
      priceAdultEur: 11,
      priceChildEgp: 600,
      priceChildUsd: 12,
      priceChildEur: 11,
      rating: 4.95,
      reviewCount: 62,
      isFeatured: true,
      isPublished: true,
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      descAr: 'استمتع بمجموعة من أشهر الألعاب المائية في الغردقة والبحر الأحمر، واختر النشاط المناسب لك من بين الباراشوت المائي، البنانا بوت، والكوادر/اللعبة المائية الموضحة في الباقات. تجربة مليئة بالحماس والمرح ومناسبة للعائلات والأصدقاء.',
      descEn: 'Enjoy an exciting selection of water sports in Hurghada and the Red Sea. Choose your favorite activity from parasailing, banana boat and quattro water activities, and enjoy a fun-filled experience with family and friends.',
      descDe: 'Genießen Sie eine aufregende Auswahl an Wassersportarten in Hurghada und dem Roten Meer. Wählen Sie Ihre Lieblingsaktivität aus Parasailing, Bananenboot und Quattro.',
      seoTitle: 'Water Sports in Hurghada | Parasailing & Banana Boat | Mr.Raw Travel',
      seoDescription: 'Enjoy exciting water sports in Hurghada including parasailing, banana boat and quattro activities on the Red Sea. Choose your favorite experience and book with Mr.Raw Travel.',
      includedAr: JSON.stringify([
        'النشاط المائي المختار',
        'معدات الأمان وسترة النجاة',
        'طاقم العمل المتخصص',
        'القارب ومعدات القرر اللازمة للنشاط'
      ]),
      includedEn: JSON.stringify([
        'Selected water sport activity',
        'Safety equipment/life jacket',
        'Professional activity crew',
        'Boat/towing equipment required for the selected activity'
      ]),
      includedDe: JSON.stringify([
        'Ausgewählte Wassersportaktivität',
        'Sicherheitsausrüstung/Schwimmweste',
        'Professionelle Crew',
        'Boot- und Schleppausrüstung'
      ]),
      excludedAr: JSON.stringify([
        'الانتقالات من الفندق ما لم تكن محددة أو مرتبة بشكل منفصل',
        'المصروفات الشخصية',
        'الصور والفيديوهات إذا كانت مدفوعة بشكل منفصل',
        'أي نشاط لم يتم تحديده في الحجز'
      ]),
      excludedEn: JSON.stringify([
        'Hotel transportation unless specifically selected or arranged',
        'Personal expenses',
        'Photos/videos if charged separately',
        'Any activity not selected in the booking'
      ]),
      excludedDe: JSON.stringify([
        'Hoteltransfer außer separat vereinbart',
        'Persönliche Ausgaben',
        'Fotos/Videos'
      ]),
      itineraryAr: JSON.stringify([
        { time: '10:00 AM', title: 'الوصول لمركز الألعاب المائية', desc: 'التجمع واستلام سترات النجاة والتعليمات' },
        { time: '10:15 AM', title: 'بدء النشاط المائي المختار', desc: 'استمتاع بركوب الباراشوت أو البنانا أو الكوادرا' }
      ]),
      itineraryEn: JSON.stringify([
        { time: '10:00 AM', titleEn: 'Arrival at Water Sports Center', descEn: 'Arrival, safety vest pickup and briefing' },
        { time: '10:15 AM', titleEn: 'Start Selected Water Activity', descEn: 'Enjoy Parasailing, Banana Boat, or Quattro' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '10:00 AM', titleDe: 'Ankunft am Wassersportzentrum', descDe: 'Ankunft und Einweisung' },
        { time: '10:15 AM', titleDe: 'Start der Aktivität', descDe: 'Parasailing, Bananenboot oder Quattro' }
      ])
    },
    create: {
      slug: 'water-sports-hurghada',
      categoryId: waterSportsCat.id,
      titleAr: 'الألعاب المائية',
      titleEn: 'Water Sports in Hurghada - Parasailing, Banana Boat & Quattro',
      titleDe: 'Wassersport in Hurghada - Parasailing, Bananenboot & Quattro',
      location: 'Hurghada, Egypt',
      duration: '15 Minutes',
      pickupTime: '10:00 AM',
      meetingPoint: 'Water Sports Center - Hurghada',
      maxSeats: 30,
      priceAdultEgp: 600,
      priceAdultUsd: 12,
      priceAdultEur: 11,
      priceChildEgp: 600,
      priceChildUsd: 12,
      priceChildEur: 11,
      rating: 4.95,
      reviewCount: 62,
      isFeatured: true,
      isPublished: true,
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      descAr: 'استمتع بمجموعة من أشهر الألعاب المائية في الغردقة والبحر الأحمر، واختر النشاط المناسب لك من بين الباراشوت المائي، البنانا بوت، والكوادر/اللعبة المائية الموضحة في الباقات. تجربة مليئة بالحماس والمرح ومناسبة للعائلات والأصدقاء.',
      descEn: 'Enjoy an exciting selection of water sports in Hurghada and the Red Sea. Choose your favorite activity from parasailing, banana boat and quattro water activities, and enjoy a fun-filled experience with family and friends.',
      descDe: 'Genießen Sie eine aufregende Auswahl an Wassersportarten in Hurghada und dem Roten Meer. Wählen Sie Ihre Lieblingsaktivität aus Parasailing, Bananenboot und Quattro.',
      seoTitle: 'Water Sports in Hurghada | Parasailing & Banana Boat | Mr.Raw Travel',
      seoDescription: 'Enjoy exciting water sports in Hurghada including parasailing, banana boat and quattro activities on the Red Sea. Choose your favorite experience and book with Mr.Raw Travel.',
      includedAr: JSON.stringify([
        'النشاط المائي المختار',
        'معدات الأمان وسترة النجاة',
        'طاقم العمل المتخصص',
        'القارب ومعدات القرر اللازمة للنشاط'
      ]),
      includedEn: JSON.stringify([
        'Selected water sport activity',
        'Safety equipment/life jacket',
        'Professional activity crew',
        'Boat/towing equipment required for the selected activity'
      ]),
      includedDe: JSON.stringify([
        'Ausgewählte Wassersportaktivität',
        'Sicherheitsausrüstung/Schwimmweste',
        'Professionelle Crew',
        'Boot- und Schleppausrüstung'
      ]),
      excludedAr: JSON.stringify([
        'الانتقالات من الفندق ما لم تكن محددة أو مرتبة بشكل منفصل',
        'المصروفات الشخصية',
        'الصور والفيديوهات إذا كانت مدفوعة بشكل منفصل',
        'أي نشاط لم يتم تحديده في الحجز'
      ]),
      excludedEn: JSON.stringify([
        'Hotel transportation unless specifically selected or arranged',
        'Personal expenses',
        'Photos/videos if charged separately',
        'Any activity not selected in the booking'
      ]),
      excludedDe: JSON.stringify([
        'Hoteltransfer außer separat vereinbart',
        'Persönliche Ausgaben',
        'Fotos/Videos'
      ]),
      itineraryAr: JSON.stringify([
        { time: '10:00 AM', title: 'الوصول لمركز الألعاب المائية', desc: 'التجمع واستلام سترات النجاة والتعليمات' },
        { time: '10:15 AM', title: 'بدء النشاط المائي المختار', desc: 'استمتاع بركوب الباراشوت أو البنانا أو الكوادرا' }
      ]),
      itineraryEn: JSON.stringify([
        { time: '10:00 AM', titleEn: 'Arrival at Water Sports Center', descEn: 'Arrival, safety vest pickup and briefing' },
        { time: '10:15 AM', titleEn: 'Start Selected Water Activity', descEn: 'Enjoy Parasailing, Banana Boat, or Quattro' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '10:00 AM', titleDe: 'Ankunft am Wassersportzentrum', descDe: 'Ankunft und Einweisung' },
        { time: '10:15 AM', titleDe: 'Start der Aktivität', descDe: 'Parasailing, Bananenboot oder Quattro' }
      ])
    }
  })

  // Upsert 4 Packages for Water Sports
  await prisma.tripPackage.deleteMany({
    where: { tripId: waterSportsTrip.id }
  })

  // Package 1: Parasailing Single
  await prisma.tripPackage.create({
    data: {
      tripId: waterSportsTrip.id,
      nameAr: 'باراسيلينج - فرد',
      nameEn: 'Parasailing - Single',
      nameDe: 'Parasailing - Einzel',
      descAr: 'استمتع بتجربة الباراسيلينج فوق مياه البحر الأحمر واستمتع بإطلالة مميزة من الأعلى أثناء التحليق بالمظلة خلف القارب.',
      descEn: 'Enjoy an exciting parasailing experience above the Red Sea and admire the coastline from above while safely towed by a boat.',
      descDe: 'Genießen Sie ein aufregendes Parasailing-Erlebnis über dem Roten Meer und bewundern Sie die Küste von oben.',
      duration: '15 Minutes',
      startTime: '10:00 AM',
      endTime: '10:15 AM',
      capacity: 10,
      badge: 'BEST VALUE',
      priceAdultEgp: 700,
      priceAdultUsd: 14,
      priceAdultEur: 13,
      priceChildEgp: 700,
      priceChildUsd: 14,
      priceChildEur: 13,
      currency: 'EGP',
      status: 'ACTIVE',
      includedAr: JSON.stringify(['Parasailing activity', 'Safety equipment', 'Life jacket', 'Professional crew', 'Boat towing']),
      includedEn: JSON.stringify(['Parasailing activity', 'Safety equipment', 'Life jacket', 'Professional crew', 'Boat towing']),
      excludedAr: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately']),
      excludedEn: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately'])
    }
  })

  // Package 2: Parasailing Double
  await prisma.tripPackage.create({
    data: {
      tripId: waterSportsTrip.id,
      nameAr: 'باراسيلينج - زوجي',
      nameEn: 'Parasailing - Double',
      nameDe: 'Parasailing - Doppel',
      descAr: 'تجربة باراسيلينج لشخصين معًا فوق البحر الأحمر، مناسبة للأصدقاء أو الأزواج الذين يريدون الاستمتاع بالتجربة معًا.',
      descEn: 'A parasailing experience for two people flying together above the Red Sea, perfect for couples and friends.',
      descDe: 'Ein Parasailing-Erlebnis für zwei Personen, die gemeinsam über dem Roten Meer fliegen, perfekt für Paare und Freunde.',
      duration: '15 Minutes',
      startTime: '10:00 AM',
      endTime: '10:15 AM',
      capacity: 10,
      badge: 'BEST VALUE',
      priceAdultEgp: 1300,
      priceAdultUsd: 26,
      priceAdultEur: 24,
      priceChildEgp: 1300,
      priceChildUsd: 26,
      priceChildEur: 24,
      currency: 'EGP',
      status: 'ACTIVE',
      includedAr: JSON.stringify(['Parasailing for two people', 'Safety equipment', 'Life jackets', 'Professional crew', 'Boat towing']),
      includedEn: JSON.stringify(['Parasailing for two people', 'Safety equipment', 'Life jackets', 'Professional crew', 'Boat towing']),
      excludedAr: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately']),
      excludedEn: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately'])
    }
  })

  // Package 3: Banana Boat
  await prisma.tripPackage.create({
    data: {
      tripId: waterSportsTrip.id,
      nameAr: 'البنانا بوت',
      nameEn: 'Banana Boat',
      nameDe: 'Bananenboot',
      descAr: 'استمتع برحلة مليئة بالمرح والحماس على البنانا بوت فوق مياه البحر الأحمر، تجربة مناسبة للعائلات والأصدقاء.',
      descEn: 'Enjoy an exciting banana boat ride across the Red Sea, perfect for families and groups of friends looking for fun and adventure.',
      descDe: 'Genießen Sie eine aufregende Fahrt mit dem Bananenboot über das Rote Meer, perfekt für Familien und Freunde.',
      duration: '15 Minutes',
      startTime: '10:00 AM',
      endTime: '10:15 AM',
      capacity: 30,
      badge: 'BEST VALUE',
      priceAdultEgp: 600,
      priceAdultUsd: 12,
      priceAdultEur: 11,
      priceChildEgp: 600,
      priceChildUsd: 12,
      priceChildEur: 11,
      currency: 'EGP',
      status: 'ACTIVE',
      includedAr: JSON.stringify(['Banana Boat ride', 'Life jacket', 'Safety equipment', 'Professional crew', 'Towing boat']),
      includedEn: JSON.stringify(['Banana Boat ride', 'Life jacket', 'Safety equipment', 'Professional crew', 'Towing boat']),
      excludedAr: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately']),
      excludedEn: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately'])
    }
  })

  // Package 4: Quattro Water Ride
  await prisma.tripPackage.create({
    data: {
      tripId: waterSportsTrip.id,
      nameAr: 'الكوادرا',
      nameEn: 'Quattro Water Ride',
      nameDe: 'Quattro Wasserfahrt',
      descAr: 'استمتع بتجربة الكوادرا فوق مياه البحر الأحمر، نشاط مائي مليء بالمرح والحماس ومناسب للأصدقاء والعائلات.',
      descEn: 'Enjoy an exciting Quattro water ride on the Red Sea, a fun and energetic activity suitable for friends and families.',
      descDe: 'Genießen Sie eine aufregende Quattro-Wasserfahrt auf dem Roten Meer, eine unterhaltsame Aktivität für Freunde und Familien.',
      duration: '15 Minutes',
      startTime: '10:00 AM',
      endTime: '10:15 AM',
      capacity: 30,
      badge: 'BEST VALUE',
      priceAdultEgp: 600,
      priceAdultUsd: 12,
      priceAdultEur: 11,
      priceChildEgp: 600,
      priceChildUsd: 12,
      priceChildEur: 11,
      currency: 'EGP',
      status: 'ACTIVE',
      includedAr: JSON.stringify(['Quattro water ride', 'Life jacket', 'Safety equipment', 'Professional crew', 'Towing boat']),
      includedEn: JSON.stringify(['Quattro water ride', 'Life jacket', 'Safety equipment', 'Professional crew', 'Towing boat']),
      excludedAr: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately']),
      excludedEn: JSON.stringify(['Transportation unless arranged separately', 'Personal expenses', 'Photos/videos if charged separately'])
    }
  })

  console.log('✅ Water Sports Trip & 4 Packages Created Successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
