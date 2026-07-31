import { prisma } from '../src/lib/db'

async function seedRealPackages() {
  console.log('Seeding real Mr.Raw Travel flyer packages...')

  // 1. Ensure Categories exist
  const seaCat = await prisma.tripCategory.upsert({
    where: { slug: 'sea-trips' },
    update: {},
    create: {
      nameEn: 'Sea & Island Trips',
      nameAr: 'رحلات البحر والجزيرة',
      nameDe: 'Meeres- & Inselausflüge',
      slug: 'sea-trips',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      icon: 'Anchor'
    }
  })

  const safariCat = await prisma.tripCategory.upsert({
    where: { slug: 'desert-safari' },
    update: {},
    create: {
      nameEn: 'Desert & Horse Riding',
      nameAr: 'سفاري وركوب الخيل',
      nameDe: 'Wüsten- & Pferdeausflüge',
      slug: 'desert-safari',
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Compass'
    }
  })

  const waterSportsCat = await prisma.tripCategory.upsert({
    where: { slug: 'water-sports' },
    update: {},
    create: {
      nameEn: 'Water Sports & Speedboats',
      nameAr: 'الألعاب المائية والاسبيد بوت',
      nameDe: 'Wassersport & Schnellboote',
      slug: 'water-sports',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      icon: 'Waves'
    }
  })

  // 2. Real Trip 1: Horse Riding Adventure (1000 EGP)
  const horseTrip = await prisma.trip.upsert({
    where: { slug: 'horse-riding-desert-sea' },
    update: {
      priceAdultEgp: 1000,
      priceAdultUsd: 21,
      priceAdultEur: 20
    },
    create: {
      slug: 'horse-riding-desert-sea',
      categoryId: safariCat.id,
      titleEn: 'Horse Riding Adventure: Desert & Sea (2 Hours)',
      titleAr: 'رحلة ركوب الخيل - مغامرة بين الصحراء والبحر (ساعتين)',
      titleDe: 'Pferdeausflug: Wüste & Meer (2 Stunden)',
      descEn: 'Experience a unique 2-hour horse riding adventure along golden desert dunes and swimming inside crystal clear Red Sea waters.',
      descAr: 'استمتع بركوب الخيل وسط الطبيعة الصحراوية والجبال والمناظر الخلابة، وتجربة فريدة للنزول بالخيل داخل مياه البحر.',
      descDe: 'Erleben Sie ein einzigartiges 2-Stunden-Pferdeabenteuer in der Wüste und im Meer.',
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 21,
      priceAdultEur: 20,
      priceAdultEgp: 1000,
      priceChildUsd: 12,
      priceChildEur: 11,
      priceChildEgp: 600,
      duration: '2 Hours',
      pickupTime: '08:00 AM',
      location: 'Desert & Red Sea Beach, Hurghada',
      rating: 4.98,
      reviewCount: 84,
      isFeatured: true,
      isPublished: true,
      includedEn: JSON.stringify(['Hotel Pickup & Return Transfers', 'Trained & Equipped Horses', 'Safety Helmets & Gear', 'Professional Accompanied Guide/Instructor', 'Complimentary Mineral Water']),
      includedAr: JSON.stringify(['تنقلات من وإلى الفندق', 'خيل مدربة وجاهزة', 'معدات أمان وخوذة سلامة', 'مدرب مرافق محترف', 'مياه معدنية طوال الرحلة']),
      includedDe: JSON.stringify(['Hoteltransfer', 'Pferde', 'Sicherheitsausrüstung', 'Reitlehrer', 'Wasser']),
      excludedEn: 'Personal Expenses',
      excludedAr: 'المصاريف الشخصية',
      excludedDe: 'Persönliche Ausgaben',
      itineraryEn: '1 Hour Desert Riding + 1 Hour Sea Swimming with Horses',
      itineraryAr: 'ساعة ركوب في الصحراء + ساعة ركوب داخل مياه البحر',
      itineraryDe: '1 Std Wüste + 1 Std Meer'
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-horse-1' },
    update: {
      priceAdultEgp: 1000,
      priceAdultUsd: 21,
      priceAdultEur: 20
    },
    create: {
      id: 'pkg-horse-1',
      tripId: horseTrip.id,
      nameEn: 'Horse Riding (Desert & Sea)',
      nameAr: 'باقة ركوب الخيل (صحراء + بحر - 1000 ج)',
      nameDe: 'Pferdereiten (Wüste & Meer)',
      descEn: 'Includes 1 hour desert riding, 1 hour sea swimming with horses, all safety equipment, instructor, mineral water, and hotel pickup.',
      descAr: 'برنامج ساعتين كاملة: ساعة ركوب بالصحراء + ساعة ركوب بالبحر، يشمل خيول مدربة ومدرب ومعدات السلامة ومياه وتنقلات الفندق.',
      descDe: 'Inklusive 1 Std. Wüstenritt, 1 Std. Meeresritt, Ausrüstung und Hoteltransfer.',
      priceAdultUsd: 21,
      priceChildUsd: 12,
      priceAdultEur: 20,
      priceChildEur: 11,
      priceAdultEgp: 1000,
      priceChildEgp: 600,
      priceAdultGbp: 18,
      priceChildGbp: 10,
      currency: 'EGP',
      duration: '2 Hours',
      startTime: '08:00 AM',
      endTime: '10:00 AM',
      capacity: 15,
      badge: 'POPULAR ADVENTURE',
      isBestSeller: true,
      includedEn: JSON.stringify(['Hotel Pickup & Return Transfers', 'Trained & Equipped Horses', 'Safety Helmets & Gear', 'Professional Accompanied Guide/Instructor', 'Complimentary Mineral Water']),
      includedAr: JSON.stringify(['تنقلات من وإلى الفندق', 'خيل مدربة وجاهزة', 'معدات أمان وخوذة سلامة', 'مدرب مرافق محترف', 'مياه معدنية طوال الرحلة']),
      itinerarySteps: JSON.stringify([
        { time: '08:00 AM', titleEn: 'Hotel Pickup', titleAr: 'التوصيل من الفندق', descEn: 'Transfer to stable in air-conditioned bus', descAr: 'التوصيل بالباص المكيف لإصطبل الخيل' },
        { time: '08:30 AM', titleEn: '1 Hour Desert Riding', titleAr: 'ساعة ركوب في الصحراء', descEn: 'Ride along desert mountains and dunes', descAr: 'استمتع بركوب الخيل وسط الطبيعة الصحراوية والجبال' },
        { time: '09:30 AM', titleEn: '1 Hour Sea Riding', titleAr: 'ساعة ركوب في البحر', descEn: 'Unique swimming experience inside sea waters with horses', descAr: 'تجربة فريدة داخل مياه البحر مع الخيل' },
        { time: '10:30 AM', titleEn: 'Return Transfer', titleAr: 'العودة للفندق', descEn: 'Dropoff back at your hotel', descAr: 'التوصيل والعودة إلى فندقك' }
      ])
    }
  })

  // 3. Real Trip 2: Private Speedboat Charter (6500 EGP)
  const speedBoatTrip = await prisma.trip.upsert({
    where: { slug: 'private-speed-boat-charter' },
    update: {
      priceAdultEgp: 6500,
      priceAdultUsd: 135,
      priceAdultEur: 125
    },
    create: {
      slug: 'private-speed-boat-charter',
      categoryId: waterSportsCat.id,
      titleEn: 'Private Speedboat Charter (4 Hours - Up to 7 Guests)',
      titleAr: 'برايت اسبيد بوت - رحلة خاصة لا تُنسى (4 ساعات - 7 أفراد)',
      titleDe: 'Privates Schnellboot (4 Stunden - bis zu 7 Personen)',
      descEn: 'Exclusive private speedboat excursion visiting Dolphin House, White Island Sandbar, snorkeling at coral reefs with fresh fruits and drinks.',
      descAr: 'رحلة خاصة لا تُنسى تشمل وقفة اسنوركلينج بالشعاب المرجانية، زيارة دولفين هاوس، وقفة على الوايت ايلند، وفاكهة ومشروبات طازجة.',
      descDe: 'Exklusive private Schnellbootfahrt zum Delfinhaus und White Island Sandbar mit Früchten und Getränken.',
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
      reviewCount: 62,
      isFeatured: true,
      isPublished: true,
      includedEn: JSON.stringify(['Private Speedboat Charter (7 Guests Max)', 'Snorkeling Coral Reef Stop', 'Dolphin House Swimming Visit', 'White Island Sandbar Stop', 'Fresh Fruit Platter & Cold Juices', 'Snorkeling Equipment & Life Jackets']),
      includedAr: JSON.stringify(['رحلة خاصة بالكامل اسبيد بوت (حتى 7 أفراد)', 'وقفة اسنوركلينج بالشعاب المرجانية', 'زيارة دولفين هاوس لسباحة الدلافين', 'وقفة على شاطئ الوايت ايلند', 'طبق فاكهة طازجة ومشروبات باردة ومنعشة', 'عدسات وزعانف وسترات نجاة السنوركلينج']),
      includedDe: JSON.stringify(['Privatboot', 'Schnorcheln', 'Delfinhaus', 'White Island', 'Früchte & Getränke']),
      excludedEn: 'Gratuities',
      excludedAr: 'الإكراميات',
      excludedDe: 'Trinkgelder',
      itineraryEn: 'Dolphin House + White Island Sandbar + Snorkeling + Fruits & Drinks',
      itineraryAr: 'دولفين هاوس + شاطئ الوايت ايلند + وقفة سنوركلينج + فاكهة ومشروبات',
      itineraryDe: 'Delfinhaus + White Island + Schnorcheln'
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-speedboat-1' },
    update: {
      priceAdultEgp: 6500,
      priceAdultUsd: 135,
      priceAdultEur: 125
    },
    create: {
      id: 'pkg-speedboat-1',
      tripId: speedBoatTrip.id,
      nameEn: 'Private Speedboat (4 Hours - Up to 7 Persons)',
      nameAr: 'باقة اسبيد بوت خاص (4 ساعات - حتى 7 أفراد - 6500 ج)',
      nameDe: 'Privates Schnellboot (4 Std - bis 7 Personen)',
      descEn: 'Entire private speedboat charter for up to 7 guests. Includes Dolphin House, White Island, Snorkeling, Fruits & Refreshments.',
      descAr: 'إيجار اسبيد بوت خاص بالكامل لـ 7 أفراد شامل وقفة اسنوركلينج ودولفين هاوس ووايت ايلند وفاكهة ومشروبات.',
      priceAdultUsd: 135,
      priceChildUsd: 0,
      priceAdultEur: 125,
      priceChildEur: 0,
      priceAdultEgp: 6500,
      priceChildEgp: 0,
      priceAdultGbp: 110,
      priceChildGbp: 0,
      currency: 'EGP',
      duration: '4 Hours',
      startTime: '09:00 AM',
      endTime: '01:00 PM',
      capacity: 7,
      badge: 'EXCLUSIVE PRIVATE CHARTER',
      isBestSeller: true,
      includedEn: JSON.stringify(['Private Speedboat Charter (7 Guests Max)', 'Snorkeling Coral Reef Stop', 'Dolphin House Swimming Visit', 'White Island Sandbar Stop', 'Fresh Fruit Platter & Cold Juices', 'Snorkeling Equipment & Life Jackets']),
      includedAr: JSON.stringify(['رحلة خاصة بالكامل اسبيد بوت (حتى 7 أفراد)', 'وقفة اسنوركلينج بالشعاب المرجانية', 'زيارة دولفين هاوس لسباحة الدلافين', 'وقفة على شاطئ الوايت ايلند', 'طبق فاكهة طازجة ومشروبات باردة ومنعشة', 'عدسات وزعانف وسترات نجاة السنوركلينج']),
      itinerarySteps: JSON.stringify([
        { time: '09:00 AM', titleEn: 'Marina Departure', titleAr: 'التحرك من المارينا بالاسبيد بوت', descEn: 'Speeding towards Dolphin House', descAr: 'الانطلاق السريع بنشاط وحيوية نحو منطقة الدلافين' },
        { time: '10:00 AM', titleEn: 'Dolphin House Swimming', titleAr: 'السباحة في دولفين هاوس', descEn: 'Swim and watch wild dolphins in open sea', descAr: 'مشاهدة والسباحة مع الدلافين في مياه البحر المفتوح' },
        { time: '11:15 AM', titleEn: 'White Island Sandbar Relaxation', titleAr: 'وقفة شاطئ الوايت ايلند', descEn: 'Relax on pure white sandbar', descAr: 'النزول والاسترخاء على الرمال البيضاء الناعمة وسط المياه' },
        { time: '12:15 PM', titleEn: 'Snorkeling & Fresh Fruits', titleAr: 'وقفة سنوركلينج وفاكهة طازجة', descEn: 'Snorkel pristine reefs and enjoy juice & fruits', descAr: 'غطس سنوركلينج وتناول الفواكه والمشروبات المنعشة' },
        { time: '01:00 PM', titleEn: 'Return to Marina', titleAr: 'العودة للمارينا', descEn: 'Cruise back to Hurghada Marina', descAr: 'الوصول والعودة إلى المارينا' }
      ])
    }
  })

  // 4. Real Trip 3: Water Sports (Parasailing 700/1300, Banana 600, Sofa 600)
  const waterSportsTrip = await prisma.trip.upsert({
    where: { slug: 'hurghada-water-sports-fun' },
    update: {},
    create: {
      slug: 'hurghada-water-sports-fun',
      categoryId: waterSportsCat.id,
      titleEn: 'Water Sports Fun: Parasailing, Banana Boat & Sofa Ride',
      titleAr: 'رحلة الألعاب المائية - باراشوت، بنانا بوت، وكوادرا سوفا',
      titleDe: 'Wassersport: Parasailing, Bananenboot & Sofa-Fahrt',
      descEn: 'Enjoy high-flying Parasailing (Single or Double), high-speed Banana Boat, and Quadra Sofa ride in Hurghada.',
      descAr: 'متعة وإثارة لا تُنسى بالألعاب المائية: طيران الباراشوت (سينجل ودابل)، البنانا بوت السريعة، وركوب الكوادرا سوفا.',
      descDe: 'Genießen Sie Parasailing, Bananenboot und Sofa-Fahrten.',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 15,
      priceAdultEur: 14,
      priceAdultEgp: 600,
      priceChildUsd: 15,
      priceChildEur: 14,
      priceChildEgp: 600,
      duration: '15-30 Mins',
      pickupTime: '10:00 AM',
      location: 'Hurghada Coast',
      rating: 4.95,
      reviewCount: 120,
      isFeatured: true,
      isPublished: true,
      includedEn: JSON.stringify(['Life Jackets', 'Safety Equipment', 'Professional Captain']),
      includedAr: JSON.stringify(['سترات النجاة لكل فرد', 'معدات أمان عالية الجودة', 'كابتن متخصص']),
      includedDe: JSON.stringify(['Schwimmwesten', 'Sicherheitsausrüstung']),
      excludedEn: 'Photo Album',
      excludedAr: 'ألبوم الصور الفوتوغرافية',
      excludedDe: 'Fotos',
      itineraryEn: 'Parasailing / Banana / Sofa ride on water',
      itineraryAr: 'جولة الألعاب المائية حسب الباقة المختارة',
      itineraryDe: 'Wassersportfahrt'
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-parasailing-single' },
    update: { priceAdultEgp: 700, priceAdultUsd: 15, priceAdultEur: 14 },
    create: {
      id: 'pkg-parasailing-single',
      tripId: waterSportsTrip.id,
      nameEn: 'Parasailing Single (1 Person)',
      nameAr: 'باراشوت سينجل (فرد واحد - 700 ج)',
      nameDe: 'Parasailing Einzelflug (700 EGP)',
      descEn: 'Single parasailing flight (15 minutes). Combined weight limit under 150 kg.',
      descAr: 'طيران باراشوت سينجل فرد واحد لمدة 15 دقيقة، أعلى معايير الأمان وسترة النجاة.',
      priceAdultUsd: 15,
      priceChildUsd: 15,
      priceAdultEur: 14,
      priceChildEur: 14,
      priceAdultEgp: 700,
      priceChildEgp: 700,
      priceAdultGbp: 12,
      priceChildGbp: 12,
      currency: 'EGP',
      duration: '15 Minutes',
      capacity: 1,
      badge: 'TOP THRILL',
      includedEn: JSON.stringify(['15 Min Flying Parasailing', 'Life Jacket & Safety Gear', 'Professional Boat Captain', 'High Safety Standards']),
      includedAr: JSON.stringify(['طيران باراشوت 15 دقيقة', 'سترة نجاة ومعدات الأمان', 'كابتن قارب محترف', 'أعلى معايير السلامة والأمان'])
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-parasailing-double' },
    update: { priceAdultEgp: 1300, priceAdultUsd: 27, priceAdultEur: 25 },
    create: {
      id: 'pkg-parasailing-double',
      tripId: waterSportsTrip.id,
      nameEn: 'Parasailing Double (2 Persons)',
      nameAr: 'باراشوت دابل (فردين - 1300 ج)',
      nameDe: 'Parasailing Doppelflug (1300 EGP)',
      descEn: 'Double parasailing flight for 2 persons together (15 minutes). Max weight 150 kg.',
      descAr: 'طيران باراشوت دابل لشخصين معاً لمدة 15 دقيقة، متعة وإثارة لا تُنسى.',
      priceAdultUsd: 27,
      priceChildUsd: 27,
      priceAdultEur: 25,
      priceChildEur: 25,
      priceAdultEgp: 1300,
      priceChildEgp: 1300,
      priceAdultGbp: 22,
      priceChildGbp: 22,
      currency: 'EGP',
      duration: '15 Minutes',
      capacity: 2,
      badge: 'COUPLES BEST CHOICE',
      includedEn: JSON.stringify(['15 Min Double Flying Parasailing for 2', 'Life Jackets & Gear', 'Professional Photography Available']),
      includedAr: JSON.stringify(['طيران باراشوت دابل 15 دقيقة لشخصين', 'سترات نجاة ومعدات سلامة', 'توفر تصوير احترافي'])
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-banana-boat' },
    update: { priceAdultEgp: 600, priceAdultUsd: 13, priceAdultEur: 12 },
    create: {
      id: 'pkg-banana-boat',
      tripId: waterSportsTrip.id,
      nameEn: 'Banana Boat Ride',
      nameAr: 'ركوب البنانا بوت (600 ج للفرد)',
      nameDe: 'Bananenboot-Fahrt (600 EGP)',
      descEn: 'High-speed thrilling banana boat ride for friends and families.',
      descAr: 'ركوب البنانا بوت السريعة، مناسبة للعائلات والأصدقاء في مياه البحر الأحمر.',
      priceAdultUsd: 13,
      priceChildUsd: 13,
      priceAdultEur: 12,
      priceChildEur: 12,
      priceAdultEgp: 600,
      priceChildEgp: 600,
      priceAdultGbp: 10,
      priceChildGbp: 10,
      currency: 'EGP',
      duration: '15 Minutes',
      capacity: 6,
      badge: 'FAMILY FUN',
      includedEn: JSON.stringify(['Banana Boat Water Ride', 'Life Jackets', 'Flexible Timings']),
      includedAr: JSON.stringify(['جولة البنانا بوت المائية', 'سترات النجاة لكل فرد', 'مواعيد مرنة طوال اليوم'])
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-sofa-ride' },
    update: { priceAdultEgp: 600, priceAdultUsd: 13, priceAdultEur: 12 },
    create: {
      id: 'pkg-sofa-ride',
      tripId: waterSportsTrip.id,
      nameEn: 'Quadra / Sofa Water Ride',
      nameAr: 'ركوب الكوادرا السوفا (600 ج للفرد)',
      nameDe: 'Sofa-Fahrt (600 EGP)',
      descEn: 'Exciting Quadra Sofa water tube ride over waves.',
      descAr: 'ركوب الكوادرا السوفا المائية الممتعة والمثيرة في البحر.',
      priceAdultUsd: 13,
      priceChildUsd: 13,
      priceAdultEur: 12,
      priceChildEur: 12,
      priceAdultEgp: 600,
      priceChildEgp: 600,
      priceAdultGbp: 10,
      priceChildGbp: 10,
      currency: 'EGP',
      duration: '15 Minutes',
      capacity: 4,
      badge: 'HIGH ACTION',
      includedEn: JSON.stringify(['Quadra Sofa Water Tube Ride', 'Safety Gear & Captain']),
      includedAr: JSON.stringify(['جولة الكوادرا سوفا المائية', 'معدات السلامة وكابتن متخصص'])
    }
  })

  // 5. Real Trip 4: Orange Bay Yacht & Snorkeling (1200 EGP)
  const orangeBayTrip = await prisma.trip.upsert({
    where: { slug: 'orange-bay-island-yacht-cruise' },
    update: { priceAdultEgp: 1200, priceAdultUsd: 25, priceAdultEur: 23 },
    create: {
      slug: 'orange-bay-island-yacht-cruise',
      categoryId: seaCat.id,
      titleEn: 'Orange Bay Island Yacht & Snorkeling Cruise (8 Hours)',
      titleAr: 'رحلة يخت وسنوركلينج أورنج باي (8 ساعات - 1200 ج)',
      titleDe: 'Orange Bay VIP Yachtausflug (8 Stunden)',
      descEn: 'Full day luxury yacht cruise to Orange Bay Island with 2 snorkeling stops, fresh delicious buffet lunch, refreshments, equipment, and hotel transfers.',
      descAr: 'رحلة يخت فاخرة ومريحة شاملة وقفة على جزيرة أورنج باي، وقفتين سنوركلينج، غداء بوفيه مفتوح مأكولات بحرية طازجة، مشروبات، وأدوات السنوركلينج.',
      descDe: 'Ganztägiger Yachtausflug zur Insel Orange Bay mit 2 Schnorchelstopps und Mittagsbuffet.',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 25,
      priceAdultEur: 23,
      priceAdultEgp: 1200,
      priceChildUsd: 14,
      priceChildEur: 13,
      priceChildEgp: 700,
      duration: '8 Hours',
      pickupTime: '08:00 AM',
      location: 'Orange Bay Island, Hurghada',
      rating: 4.97,
      reviewCount: 230,
      isFeatured: true,
      isPublished: true,
      includedEn: JSON.stringify(['Orange Bay Island Beach Stay', '2 Guided Snorkeling Stops', 'Luxury Yacht Cruise & Sun Deck Access', 'Fresh Buffet Lunch with Seafood', 'Cold & Hot Unlimited Beverages', 'Full Snorkeling Masks & Fins Equipment', 'Air-Conditioned Hotel Transfers', 'Professional Crew & Guides']),
      includedAr: JSON.stringify(['وقفة على جزيرة أورنج باي الاستوائية', 'وقفتين سنوركلينج في أماكن مختلفة للشعاب المرجانية', 'رحلة يخت فاخرة ومريحة', 'الغداء طازج ولذيذ بوفيه مفتوح', 'المشروبات باردة ومنعشة طوال اليوم', 'أدوات ومعدات السنوركلينج الكاملة', 'تنقلات مكيفة من وإلى الفندق', 'فريق عمل محترف لخدمتكم طوال اليوم']),
      includedDe: JSON.stringify(['Insel Orange Bay', '2 Schnorchelstopps', 'Mittagsbuffet', 'Getränke', 'Hoteltransfer']),
      excludedEn: 'Personal Purchases on Island',
      excludedAr: 'المشتريات الشخصية على الجزيرة',
      excludedDe: 'Persönliche Käufe',
      itineraryEn: 'Orange Bay Island Beach + 2 Coral Reef Snorkeling Stops + Open Buffet Lunch + Watersports',
      itineraryAr: 'وقفة جزيرة أورنج باي + وقفتين سنوركلينج + غداء بوفيه مأكولات بحرية + تنقلات',
      itineraryDe: 'Orange Bay + 2 Schnorchelstopps + Mittagsbuffet'
    }
  })

  await prisma.tripPackage.upsert({
    where: { id: 'pkg-orangebay-vip' },
    update: { priceAdultEgp: 1200, priceAdultUsd: 25, priceAdultEur: 23 },
    create: {
      id: 'pkg-orangebay-vip',
      tripId: orangeBayTrip.id,
      nameEn: 'Orange Bay VIP Cruise & Lunch',
      nameAr: 'باقة أورنج باي VIP شاملة الغداء والتنقلات (1200 ج)',
      nameDe: 'Orange Bay VIP Paket (1200 EGP)',
      descEn: 'Orange Bay Island Stay + 2 Coral Reef Snorkeling Stops + Open Seafood Buffet + Drinks + Snorkeling Gear + Transfers.',
      descAr: 'وقفة على جزيرة أورنج باي + وقفتين سنوركلينج + غداء طازج ولذيذ + مشروبات باردة ومنعشة + أدوات السنوركلينج + تنقلات الفندق.',
      priceAdultUsd: 25,
      priceChildUsd: 14,
      priceAdultEur: 23,
      priceChildEur: 13,
      priceAdultEgp: 1200,
      priceChildEgp: 700,
      priceAdultGbp: 20,
      priceChildGbp: 11,
      currency: 'EGP',
      duration: '8 Hours (08:00 - 16:00)',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      capacity: 35,
      badge: 'BEST SELLER #1',
      isBestSeller: true,
      includedEn: JSON.stringify(['Orange Bay Island Beach Stay', '2 Guided Snorkeling Stops', 'Luxury Yacht Cruise & Sun Deck Access', 'Fresh Buffet Lunch with Seafood', 'Cold & Hot Unlimited Beverages', 'Full Snorkeling Masks & Fins Equipment', 'Air-Conditioned Hotel Transfers', 'Professional Crew & Guides']),
      includedAr: JSON.stringify(['وقفة على جزيرة أورنج باي الاستوائية', 'وقفتين سنوركلينج في أماكن مختلفة للشعاب المرجانية', 'رحلة يخت فاخرة ومريحة', 'الغداء طازج ولذيذ بوفيه مفتوح', 'المشروبات باردة ومنعشة طوال اليوم', 'أدوات ومعدات السنوركلينج الكاملة', 'تنقلات مكيفة من وإلى الفندق', 'فريق عمل محترف لخدمتكم طوال اليوم']),
      itinerarySteps: JSON.stringify([
        { time: '08:00 AM', titleEn: 'Hotel Pickup & Transfers', titleAr: 'تنقلات الفندق والوصول لليخت', descEn: 'Pickup by air-conditioned van', descAr: 'التوصيل من فندقك بالباص المكيف للمارينا' },
        { time: '09:00 AM', titleEn: 'Sailing & Safety Briefing', titleAr: 'الإبحار وتوجيهات السلامة', descEn: 'Sail on luxury motor yacht across Red Sea', descAr: 'التحرك باليخت الفاخر وسط المياه الفيروزية' },
        { time: '10:30 AM', titleEn: 'First Snorkeling Stop', titleAr: 'الوقفة الأولى للسنوركلينج', descEn: 'Explore colorful coral reefs & tropical fish', descAr: 'وقفة غطس سنوركلينج عند أروع الشعاب المرجانية' },
        { time: '12:00 PM', titleEn: 'Orange Bay Island Stay', titleAr: 'وقفة جزيرة أورنج باي', descEn: 'Land on Maldives-like white sandy beach', descAr: 'النزول والاسترخاء على شاطئ جزيرة أورنج باي' },
        { time: '02:00 PM', titleEn: 'Buffet Seafood Lunch on Yacht', titleAr: 'غداء بوفيه مفتوح على اليخت', descEn: 'Enjoy freshly cooked seafood & drinks', descAr: 'ناول وجبة الغداء الساخنة والمأكولات البحرية' },
        { time: '03:00 PM', titleEn: 'Second Snorkeling Stop', titleAr: 'الوقفة الثانية للسنوركلينج', descEn: 'Second coral reef stop & watersports', descAr: 'وقفة سنوركلينج ثانية في منطقة مرجانية ثانية' },
        { time: '04:00 PM', titleEn: 'Return Transfer to Hotel', titleAr: 'العودة والتوصيل للفندق', descEn: 'Dock at marina and transfer back to hotel', descAr: 'الوصول والتوصيل إلى الفندق' }
      ])
    }
  })

  console.log('SUCCESS: All real Mr.Raw Travel flyer packages seeded into PostgreSQL database!')
}

seedRealPackages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
