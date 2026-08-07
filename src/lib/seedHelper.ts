import { prisma } from '@/lib/db'

export async function runSeedScript() {
  // 0. Clean old records if requested or upsert cleanly
  await prisma.tripPackage.deleteMany({})
  await prisma.tripAddon.deleteMany({})

  // 1. Upsert Categories
  const safariCat = await prisma.tripCategory.upsert({
    where: { slug: 'desert-safari' },
    update: {
      nameEn: 'Desert Safari Trips',
      nameAr: 'رحلات السفاري',
      nameDe: 'Wüstensafari-Ausflüge',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      icon: 'Compass'
    },
    create: {
      slug: 'desert-safari',
      nameEn: 'Desert Safari Trips',
      nameAr: 'رحلات السفاري',
      nameDe: 'Wüstensafari-Ausflüge',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      icon: 'Compass'
    }
  })

  const waterSportsCat = await prisma.tripCategory.upsert({
    where: { slug: 'water-sports' },
    update: {
      nameEn: 'Water Sports',
      nameAr: 'الألعاب المائية',
      nameDe: 'Wassersport',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      icon: 'Waves'
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

  const speedBoatCat = await prisma.tripCategory.upsert({
    where: { slug: 'private-speedboat' },
    update: {
      nameEn: 'Private Speedboat',
      nameAr: 'برايبات اسبيد بوت',
      nameDe: 'Privates Schnellboot',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Zap'
    },
    create: {
      slug: 'private-speedboat',
      nameEn: 'Private Speedboat',
      nameAr: 'برايبات اسبيد بوت',
      nameDe: 'Privates Schnellboot',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Zap'
    }
  })

  const horseCat = await prisma.tripCategory.upsert({
    where: { slug: 'horse-riding' },
    update: {
      nameEn: 'Horse Riding Excursions',
      nameAr: 'رحلة ركوب الخيل',
      nameDe: 'Pferde-Reitausflüge',
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Horse'
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

  const seaCat = await prisma.tripCategory.upsert({
    where: { slug: 'orange-bay-yacht' },
    update: {
      nameEn: 'Orange Bay Island & Yacht',
      nameAr: 'رحلة يخت وسنوركلينج أورانج باي',
      nameDe: 'Orange Bay VIP Yacht',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      icon: 'Anchor'
    },
    create: {
      slug: 'orange-bay-yacht',
      nameEn: 'Orange Bay Island & Yacht',
      nameAr: 'رحلة يخت وسنوركلينج أورانج باي',
      nameDe: 'Orange Bay VIP Yacht',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      icon: 'Anchor'
    }
  })

  // -------------------------------------------------------------
  // TRIP 1: DESERT SAFARI (رحلات السفاري - 3 برامج)
  // -------------------------------------------------------------
  const safariTrip = await prisma.trip.upsert({
    where: { slug: 'desert-safari-programs' },
    update: {
      priceAdultEgp: 800,
      priceAdultUsd: 17,
      priceAdultEur: 16,
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'
    },
    create: {
      slug: 'desert-safari-programs',
      categoryId: safariCat.id,
      titleEn: 'Desert Safari Excursions (3 Programs Available)',
      titleAr: 'رحلات السفاري (3 برامج تناسب الجميع)',
      titleDe: 'Wüstensafari-Programme (3 Pakete verfügbar)',
      descEn: 'Experience the magic of Hurghada desert with Quad Biking, Dune Buggy, Camel Riding, Bedouin Show, and BBQ Dinner across VIP, Family, and Super Safari packages.',
      descAr: 'استمتع بمغامرة الصحراء في الغردقة مع برامج تناسب الجميع: قيادة الكواد باي، الباجي، ركوب الجمل، الحفلة والعشاء البدوي.',
      descDe: 'Erleben Sie die Magie der Wüste mit Quad, Buggy, Kamelreiten und Beduinen-Show.',
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 17,
      priceAdultEur: 16,
      priceAdultEgp: 800,
      priceChildUsd: 10,
      priceChildEur: 9,
      priceChildEgp: 450,
      duration: '4-7 Hours',
      pickupTime: '09:00 AM / 11:50 AM / 03:00 PM',
      location: 'Hurghada Desert & Bedouin Village',
      rating: 4.98,
      reviewCount: 310,
      isFeatured: true,
      isPublished: true,
      includedEn: JSON.stringify(['Hotel Transfer', 'Quad Bike Driving', 'Dune Buggy Ride', 'Bedouin Camp & Tea', 'Bedouin Show & Dinner']),
      includedAr: JSON.stringify(['المواصلات من وإلى الفندق', 'قيادة الكواد باي', 'جولة الباجي', 'القرية البدوية والشاي البدوي', 'الحفلة البدوية والعشاء']),
      includedDe: JSON.stringify(['Hoteltransfer', 'Quad-Fahrt', 'Buggy-Fahrt', 'Beduinen-Dorf']),
      excludedEn: 'Scarf & Goggles',
      excludedAr: 'الشال والنظارة',
      excludedDe: 'Schal & Brille',
      itineraryEn: 'Quad biking + Dune buggy + Jeep safari + Camel ride + Bedouin show & dinner',
      itineraryAr: 'كواد باي + باجي + جيب كار + ركوب جمل + حفلة وعشاء بدوي',
      itineraryDe: 'Quad + Buggy + Kamel + Beduinenshow'
    }
  })

  // Safari Packages
  await prisma.tripPackage.create({
    data: {
      id: 'pkg-safari-vip',
      tripId: safariTrip.id,
      nameEn: 'VIP Safari (09:00 AM - 01:00 PM)',
      nameAr: 'VIP Safari (من 09:00 إلى 01:00 مساءً - 1200 ج)',
      nameDe: 'VIP Safari (09:00 - 13:00 Uhr - 1200 EGP)',
      descEn: 'Quad bike riding for 1 full hour (25 km to Bedouin village), camel riding, Bedouin tea, and 1 full hour quad riding return (25 km back).',
      descAr: 'قيادة الكواد ساعة مسافة 25 كيلو ذهاب إلى البدوية + ركوب جمل + شاي بدوي + قيادة الكواد ساعة مسافة 25 كيلو عودة من البدوية.',
      priceAdultUsd: 25, priceChildUsd: 15, priceAdultEur: 23, priceChildEur: 14, priceAdultEgp: 1200, priceChildEgp: 650, currency: 'EGP',
      duration: '4 Hours (09:00 - 13:00)', startTime: '09:00 AM', endTime: '01:00 PM', capacity: 20, badge: 'VIP SPEED ADVENTURE', status: 'ACTIVE'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-safari-family',
      tripId: safariTrip.id,
      nameEn: 'Family Safari (03:00 PM - 07:00 PM)',
      nameAr: 'فاميلي سفاري (من 03:00 إلى 07:00 مساءً - 800 ج)',
      nameDe: 'Familien-Safari (15:00 - 19:00 Uhr - 800 EGP)',
      descEn: 'Includes hotel transfer, short quad bike ride, short buggy ride, Bedouin show, and BBQ dinner.',
      descAr: 'شاملة المواصلات + جولة قصيرة بالكواد + جولة قصيرة بالباجي + حفلة بدوية + عشاء بدوي.',
      priceAdultUsd: 17, priceChildUsd: 10, priceAdultEur: 16, priceChildEur: 9, priceAdultEgp: 800, priceChildEgp: 450, currency: 'EGP',
      duration: '4 Hours (15:00 - 19:00)', startTime: '03:00 PM', endTime: '07:00 PM', capacity: 30, badge: 'GREAT FOR FAMILIES', status: 'ACTIVE'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-safari-super',
      tripId: safariTrip.id,
      nameEn: 'Super Safari (11:50 AM - 07:00 PM)',
      nameAr: 'سوبر سفاري (من 11:50 إلى 07:00 مساءً - 900 ج)',
      nameDe: 'Super Safari (11:50 - 19:00 Uhr - 900 EGP)',
      descEn: 'Includes hotel transfer, short quad bike ride, short buggy ride, Jeep car transfer to Bedouin camp (with driver), 10 mins camel ride, Bedouin tea, BBQ dinner, Oriental show, and Jeep return transfer.',
      descAr: 'شاملة المواصلات + جولة قصيرة بالكواد + جولة قصيرة بالباجي + ذهاب بالجيب كار للبدوية (يوجد سائق) + 10 دقائق ركوب جمل + شاي بدوي + عشاء بدوي + حفلة بدوية + عودة بالجيب كار من البدوية.',
      priceAdultUsd: 19, priceChildUsd: 11, priceAdultEur: 18, priceChildEur: 10, priceAdultEgp: 900, priceChildEgp: 500, currency: 'EGP',
      duration: '7 Hours (11:50 - 19:00)', startTime: '11:50 AM', endTime: '07:00 PM', capacity: 40, badge: 'MOST POPULAR FULL SAFARI', status: 'ACTIVE'
    }
  })

  // -------------------------------------------------------------
  // TRIP 2: WATER SPORTS (الألعاب المائية - 4 باقات)
  // -------------------------------------------------------------
  const waterSportsTrip = await prisma.trip.upsert({
    where: { slug: 'water-sports-adventures' },
    update: {
      priceAdultEgp: 600,
      priceAdultUsd: 13,
      priceAdultEur: 12,
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
    },
    create: {
      slug: 'water-sports-adventures',
      categoryId: waterSportsCat.id,
      titleEn: 'Water Sports Adventures (Parasailing, Banana & Quadra)',
      titleAr: 'الألعاب المائية (متعة وإثارة لا تُنسى)',
      titleDe: 'Wassersport-Abenteuer (Parasailing, Bananenboot & Sofa)',
      descEn: 'Choose your thrill: Parasailing Single or Double, Banana Boat, or Quadra Sofa ride on crystal clear Red Sea waters.',
      descAr: 'اختر متعتك المائية: الباراشوت سينجل ودابل، البنانا بوت، والكوادرا سوفا بأعلى معايير السلامة والأمان.',
      descDe: 'Erleben Sie Parasailing, Bananenboot und Sofa-Fahrt.',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 13, priceAdultEur: 12, priceAdultEgp: 600, priceChildUsd: 13, priceChildEur: 12, priceChildEgp: 600,
      duration: '15 Mins', pickupTime: '10:00 AM', location: 'Hurghada Water Sports Marina', rating: 4.96, reviewCount: 180, isFeatured: true, isPublished: true,
      includedEn: JSON.stringify(['Life Jackets Provided', 'High Safety Standards', 'Professional Captain & Crew']),
      includedAr: JSON.stringify(['سترة نجاة متوفرة لكل فرد', 'أعلى معايير السلامة والأمان', 'كابتن وطاقم عمل محترف']),
      includedDe: JSON.stringify(['Schwimmwesten', 'Sicherheitsstandards', 'Erfahrener Kapitän']),
      excludedEn: 'Photo Album', excludedAr: 'ألبوم الصور', excludedDe: 'Fotos',
      itineraryEn: 'Parasailing / Banana Boat / Quadra Sofa water ride', itineraryAr: 'جولة الألعاب المائية المختارة', itineraryDe: 'Wassersport'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-parasailing-single-real', tripId: waterSportsTrip.id, nameEn: 'Parasailing Single', nameAr: 'الباراشوت سينجل (فرد واحد - 700 ج)', nameDe: 'Parasailing Einzel (700 EGP)',
      descEn: 'Single Parasailing flight (15 minutes duration).', descAr: 'طيران الباراشوت سينجل لشخص واحد لمدة 15 دقيقة، أعلى معايير السلامة والأمان.',
      priceAdultUsd: 15, priceChildUsd: 15, priceAdultEur: 14, priceChildEur: 14, priceAdultEgp: 700, priceChildEgp: 700, currency: 'EGP', duration: '15 Mins', capacity: 1, badge: 'TOP FLYING THRILL', status: 'ACTIVE'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-parasailing-double-real', tripId: waterSportsTrip.id, nameEn: 'Parasailing Double', nameAr: 'الباراشوت دابل (شخصين - 1300 ج)', nameDe: 'Parasailing Doppel (1300 EGP)',
      descEn: 'Double Parasailing flight for 2 persons together.', descAr: 'طيران الباراشوت دابل لشخصين معاً لمدة 15 دقيقة (مجموع الوزن أقل من 150 كيلو).',
      priceAdultUsd: 27, priceChildUsd: 27, priceAdultEur: 25, priceChildEur: 25, priceAdultEgp: 1300, priceChildEgp: 1300, currency: 'EGP', duration: '15 Mins', capacity: 2, badge: 'BEST FOR COUPLES', status: 'ACTIVE'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-banana-boat-real', tripId: waterSportsTrip.id, nameEn: 'Banana Boat Ride', nameAr: 'البنانا بوت (600 ج للفرد)', nameDe: 'Bananenboot (600 EGP)',
      descEn: 'Thrilling speed banana boat ride over waves.', descAr: 'جولة البنانا بوت السريعة، متعة وإثارة لا تُنسى مناسبة للعائلات والأصدقاء.',
      priceAdultUsd: 13, priceChildUsd: 13, priceAdultEur: 12, priceChildEur: 12, priceAdultEgp: 600, priceChildEgp: 600, currency: 'EGP', duration: '15 Mins', capacity: 6, badge: 'FAMILY FAVORITE', status: 'ACTIVE'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-quadra-sofa-real', tripId: waterSportsTrip.id, nameEn: 'Quadra / Sofa Water Ride', nameAr: 'الكوادرا (600 ج للفرد)', nameDe: 'Quadra Sofa-Fahrt (600 EGP)',
      descEn: 'Exciting Quadra Sofa water tube ride.', descAr: 'ركوب الكوادرا سوفا المائية المثيرة، مغامرة مائية ممتازة ومناسبة للجميع.',
      priceAdultUsd: 13, priceChildUsd: 13, priceAdultEur: 12, priceChildEur: 12, priceAdultEgp: 600, priceChildEgp: 600, currency: 'EGP', duration: '15 Mins', capacity: 4, badge: 'ACTION TUBE RIDE', status: 'ACTIVE'
    }
  })

  // -------------------------------------------------------------
  // TRIP 3: PRIVATE SPEEDBOAT (برايبات اسبيد بوت - 6500 ج)
  // -------------------------------------------------------------
  const speedBoatTrip = await prisma.trip.upsert({
    where: { slug: 'private-speed-boat' },
    update: {
      priceAdultEgp: 6500,
      priceAdultUsd: 135,
      priceAdultEur: 125,
      coverImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80'
    },
    create: {
      slug: 'private-speed-boat',
      categoryId: speedBoatCat.id,
      titleEn: 'Private Speedboat Charter (4 Hours - Up to 7 Guests)',
      titleAr: 'برايبات اسبيد بوت (رحلة خاصة 4 ساعات - 7 أفراد)',
      titleDe: 'Privates Schnellboot (4 Stunden - bis zu 7 Personen)',
      descEn: 'Exclusive 4-hour private speedboat excursion visiting Dolphin House, White Island Sandbar, Coral Reef Snorkeling, with fresh fruit platter & refreshments included.',
      descAr: 'رحلة خاصة لا تُنسى مدتها 4 ساعات تتسع حتى 7 أفراد، تشمل وقفة اسنوركلينج، السباحة في دولفين هاوس، وقفة على شاطئ الوايت ايلند، وشاملة الفاكهة والمشروبات.',
      descDe: 'Exklusive private Schnellbootfahrt (4 Std., max. 7 Personen) zum Delfinhaus und White Island.',
      coverImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 135, priceAdultEur: 125, priceAdultEgp: 6500, priceChildUsd: 0, priceChildEur: 0, priceChildEgp: 0,
      duration: '4 Hours', pickupTime: '09:00 AM', location: 'Hurghada Red Sea', rating: 4.99, reviewCount: 95, isFeatured: true, isPublished: true,
      includedEn: JSON.stringify(['Private Speedboat Charter', 'Snorkeling Coral Reef Stop', 'Dolphin House Swimming', 'White Island Sandbar Stop', 'Fresh Fruit Platter']),
      includedAr: JSON.stringify(['رحلة خاصة اسبيد بوت (تتسع حتى 7 أفراد)', 'وقفة اسنوركلينج بالشعاب المرجانية', 'دولفين هاوس للسباحة مع الدلافين', 'وقفة على شاطئ الوايت ايلند', 'فاكهة ومشروبات طازجة']),
      includedDe: JSON.stringify(['Privates Schnellboot', 'Schnorcheln', 'Delfinhaus', 'White Island', 'Früchte']),
      excludedEn: 'Personal Expenses', excludedAr: 'المصاريف الشخصية', excludedDe: 'Persönliche Ausgaben',
      itineraryEn: 'Dolphin House + White Island Sandbar + Coral Reef Snorkeling', itineraryAr: 'دولفين هاوس + شاطئ الوايت ايلند + وقفة سنوركلينج', itineraryDe: 'Delfinhaus + White Island'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-speedboat-charter-real', tripId: speedBoatTrip.id, nameEn: 'Private Speedboat Charter', nameAr: 'باقة اسبيد بوت خاص (4 ساعات - حتى 7 أفراد - 6500 ج)', nameDe: 'Privates Schnellboot (6500 EGP)',
      descEn: 'Private speedboat charter for up to 7 guests.', descAr: 'رحلة خاصة بالكامل اسبيد بوت تتسع حتى 7 أفراد شاملة وقفة اسنوركلينج ودولفين هاوس ووايت ايلند وفاكهة ومشروبات.',
      priceAdultUsd: 135, priceChildUsd: 0, priceAdultEur: 125, priceChildEur: 0, priceAdultEgp: 6500, priceChildEgp: 0, currency: 'EGP', duration: '4 Hours', capacity: 7, badge: 'EXCLUSIVE PRIVATE CHARTER', status: 'ACTIVE'
    }
  })

  // -------------------------------------------------------------
  // TRIP 4: HORSE RIDING (رحلة ركوب الخيل - 1000 ج)
  // -------------------------------------------------------------
  const horseTrip = await prisma.trip.upsert({
    where: { slug: 'horse-riding-desert-sea' },
    update: {
      priceAdultEgp: 1000,
      priceAdultUsd: 21,
      priceAdultEur: 20,
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80'
    },
    create: {
      slug: 'horse-riding-desert-sea',
      categoryId: horseCat.id,
      titleEn: 'Horse Riding Adventure: Desert & Sea (2 Hours)',
      titleAr: 'رحلة ركوب الخيل - مغامرة بين الصحراء والبحر (ساعتين)',
      titleDe: 'Pferde-Reitausflug: Wüste & Meer (2 Stunden)',
      descEn: '2-hour complete adventure: 1 hour horse riding in desert & mountains + 1 hour horse swimming in Red Sea waters.',
      descAr: 'رحلة ساعتين كاملة: ساعة ركوب في الصحراء بين الجبال الطبيعية + ساعة ركوب داخل مياه البحر.',
      descDe: '2-Stunden-Pferdeabenteuer: 1 Std. Wüste + 1 Std. Reiten im Meer.',
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 21, priceAdultEur: 20, priceAdultEgp: 1000, priceChildUsd: 12, priceChildEur: 11, priceChildEgp: 600,
      duration: '2 Hours', pickupTime: '08:00 AM', location: 'Hurghada Stables', rating: 4.98, reviewCount: 140, isFeatured: true, isPublished: true,
      includedEn: JSON.stringify(['Hotel Pickup & Return Transfers', '1 Hour Desert Riding', '1 Hour Sea Swimming Riding', 'Trained Horses']),
      includedAr: JSON.stringify(['تنقلات من وإلى الفندق', 'ساعة ركوب في الصحراء وسط الجبال', 'ساعة ركوب في البحر تجربة فريدة', 'خيل مدربة وجاهزة']),
      includedDe: JSON.stringify(['Hoteltransfer', 'Pferde', 'Wasser']),
      excludedEn: 'Personal Expenses', excludedAr: 'المصاريف الشخصية', excludedDe: 'Persönliche Ausgaben',
      itineraryEn: '1 Hour Desert Riding + 1 Hour Sea Swimming Riding', itineraryAr: 'ساعة ركوب في الصحراء + ساعة ركوب داخل مياه البحر', itineraryDe: '1 Std Wüste + 1 Std Meer'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-horse-riding-real', tripId: horseTrip.id, nameEn: 'Horse Riding (Desert & Sea)', nameAr: 'باقة ركوب الخيل (صحراء + بحر - 1000 ج)', nameDe: 'Pferdereiten (1000 EGP)',
      descEn: '2-hour complete horse riding adventure.', descAr: 'رحلة ساعتين كاملة: ساعة ركوب بالصحراء + ساعة ركوب بالبحر.',
      priceAdultUsd: 21, priceChildUsd: 12, priceAdultEur: 20, priceChildEur: 11, priceAdultEgp: 1000, priceChildEgp: 600, currency: 'EGP', duration: '2 Hours', capacity: 15, badge: 'POPULAR RIDING EXCURSION', status: 'ACTIVE'
    }
  })

  // -------------------------------------------------------------
  // TRIP 5: ORANGE BAY YACHT (أورانج باي - 1200 ج)
  // -------------------------------------------------------------
  const orangeBayTrip = await prisma.trip.upsert({
    where: { slug: 'orange-bay-yacht-snorkeling' },
    update: {
      priceAdultEgp: 1200,
      priceAdultUsd: 25,
      priceAdultEur: 23,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },
    create: {
      slug: 'orange-bay-yacht-snorkeling',
      categoryId: seaCat.id,
      titleEn: 'Orange Bay Island Yacht & Snorkeling (8 Hours)',
      titleAr: 'رحلة يخت وسنوركلينج أورانج باي (8 ساعات - 1200 ج)',
      titleDe: 'Orange Bay VIP Yacht (8 Stunden - 1200 EGP)',
      descEn: '8-hour luxury yacht cruise including guided snorkeling stops, stay on Orange Bay island beach, seafood lunch & drinks.',
      descAr: 'رحلة 8 ساعات (من 08:00 إلى 16:00): رحلة يخت فاخرة ومريحة، وقفتين سنوركلينج، وقفة على جزيرة أورانج باي، الغداء طازج ولذيذ، والمشروبات باردة ومنعشة.',
      descDe: '8-Stunden VIP Yachtausflug nach Orange Bay.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 25, priceAdultEur: 23, priceAdultEgp: 1200, priceChildUsd: 14, priceChildEur: 13, priceChildEgp: 700,
      duration: '8 Hours (08:00 - 16:00)', pickupTime: '08:00 AM', location: 'Orange Bay Island, Hurghada', rating: 4.99, reviewCount: 420, isFeatured: true, isPublished: true,
      includedEn: JSON.stringify(['2 Coral Reef Snorkeling Stops', 'Orange Bay Island Beach Stay', 'Fresh Seafood Lunch Buffet']),
      includedAr: JSON.stringify(['وقفتين سنوركلينج في أماكن مختلفة', 'رحلة يخت فاخرة ومريحة', 'وقفة على جزيرة أورانج باي الاستوائية', 'الغداء طازج ولذيذ بوفيه مفتوح']),
      includedDe: JSON.stringify(['Orange Bay Insel', '2 Schnorchelstopps', 'Mittagsbuffet']),
      excludedEn: 'Personal Purchases', excludedAr: 'المشتروات الشخصية بالجزيرة', excludedDe: 'Persönliche Käufe',
      itineraryEn: '2 Snorkeling Stops + Orange Bay Island Beach + Seafood Buffet Lunch', itineraryAr: 'وقفتين سنوركلينج + شاطئ جزيرة أورنج باي + غداء بوفيه فاخر', itineraryDe: '2 Schnorchelstopps + Orange Bay'
    }
  })

  await prisma.tripPackage.create({
    data: {
      id: 'pkg-orangebay-real', tripId: orangeBayTrip.id, nameEn: 'Orange Bay Yacht & Lunch', nameAr: 'رحلة يخت وسنوركلينج أورانج باي (1200 ج للفرد)', nameDe: 'Orange Bay VIP Paket (1200 EGP)',
      descEn: '8-hour VIP yacht trip to Orange Bay.', descAr: 'رحلة 8 ساعات (من 08:00 إلى 16:00): رحلة يخت فاخرة، وقفتين سنوركلينج، وقفة على الجزيرة، غداء طازج بوفيه مفتوح، ومشروبات باردة.',
      priceAdultUsd: 25, priceChildUsd: 14, priceAdultEur: 23, priceChildEur: 13, priceAdultEgp: 1200, priceChildEgp: 700, currency: 'EGP', duration: '8 Hours', capacity: 40, badge: 'TOP SELLER #1 YACHT', status: 'ACTIVE'
    }
  })

  return { success: true }
}

export async function ensureDefaultTripsAndPackagesExist() {
  try {
    const tripCount = await prisma.trip.count()
    if (tripCount > 0) return

    console.log('[SeedHelper] No trips found in database. Auto-seeding default luxury excursions...')
    await runSeedScript()
  } catch (err) {
    console.error('[SeedHelper] Auto-seeding failed:', err)
  }
}
