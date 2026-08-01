import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // 0. Clean old records if requested or upsert cleanly
    // Clean old packages and trips to guarantee no legacy clutter
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

    // Safari Packages (VIP 1200, Family 800, Super 900)
    await prisma.tripPackage.create({
      data: {
        id: 'pkg-safari-vip',
        tripId: safariTrip.id,
        nameEn: 'VIP Safari (09:00 AM - 01:00 PM)',
        nameAr: 'VIP Safari (من 09:00 إلى 01:00 مساءً - 1200 ج)',
        nameDe: 'VIP Safari (09:00 - 13:00 Uhr - 1200 EGP)',
        descEn: 'Quad bike riding for 1 full hour (25 km to Bedouin village), camel riding, Bedouin tea, and 1 full hour quad riding return (25 km back).',
        descAr: 'قيادة الكواد ساعة مسافة 25 كيلو ذهاب إلى البدوية + ركوب جمل + شاي بدوي + قيادة الكواد ساعة مسافة 25 كيلو عودة من البدوية.',
        priceAdultUsd: 25,
        priceChildUsd: 15,
        priceAdultEur: 23,
        priceChildEur: 14,
        priceAdultEgp: 1200,
        priceChildEgp: 650,
        currency: 'EGP',
        duration: '4 Hours (09:00 - 13:00)',
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        capacity: 20,
        badge: 'VIP SPEED ADVENTURE',
        isBestSeller: false,
        isPopular: true,
        includedEn: JSON.stringify(['1 Hour Quad Bike Driving (25 km to village)', 'Camel Riding Experience', 'Authentic Bedouin Tea', '1 Hour Quad Bike Return (25 km return)']),
        includedAr: JSON.stringify(['قيادة الكواد ساعة (مسافة 25 كيلو ذهاب للبدوية)', 'تجربة ركوب الجمل', 'شاي بدوي أصيل', 'قيادة الكواد ساعة (مسافة 25 كيلو عودة من البدوية)']),
        itinerarySteps: JSON.stringify([
          { time: '09:00 AM', titleEn: 'Quad Bike Departure (25 KM)', titleAr: 'الانطلاق الكواد (25 كم ذهاب)', descEn: 'Drive quads 25 km through desert mountains', descAr: 'قيادة الكواد 25 كيلو وسط الطبيعة والجبال الصحراوية' },
          { time: '10:30 AM', titleEn: 'Bedouin Village & Camel Ride', titleAr: 'الوصول للقرية وركوب الجمل', descEn: 'Arrive at village, camel riding, and Bedouin tea', descAr: 'استراحة بالقرية البدوية وتجربة ركوب الجمل والشاي' },
          { time: '11:45 AM', titleEn: 'Quad Bike Return (25 KM)', titleAr: 'العودة بالكواد (25 كم عودة)', descEn: 'Drive 25 km back to safari center', descAr: 'قيادة الكواد 25 كيلو عودة إلى مركز السفاري' },
          { time: '01:00 PM', titleEn: 'Hotel Transfer', titleAr: 'العودة للفندق', descEn: 'Transfer back to hotel', descAr: 'التوصيل والعودة للفندق' }
        ])
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
        priceAdultUsd: 17,
        priceChildUsd: 10,
        priceAdultEur: 16,
        priceChildEur: 9,
        priceAdultEgp: 800,
        priceChildEgp: 450,
        currency: 'EGP',
        duration: '4 Hours (15:00 - 19:00)',
        startTime: '03:00 PM',
        endTime: '07:00 PM',
        capacity: 30,
        badge: 'GREAT FOR FAMILIES',
        isBestSeller: true,
        isRecommended: true,
        includedEn: JSON.stringify(['Hotel Transfers Included', 'Short Quad Bike Tour', 'Short Dune Buggy Tour', 'Bedouin Show', 'BBQ Dinner']),
        includedAr: JSON.stringify(['شاملة المواصلات من وإلى الفندق', 'جولة قصيرة بالكواد', 'جولة قصيرة بالباجي', 'حفلة بدوية ممتعة', 'عشاء بدوي فاخر']),
        itinerarySteps: JSON.stringify([
          { time: '03:00 PM', titleEn: 'Hotel Pickup & Safari Center Arrival', titleAr: 'التحرك من الفندق ووصول المركز', descEn: 'Transfer and safety briefing', descAr: 'التوصيل بالباص المكيف والتدريب على القيادة' },
          { time: '03:45 PM', titleEn: 'Quad & Buggy Short Tour', titleAr: 'جولة الكواد والباجي', descEn: 'Exciting quad & buggy rides in desert', descAr: 'جولة ممتعة بالكواد وجولة بالباجي' },
          { time: '05:30 PM', titleEn: 'Bedouin Show & Dinner', titleAr: 'الحفلة والعشاء البدوي', descEn: 'Enjoy oriental show, Tanoura, and dinner', descAr: 'مشاهدة فقرات الحفلة والتنورة وتناول العشاء' },
          { time: '07:00 PM', titleEn: 'Hotel Dropoff', titleAr: 'العودة للفندق', descEn: 'Return transfer to your hotel', descAr: 'التوصيل والعودة للفندق' }
        ])
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
        priceAdultUsd: 19,
        priceChildUsd: 11,
        priceAdultEur: 18,
        priceChildEur: 10,
        priceAdultEgp: 900,
        priceChildEgp: 500,
        currency: 'EGP',
        duration: '7 Hours (11:50 - 19:00)',
        startTime: '11:50 AM',
        endTime: '07:00 PM',
        capacity: 40,
        badge: 'MOST POPULAR FULL SAFARI',
        isBestSeller: true,
        isPopular: true,
        includedEn: JSON.stringify(['Full Hotel Transfers', 'Short Quad Bike Tour', 'Short Dune Buggy Tour', 'Jeep Safari Ride (With Driver)', '10 Mins Camel Ride', 'Bedouin Tea', 'BBQ Dinner & Bedouin Show', 'Jeep Return Transfer']),
        includedAr: JSON.stringify(['شاملة المواصلات من وإلى الفندق', 'جولة قصيرة بالكواد', 'جولة قصيرة بالباجي', 'ذهاب بالجيب كار للبدوية (مع سائق)', '10 دقائق ركوب جمل', 'شاي بدوي أصيل', 'عشاء بدوي فاخر وحفلة بدوية', 'عودة بالجيب كار من البدوية']),
        itinerarySteps: JSON.stringify([
          { time: '11:50 AM', titleEn: 'Hotel Pickup', titleAr: 'التحرك من الفندق', descEn: 'Transfer to desert safari hub', descAr: 'التوصيل من الفندق لمركز السفاري' },
          { time: '01:00 PM', titleEn: 'Quad & Buggy Riding', titleAr: 'قيادة الكواد والباجي', descEn: 'Drive quads and buggies', descAr: 'جولة قصيرة بالكواد والباجي' },
          { time: '02:30 PM', titleEn: 'Jeep Safari to Village', titleAr: 'ركوب الجيب للقرية البدوية', descEn: '4x4 Jeep ride with driver across desert', descAr: 'انطلاق بسيارات الجيب كار نحو عمق الصحراء' },
          { time: '04:00 PM', titleEn: 'Camel Ride & Bedouin Tea', titleAr: 'ركوب الجمل والشاي البدوي', descEn: '10 mins camel ride and herbal tea', descAr: '10 دقائق ركوب جمل والضيافة البدوية' },
          { time: '05:30 PM', titleEn: 'BBQ Dinner & Show', titleAr: 'العشاء والحفلة البدوية', descEn: 'Bedouin show, belly dance, Tanoura & BBQ', descAr: 'تناول العشاء والاستمتاع بفقرات الحفلة' },
          { time: '07:00 PM', titleEn: 'Jeep Return & Dropoff', titleAr: 'العودة بالجيب والتوصيل', descEn: 'Jeep return transfer back to hotel', descAr: 'العودة بالجيب والتوصيل للفندق' }
        ])
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
        priceAdultUsd: 13,
        priceAdultEur: 12,
        priceAdultEgp: 600,
        priceChildUsd: 13,
        priceChildEur: 12,
        priceChildEgp: 600,
        duration: '15 Mins',
        pickupTime: '10:00 AM',
        location: 'Hurghada Water Sports Marina',
        rating: 4.96,
        reviewCount: 180,
        isFeatured: true,
        isPublished: true,
        includedEn: JSON.stringify(['Life Jackets Provided', 'High Safety Standards', 'Professional Captain & Crew', 'Professional Photo Available']),
        includedAr: JSON.stringify(['سترة نجاة متوفرة لكل فرد', 'أعلى معايير السلامة والأمان', 'كابتن وطاقم عمل محترف', 'مواعيد مرنة وتصوير احترافي']),
        includedDe: JSON.stringify(['Schwimmwesten', 'Sicherheitsstandards', 'Erfahrener Kapitän']),
        excludedEn: 'Photo Album',
        excludedAr: 'ألبوم الصور',
        excludedDe: 'Fotos',
        itineraryEn: 'Parasailing / Banana Boat / Quadra Sofa water ride',
        itineraryAr: 'جولة الألعاب المائية المختارة',
        itineraryDe: 'Wassersport'
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-parasailing-single-real',
        tripId: waterSportsTrip.id,
        nameEn: 'Parasailing Single (1 Person)',
        nameAr: 'الباراشوت سينجل (فرد واحد - 700 ج)',
        nameDe: 'Parasailing Einzel (700 EGP)',
        descEn: 'Single Parasailing flight (15 minutes duration). Combined weight under 150 kg.',
        descAr: 'طيران الباراشوت سينجل لشخص واحد لمدة 15 دقيقة، أعلى معايير السلامة والأمان.',
        priceAdultUsd: 15,
        priceChildUsd: 15,
        priceAdultEur: 14,
        priceChildEur: 14,
        priceAdultEgp: 700,
        priceChildEgp: 700,
        currency: 'EGP',
        duration: '15 Mins',
        capacity: 1,
        badge: 'TOP FLYING THRILL',
        includedEn: JSON.stringify(['15 Mins Flying Parasailing', 'Life Jacket', 'High Safety Equipment']),
        includedAr: JSON.stringify(['طيران باراشوت 15 دقيقة سينجل', 'سترة نجاة عالية السلامة', 'أعلى معايير الأمان والمعاينة'])
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-parasailing-double-real',
        tripId: waterSportsTrip.id,
        nameEn: 'Parasailing Double (2 Persons)',
        nameAr: 'الباراشوت دابل (شخصين - 1300 ج)',
        nameDe: 'Parasailing Doppel (1300 EGP)',
        descEn: 'Double Parasailing flight for 2 persons together (15 minutes duration). Combined weight limit under 150 kg.',
        descAr: 'طيران الباراشوت دابل لشخصين معاً لمدة 15 دقيقة (مجموع الوزن أقل من 150 كيلو).',
        priceAdultUsd: 27,
        priceChildUsd: 27,
        priceAdultEur: 25,
        priceChildEur: 25,
        priceAdultEgp: 1300,
        priceChildEgp: 1300,
        currency: 'EGP',
        duration: '15 Mins',
        capacity: 2,
        badge: 'BEST FOR COUPLES',
        includedEn: JSON.stringify(['15 Mins Double Parasailing Flight', '2 Life Jackets', 'Max Combined Weight 150 kg']),
        includedAr: JSON.stringify(['طيران باراشوت دابل 15 دقيقة للشخصين معاً', 'سترتين نجاة', 'مجموع الوزن أقل من 150 كيلو'])
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-banana-boat-real',
        tripId: waterSportsTrip.id,
        nameEn: 'Banana Boat Ride',
        nameAr: 'البنانا بوت (600 ج للفرد)',
        nameDe: 'Bananenboot (600 EGP)',
        descEn: 'Thrilling speed banana boat ride over waves for families and friends.',
        descAr: 'جولة البنانا بوت السريعة، متعة وإثارة لا تُنسى مناسبة للعائلات والأصدقاء.',
        priceAdultUsd: 13,
        priceChildUsd: 13,
        priceAdultEur: 12,
        priceChildEur: 12,
        priceAdultEgp: 600,
        priceChildEgp: 600,
        currency: 'EGP',
        duration: '15 Mins',
        capacity: 6,
        badge: 'FAMILY FAVORITE',
        includedEn: JSON.stringify(['Banana Boat Ride', 'Life Jacket Provided', 'Flexible Timings']),
        includedAr: JSON.stringify(['ركوب البنانا بوت المائية', 'سترة نجاة لكل فرد', 'مواعيد مرنة طوال اليوم'])
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-quadra-sofa-real',
        tripId: waterSportsTrip.id,
        nameEn: 'Quadra / Sofa Water Ride',
        nameAr: 'الكوادرا (600 ج للفرد)',
        nameDe: 'Quadra Sofa-Fahrt (600 EGP)',
        descEn: 'Exciting Quadra Sofa water tube ride for action lovers.',
        descAr: 'ركوب الكوادرا سوفا المائية المثيرة، مغامرة مائية ممتازة ومناسبة للجميع.',
        priceAdultUsd: 13,
        priceChildUsd: 13,
        priceAdultEur: 12,
        priceChildEur: 12,
        priceAdultEgp: 600,
        priceChildEgp: 600,
        currency: 'EGP',
        duration: '15 Mins',
        capacity: 4,
        badge: 'ACTION TUBE RIDE',
        includedEn: JSON.stringify(['Quadra Sofa Water Tube Ride', 'Life Jacket Provided']),
        includedAr: JSON.stringify(['جولة الكوادرا سوفا المائية', 'سترة نجاة متوفرة لكل فرد'])
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
        priceAdultUsd: 135,
        priceAdultEur: 125,
        priceAdultEgp: 6500,
        priceChildUsd: 0,
        priceChildEur: 0,
        priceChildEgp: 0,
        duration: '4 Hours',
        pickupTime: '09:00 AM',
        location: 'Hurghada Red Sea',
        rating: 4.99,
        reviewCount: 95,
        isFeatured: true,
        isPublished: true,
        includedEn: JSON.stringify(['Private Speedboat Charter (7 Persons Max)', 'Snorkeling Coral Reef Stop', 'Dolphin House Swimming', 'White Island Sandbar Stop', 'Fresh Fruit Platter & Cold Drinks', 'Full Snorkeling Equipment & Life Jackets']),
        includedAr: JSON.stringify(['رحلة خاصة اسبيد بوت (تتسع حتى 7 أفراد)', 'وقفة اسنوركلينج بالشعاب المرجانية', 'دولفين هاوس للسباحة مع الدلافين', 'وقفة على شاطئ الوايت ايلند', 'فاكهة ومشروبات طازجة باردة ومنعشة', 'أدوات السنوركلينج وسترات النجاة']),
        includedDe: JSON.stringify(['Privates Schnellboot', 'Schnorcheln', 'Delfinhaus', 'White Island', 'Früchte & Getränke']),
        excludedEn: 'Personal Expenses',
        excludedAr: 'المصاريف الشخصية',
        excludedDe: 'Persönliche Ausgaben',
        itineraryEn: 'Dolphin House + White Island Sandbar + Coral Reef Snorkeling + Fruits & Drinks',
        itineraryAr: 'دولفين هاوس + شاطئ الوايت ايلند + وقفة سنوركلينج + فاكهة ومشروبات',
        itineraryDe: 'Delfinhaus + White Island + Schnorcheln'
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-speedboat-charter-real',
        tripId: speedBoatTrip.id,
        nameEn: 'Private Speedboat (4 Hours - Up to 7 Persons)',
        nameAr: 'باقة اسبيد بوت خاص (4 ساعات - حتى 7 أفراد - 6500 ج)',
        nameDe: 'Privates Schnellboot (4 Std - bis 7 Personen - 6500 EGP)',
        descEn: 'Private speedboat charter for up to 7 guests. Includes Dolphin House, White Island, Coral Snorkeling, Fruit Platter & Refreshments.',
        descAr: 'رحلة خاصة بالكامل اسبيد بوت تتسع حتى 7 أفراد شاملة وقفة اسنوركلينج ودولفين هاوس ووايت ايلند وفاكهة ومشروبات.',
        priceAdultUsd: 135,
        priceChildUsd: 0,
        priceAdultEur: 125,
        priceChildEur: 0,
        priceAdultEgp: 6500,
        priceChildEgp: 0,
        currency: 'EGP',
        duration: '4 Hours',
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        capacity: 7,
        badge: 'EXCLUSIVE PRIVATE CHARTER',
        isBestSeller: true,
        isRecommended: true,
        includedEn: JSON.stringify(['Private Speedboat Charter (7 Persons Max)', 'Snorkeling Coral Reef Stop', 'Dolphin House Swimming', 'White Island Sandbar Stop', 'Fresh Fruit Platter & Cold Drinks', 'Full Snorkeling Equipment & Life Jackets']),
        includedAr: JSON.stringify(['رحلة خاصة اسبيد بوت (تتسع حتى 7 أفراد)', 'وقفة اسنوركلينج بالشعاب المرجانية', 'دولفين هاوس للسباحة مع الدلافين', 'وقفة على شاطئ الوايت ايلند', 'فاكهة ومشروبات طازجة باردة ومنعشة', 'أدوات السنوركلينج وسترات النجاة']),
        itinerarySteps: JSON.stringify([
          { time: '09:00 AM', titleEn: 'Speedboat Marina Departure', titleAr: 'التحرك من المارينا بالاسبيد بوت', descEn: 'Cruise fast towards Dolphin House', descAr: 'الانطلاق السريع نحو منطقة الدلافين' },
          { time: '10:00 AM', titleEn: 'Dolphin House Swimming', titleAr: 'السباحة في دولفين هاوس', descEn: 'Swim and watch dolphins in open sea', descAr: 'مشاهدة والسباحة مع الدلافين في البحر المفتوح' },
          { time: '11:15 AM', titleEn: 'White Island Sandbar Stop', titleAr: 'وقفة شاطئ الوايت ايلند', descEn: 'Relax on pure white sands', descAr: 'الاسترخاء على الرمال البيضاء الناعمة وسط المياه' },
          { time: '12:15 PM', titleEn: 'Snorkeling & Tropical Fruits', titleAr: 'وقفة سنوركلينج وتناول الفواكه', descEn: 'Snorkel reefs and enjoy fresh fruit platter', descAr: 'سنوركلينج وتناول طبق الفواكه والمشروبات المنعشة' },
          { time: '01:00 PM', titleEn: 'Return to Marina', titleAr: 'العودة للمارينا', descEn: 'Return to Hurghada Marina', descAr: 'الوصول والعودة إلى المارينا' }
        ])
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
        descEn: '2-hour complete adventure: 1 hour horse riding in desert & mountains + 1 hour horse swimming in Red Sea waters. Includes hotel transfer, trained horses, safety gear, guide & mineral water.',
        descAr: 'رحلة ساعتين كاملة: ساعة ركوب في الصحراء بين الجبال الطبيعية + ساعة ركوب داخل مياه البحر. شاملة تنقلات من وإلى الفندق، خيل مدربة ومجهزة، معدات أمان، مدرب مرافق، ومياه معدنية.',
        descDe: '2-Stunden-Pferdeabenteuer: 1 Std. Wüste + 1 Std. Reiten im Meer inkl. Transfer und Ausrüstung.',
        coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
        priceAdultUsd: 21,
        priceAdultEur: 20,
        priceAdultEgp: 1000,
        priceChildUsd: 12,
        priceChildEur: 11,
        priceChildEgp: 600,
        duration: '2 Hours',
        pickupTime: '08:00 AM',
        location: 'Desert & Beach Stables, Hurghada',
        rating: 4.98,
        reviewCount: 140,
        isFeatured: true,
        isPublished: true,
        includedEn: JSON.stringify(['Hotel Pickup & Return Transfers', '1 Hour Desert Riding', '1 Hour Sea Swimming Riding', 'Trained & Equipped Horses', 'Safety Helmets & Gear', 'Professional Accompanied Guide/Instructor', 'Complimentary Mineral Water']),
        includedAr: JSON.stringify(['تنقلات من وإلى الفندق', 'ساعة ركوب في الصحراء وسط الجبال', 'ساعة ركوب في البحر تجربة فريدة', 'خيل مدربة وجاهزة', 'معدات أمان وخوذة سلامة', 'مدرب مرافق معك طوال الرحلة', 'مياه معدنية طوال الرحلة']),
        includedDe: JSON.stringify(['Hoteltransfer', 'Pferde', 'Sicherheitsausrüstung', 'Reitlehrer', 'Wasser']),
        excludedEn: 'Personal Expenses',
        excludedAr: 'المصاريف الشخصية',
        excludedDe: 'Persönliche Ausgaben',
        itineraryEn: '1 Hour Desert Riding + 1 Hour Sea Swimming Riding',
        itineraryAr: 'ساعة ركوب في الصحراء + ساعة ركوب داخل مياه البحر',
        itineraryDe: '1 Std Wüste + 1 Std Meer'
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-horse-riding-real',
        tripId: horseTrip.id,
        nameEn: 'Horse Riding (Desert & Sea 2 Hours)',
        nameAr: 'باقة ركوب الخيل (صحراء + بحر - 1000 ج)',
        nameDe: 'Pferdereiten (Wüste & Meer - 1000 EGP)',
        descEn: '2-hour complete horse riding adventure (1 hour desert + 1 hour sea swimming). Includes transfers, trained horses, safety gear, instructor & mineral water.',
        descAr: 'رحلة ساعتين كاملة: ساعة ركوب بالصحراء + ساعة ركوب بالبحر، يشمل خيول مدربة ومدرب ومعدات السلامة ومياه وتنقلات الفندق.',
        priceAdultUsd: 21,
        priceChildUsd: 12,
        priceAdultEur: 20,
        priceChildEur: 11,
        priceAdultEgp: 1000,
        priceChildEgp: 600,
        currency: 'EGP',
        duration: '2 Hours',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        capacity: 15,
        badge: 'POPULAR RIDING EXCURSION',
        isBestSeller: true,
        isRecommended: true,
        includedEn: JSON.stringify(['Hotel Pickup & Return Transfers', '1 Hour Desert Riding', '1 Hour Sea Swimming Riding', 'Trained & Equipped Horses', 'Safety Helmets & Gear', 'Professional Accompanied Guide/Instructor', 'Complimentary Mineral Water']),
        includedAr: JSON.stringify(['تنقلات من وإلى الفندق', 'ساعة ركوب في الصحراء وسط الجبال', 'ساعة ركوب في البحر تجربة فريدة', 'خيل مدربة وجاهزة', 'معدات أمان وخوذة سلامة', 'مدرب مرافق معك طوال الرحلة', 'مياه معدنية طوال الرحلة']),
        itinerarySteps: JSON.stringify([
          { time: '08:00 AM', titleEn: 'Hotel Pickup', titleAr: 'التوصيل من الفندق', descEn: 'Transfer to stables by AC bus', descAr: 'التوصيل بالباص المكيف لإصطبل الخيل' },
          { time: '08:30 AM', titleEn: '1 Hour Desert Riding', titleAr: 'ساعة ركوب في الصحراء', descEn: 'Ride along desert mountains and dunes', descAr: 'استمتع بركوب الخيل وسط الطبيعة الصحراوية والجبال' },
          { time: '09:30 AM', titleEn: '1 Hour Sea Riding', titleAr: 'ساعة ركوب في البحر', descEn: 'Unique swimming experience inside sea waters with horses', descAr: 'تجربة فريدة داخل مياه البحر مع الخيل' },
          { time: '10:30 AM', titleEn: 'Return Transfer', titleAr: 'العودة للفندق', descEn: 'Dropoff back at your hotel', descAr: 'التوصيل والعودة إلى فندقك' }
        ])
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
        descEn: '8-hour luxury yacht cruise (08:00 AM to 04:00 PM). Includes 2 guided snorkeling stops, stay on Orange Bay island beach, fresh seafood lunch buffet, unlimited cold & hot drinks, snorkeling gear, hotel transfers & crew service.',
        descAr: 'رحلة 8 ساعات (من 08:00 إلى 16:00): رحلة يخت فاخرة ومريحة، وقفتين سنوركلينج في أماكن مختلفة، وقفة على جزيرة أورانج باي، الغداء طازج ولذيذ، المشروبات باردة ومنعشة، أدوات السنوركلينج، تنقلات من وإلى الفندق، وفريق محترف لخدمتكم.',
        descDe: '8-Stunden VIP Yachtausflug nach Orange Bay mit 2 Schnorchelstopps, Meeresfrüchte-Buffet und Getränken.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        priceAdultUsd: 25,
        priceAdultEur: 23,
        priceAdultEgp: 1200,
        priceChildUsd: 14,
        priceChildEur: 13,
        priceChildEgp: 700,
        duration: '8 Hours (08:00 - 16:00)',
        pickupTime: '08:00 AM',
        location: 'Orange Bay Island, Hurghada',
        rating: 4.99,
        reviewCount: 420,
        isFeatured: true,
        isPublished: true,
        includedEn: JSON.stringify(['2 Coral Reef Snorkeling Stops', 'Orange Bay Island Beach Stay', 'Luxury & Comfortable Yacht Cruise', 'Fresh Seafood Lunch Buffet', 'Cold & Hot Unlimited Beverages', 'Full Snorkeling Gear (Masks & Fins)', 'Air-Conditioned Hotel Transfers', 'Professional Crew Service']),
        includedAr: JSON.stringify(['وقفتين سنوركلينج في أماكن مختلفة', 'رحلة يخت فاخرة ومريحة', 'وقفة على جزيرة أورانج باي الاستوائية', 'الغداء طازج ولذيذ بوفيه مفتوح', 'المشروبات باردة ومنعشة طوال اليوم', 'أدوات ومعدات السنوركلينج الكاملة', 'تنقلات من وإلى الفندق', 'فريق محترف لخدمتكم طوال اليوم']),
        includedDe: JSON.stringify(['Orange Bay Insel', '2 Schnorchelstopps', 'Mittagsbuffet', 'Getränke', 'Hoteltransfer']),
        excludedEn: 'Personal Island Purchases',
        excludedAr: 'المشتروات الشخصية بالجزيرة',
        excludedDe: 'Persönliche Käufe',
        itineraryEn: '2 Snorkeling Stops + Orange Bay Island Beach + Seafood Buffet Lunch + Drinks + Transfers',
        itineraryAr: 'وقفتين سنوركلينج + شاطئ جزيرة أورنج باي + غداء بوفيه فاخر + مشروبات + تنقلات',
        itineraryDe: '2 Schnorchelstopps + Orange Bay + Buffet'
      }
    })

    await prisma.tripPackage.create({
      data: {
        id: 'pkg-orangebay-real',
        tripId: orangeBayTrip.id,
        nameEn: 'Orange Bay Yacht & Lunch Cruise',
        nameAr: 'رحلة يخت وسنوركلينج أورانج باي (1200 ج للفرد)',
        nameDe: 'Orange Bay VIP Paket (1200 EGP)',
        descEn: '8-hour VIP yacht trip. Includes 2 snorkeling stops, Orange Bay island stay, open seafood lunch buffet, unlimited drinks, snorkeling gear & hotel transfers.',
        descAr: 'رحلة 8 ساعات (من 08:00 إلى 16:00): رحلة يخت فاخرة، وقفتين سنوركلينج، وقفة على الجزيرة، غداء طازج ولذيذ بوفيه مفتوح، مشروبات باردة، أدوات سنوركلينج وتنقلات.',
        priceAdultUsd: 25,
        priceChildUsd: 14,
        priceAdultEur: 23,
        priceChildEur: 13,
        priceAdultEgp: 1200,
        priceChildEgp: 700,
        currency: 'EGP',
        duration: '8 Hours (08:00 - 16:00)',
        startTime: '08:00 AM',
        endTime: '04:00 PM',
        capacity: 40,
        badge: 'TOP SELLER #1 YACHT',
        isBestSeller: true,
        isRecommended: true,
        includedEn: JSON.stringify(['2 Coral Reef Snorkeling Stops', 'Orange Bay Island Beach Stay', 'Luxury & Comfortable Yacht Cruise', 'Fresh Seafood Lunch Buffet', 'Cold & Hot Unlimited Beverages', 'Full Snorkeling Gear (Masks & Fins)', 'Air-Conditioned Hotel Transfers', 'Professional Crew Service']),
        includedAr: JSON.stringify(['وقفتين سنوركلينج في أماكن مختلفة', 'رحلة يخت فاخرة ومريحة', 'وقفة على جزيرة أورانج باي الاستوائية', 'الغداء طازج ولذيذ بوفيه مفتوح', 'المشروبات باردة ومنعشة طوال اليوم', 'أدوات ومعدات السنوركلينج الكاملة', 'تنقلات من وإلى الفندق', 'فريق محترف لخدمتكم طوال اليوم']),
        itinerarySteps: JSON.stringify([
          { time: '08:00 AM', titleEn: 'Hotel Pickup & Transfers', titleAr: 'تنقلات الفندق والوصول لليخت', descEn: 'Pickup by AC bus to marina', descAr: 'التوصيل من فندقك بالباص المكيف للمارينا' },
          { time: '09:00 AM', titleEn: 'Yacht Cruise Departure', titleAr: 'التحرك باليخت الفاخر', descEn: 'Cruise across turquoise Red Sea waters', descAr: 'التحرك باليخت الفاخر وسط المياه الفيروزية' },
          { time: '10:30 AM', titleEn: 'First Snorkeling Stop', titleAr: 'الوقفة الأولى للسنوركلينج', descEn: 'Snorkel pristine coral reefs', descAr: 'وقفة غطس سنوركلينج عند أروع الشعاب المرجانية' },
          { time: '12:00 PM', titleEn: 'Orange Bay Island Beach', titleAr: 'وقفة جزيرة أورانج باي', descEn: 'Relax on tropical sandy island', descAr: 'النزول والاسترخاء على شاطئ جزيرة أورانج باي' },
          { time: '02:00 PM', titleEn: 'Open Seafood Buffet Lunch', titleAr: 'غداء بوفيه مفتوح على اليخت', descEn: 'Enjoy freshly cooked seafood and drinks', descAr: 'تناول وجبة الغداء الساخنة والمأكولات البحرية' },
          { time: '03:00 PM', titleEn: 'Second Snorkeling Stop', titleAr: 'الوقفة الثانية للسنوركلينج', descEn: 'Second snorkeling location', descAr: 'وقفة سنوركلينج ثانية في منطقة مرجانية مختلفة' },
          { time: '04:00 PM', titleEn: 'Return Transfer to Hotel', titleAr: 'العودة والتوصيل للفندق', descEn: 'Dock at marina and dropoff back at hotel', descAr: 'الوصول والتوصيل إلى الفندق' }
        ])
      }
    })

    // -------------------------------------------------------------
    // SEED ADDONS & CUSTOM PACKAGE BUILDER ITEMS
    // -------------------------------------------------------------
    const addonsData = [
      { nameEn: 'Bedouin BBQ Dinner', nameAr: 'عشاء بدوي فاخر', category: 'SAFARI', priceEgp: 250, priceUsd: 5, priceEur: 5, icon: 'Utensils' },
      { nameEn: '10 Mins Camel Ride', nameAr: '10 دقائق ركوب جمل', category: 'SAFARI', priceEgp: 150, priceUsd: 3, priceEur: 3, icon: 'Compass' },
      { nameEn: 'Short Buggy Ride', nameAr: 'جولة بالباجي الصحراوي', category: 'SAFARI', priceEgp: 300, priceUsd: 6, priceEur: 6, icon: 'Zap' },
      { nameEn: 'Quad Bike Driving Tour', nameAr: 'قيادة الكواد باي', category: 'SAFARI', priceEgp: 350, priceUsd: 7, priceEur: 7, icon: 'Shield' },
      { nameEn: 'Jeep Safari 4x4 Transfer', nameAr: 'سيارة جيب خاصة للبدوية', category: 'SAFARI', priceEgp: 300, priceUsd: 6, priceEur: 6, icon: 'Truck' },
      { nameEn: 'Bedouin Show & Tanoura', nameAr: 'عرض الحفلة البدوية والرقص الشرقي', category: 'SAFARI', priceEgp: 200, priceUsd: 4, priceEur: 4, icon: 'Sparkles' },
      { nameEn: 'Parasailing Flight (15 Mins)', nameAr: 'طيران الباراشوت سينجل (15 دقيقة)', category: 'WATER_SPORTS', priceEgp: 700, priceUsd: 15, priceEur: 14, icon: 'Cloud' },
      { nameEn: 'Banana Boat Ride', nameAr: 'ركوب البنانا بوت المائية', category: 'WATER_SPORTS', priceEgp: 600, priceUsd: 13, priceEur: 12, icon: 'Waves' },
      { nameEn: 'Quadra / Sofa Tube Ride', nameAr: 'ركوب الكوادرا سوفا المائية', category: 'WATER_SPORTS', priceEgp: 600, priceUsd: 13, priceEur: 12, icon: 'Smile' },
      { nameEn: 'Extra Coral Reef Snorkeling Stop', nameAr: 'وقفة سنوركلينج إضافية بالشعاب المرجانية', category: 'YACHT', priceEgp: 300, priceUsd: 6, priceEur: 6, icon: 'Anchor' },
      { nameEn: 'Fresh Tropical Fruit Platter & Drinks', nameAr: 'طبق فاكهة ومشروبات استوائية باردة', category: 'YACHT', priceEgp: 200, priceUsd: 4, priceEur: 4, icon: 'Coffee' },
      { nameEn: 'Professional Photo & Video Album', nameAr: 'تصوير احترافي وألبوم صور سي دي', category: 'GENERAL', priceEgp: 400, priceUsd: 8, priceEur: 8, icon: 'Camera' },
      { nameEn: 'White Island Sandbar Beach Visit', nameAr: 'وقفة على شاطئ الوايت ايلند', category: 'YACHT', priceEgp: 500, priceUsd: 10, priceEur: 10, icon: 'Sun' },
      { nameEn: 'Sea Horse Riding Swimming (1 Hour)', nameAr: 'ساعة ركوب خيل في مياه البحر', category: 'HORSE', priceEgp: 500, priceUsd: 10, priceEur: 10, icon: 'Horse' },
      { nameEn: 'Desert Horse Riding Dunes (1 Hour)', nameAr: 'ساعة ركوب خيل في الصحراء', category: 'HORSE', priceEgp: 500, priceUsd: 10, priceEur: 10, icon: 'Mountain' },
    ]

    for (const add of addonsData) {
      await prisma.tripAddon.create({
        data: {
          nameEn: add.nameEn,
          nameAr: add.nameAr,
          nameDe: add.nameEn,
          category: add.category,
          priceEgp: add.priceEgp,
          priceUsd: add.priceUsd,
          priceEur: add.priceEur,
          icon: add.icon,
          isCustomable: true,
          isAddon: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Real Mr.Raw Travel packages & Addons successfully seeded into database!',
      tripsSeeded: 5,
      addonsSeeded: addonsData.length
    })

  } catch (error: any) {
    console.error('Error seeding real packages:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
