import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Mr.Raw Travel Database...')

  // Clean old data
  await prisma.review.deleteMany()
  await prisma.paymentReceipt.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.bookingPassenger.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.tripSchedule.deleteMany()
  await prisma.tripImage.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.tripCategory.deleteMany()
  await prisma.user.deleteMany()
  await prisma.galleryItem.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.coupon.deleteMany()

  // 1. Create Admin & Guide Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mrrawtravel.com',
      name: 'Mr.Raw Admin',
      role: 'SUPER_ADMIN',
      phone: '+201099887766',
      whatsApp: '+201099887766',
      nationality: 'Egyptian',
      country: 'Egypt',
      city: 'Hurghada',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  })

  const customerUser = await prisma.user.create({
    data: {
      email: 'alex.schmidt@example.de',
      name: 'Alexander Schmidt',
      role: 'CUSTOMER',
      phone: '+491712345678',
      whatsApp: '+491712345678',
      nationality: 'German',
      country: 'Germany',
      city: 'Munich',
      language: 'de',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  })

  // 2. Create Categories
  const seaCat = await prisma.tripCategory.create({
    data: {
      slug: 'sea-trips',
      nameEn: 'Sea & Island Trips',
      nameAr: 'رحلات البحر والجزر',
      nameDe: 'Meeres- & Inselausflüge',
      descEn: 'Explore paradise islands, vibrant coral reefs, and pristine turquoise waters of the Red Sea.',
      descAr: 'استكشف جزر الفردوس والشعاب المرجانية الساحرة والمياه الفيروزية الصافية للبحر الأحمر.',
      descDe: 'Entdecken Sie Paradiesinseln, korallenreiche Riffe und kristallklares Wasser im Roten Meer.',
      icon: 'Anchor',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      order: 1
    }
  })

  const safariCat = await prisma.tripCategory.create({
    data: {
      slug: 'desert-safari',
      nameEn: 'Desert Safari & Quad',
      nameAr: 'سفاري الصحراء والبيتش باجي',
      nameDe: 'Wüstensafari & Quads',
      descEn: 'Conquer golden sand dunes, race quad bikes, and enjoy traditional Bedouin dinners under starry skies.',
      descAr: 'انطلق فوق الكثبان الرملية الذهبية بالدرجات الرباعية واستمتع بالعشاء البدوي الساحر تحت النجوم.',
      descDe: 'Erobern Sie goldene Dünen, fahren Sie Quads und genießen Sie ein Beduinen-Abendessen unter Sternen.',
      icon: 'Compass',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      order: 2
    }
  })

  const vipCat = await prisma.tripCategory.create({
    data: {
      slug: 'vip-yacht',
      nameEn: 'VIP Private Yacht',
      nameAr: 'يخوت خاصة VIP',
      nameDe: 'VIP Private Yachten',
      descEn: 'Ultimate luxury tailored private yacht charters with personal chef, snorkeling gear, and butler service.',
      descAr: 'قمة الفخامة في رحلات يخوت خاصة مخصصة مع شيف خاص ومعدات الغوص وخدمة الكونسيرج.',
      descDe: 'Höchster Luxus auf privaten Yacht-Chartern mit eigenem Koch und erstklassigem Service.',
      icon: 'Crown',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      order: 3
    }
  })

  const historicalCat = await prisma.tripCategory.create({
    data: {
      slug: 'historical-tours',
      nameEn: 'Historical Luxor & Pyramids',
      nameAr: 'رحلات الأقصر والأهرامات التاريخية',
      nameDe: 'Historisches Luxor & Pyramiden',
      descEn: 'Journey to the ancient wonders of Egypt: Karnak Temple, Valley of the Kings, and Giza Pyramids.',
      descAr: 'رحلة إلى عجائب مصر القديمة: معبد الكرنك، وادي الملوك، وأهرامات الجيزة الخالدة.',
      descDe: 'Reisen Sie zu den antiken Wunderwelt Ägyptens: Karnak-Tempel, Tal der Könige und Pyramiden.',
      icon: 'Landmark',
      image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      order: 4
    }
  })

  // 3. Create Trips
  const trip1 = await prisma.trip.create({
    data: {
      slug: 'giftun-island-vip-snorkeling',
      titleEn: 'Giftun Island Paradise & VIP Snorkeling Cruise',
      titleAr: 'رحلة جزيرة جفتون الفاخرة والسنوركلنج الملكي',
      titleDe: 'Paradiesinsel Giftun & VIP Schnorchelausflug',
      descEn: 'Sail aboard our premium motor yacht to Giftun Island (Orange Bay / Paradise Beach). Enjoy two guided snorkeling stops at pristine coral reefs, a gourmet seafood & BBQ lunch buffet, soft drinks, fruits, and banana boat water sports activities.',
      descAr: 'أبحر على متن يختنا الفاخر إلى جزيرة جفتون (أورنج باي / بارادايس). استمتع بوقفتين سنوركلنج عند أجمل الشعاب المرجانية، وبوفيه مأكولات بحرية ومشويات فاخر، والمشروبات، وألعاب الألعاب المائية.',
      descDe: 'Segeln Sie mit unserer Premium-Yacht zur Insel Giftun. Genießen Sie zwei geführte Schnorchelstopps an unberührten Riffen, ein Gourmet-Meeresfrüchte- & BBQ-Mittagsbuffet und Wassersport.',
      categoryId: seaCat.id,
      priceAdultUsd: 45,
      priceChildUsd: 25,
      priceAdultEur: 42,
      priceChildEur: 23,
      priceAdultEgp: 2200,
      priceChildEgp: 1200,
      duration: '8 Hours',
      pickupTime: '08:00 AM',
      location: 'Giftun Island, Hurghada',
      meetingPoint: 'Hotel Pickup Included (Hurghada / El Gouna / Sahl Hasheesh / Makadi Bay)',
      maxSeats: 35,
      bookedSeats: 12,
      isFeatured: true,
      isSpecialOffer: false,
      rating: 4.95,
      reviewCount: 148,
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      includedEn: JSON.stringify(['Hotel Roundtrip Transfers in AC Vehicle', 'VIP Boat Cruise with Sunbeds & Deck', '2 Guided Snorkeling Stops with Gear & Life Jackets', 'Open Buffet Seafood & BBQ Lunch', 'Fresh Fruits, Soft Drinks & Mineral Water', 'Banana Boat & Water Sofa Rides', 'National Park Entrance Fees']),
      includedAr: JSON.stringify(['الانتقالات الذهاب والإياب في سيارات مكيفة', 'رحلة اليخت الفاخر مع كراسي الاستلقاء', 'وقفتان سنوركلنج مع المعدات ولايف جاكيت', 'بوفيه مفتوح مأكولات بحرية ومشويات', 'فواكه طازجة ومشروبات على مدار اليوم', 'العاب مائية (بنانا بووت و كواترو)', 'رسوم المحمية الطبيعية']),
      includedDe: JSON.stringify(['Hotel Transfer im Klimatisierten VIP-Bus', 'VIP Bootscruise mit Sonnendeck', '2 Schnorchelstopps inklusive Ausrüstung', 'Offenes Meeresfrüchte- & BBQ-Buffet', 'Frisches Obst, Softdrinks & Wasser', 'Bananenboot & Wassersport']),
      excludedEn: JSON.stringify(['Personal Expenses & Souvenirs', 'Photo & Video Package (Optional)', 'Tips for Boat Crew']),
      excludedAr: JSON.stringify(['المصاريف الشخصية والهدايا', 'جلسة التصوير الفووتوسيشن (اختياري)', 'الإكراميات لطاقم المركب']),
      excludedDe: JSON.stringify(['Persönliche Ausgaben', 'Foto- & Videopaket', 'Trinkgelder']),
      itineraryEn: JSON.stringify([
        { time: '08:00 AM', title: 'Hotel Pickup', desc: 'Transfer from your hotel to Hurghada VIP Marina' },
        { time: '09:00 AM', title: 'Yacht Departure', desc: 'Board the yacht, safety briefing and soft drinks served' },
        { time: '10:15 AM', title: 'First Snorkeling Stop', desc: 'Explore vibrant coral reefs with certified marine guides' },
        { time: '11:45 AM', title: 'Giftun Island Beach Time', desc: 'Relax on white sandy beach, swim, and take luxury photos' },
        { time: '01:30 PM', title: 'Seafood Buffet Lunch', desc: 'Freshly cooked grilled shrimps, fish, chicken, salads & fruits' },
        { time: '02:30 PM', title: 'Second Snorkeling Stop & Watersports', desc: 'Discover clownfish habitats and enjoy banana boat rides' },
        { time: '04:30 PM', title: 'Return to Marina', desc: 'Disembark and transfer back to hotel' }
      ]),
      itineraryAr: JSON.stringify([
        { time: '08:00 ص', title: 'التحرك من الفندق', desc: 'الانتقال بسيارة مجهزة إلى مارينا الغردقة الفاخرة' },
        { time: '09:00 ص', title: 'الإبحار باليخت', desc: 'صعود اليخت وشرح تعليمات السلامة وتقديم المشروبات' },
        { time: '10:15 ص', title: 'وقفة السنوركلنج الأولى', desc: 'السباحة والغوص السطحي عند أجمل الشعاب المرجانية' },
        { time: '11:45 ص', title: 'نزول جزيرة جفتون', desc: 'الاسترخاء على الرمال البيضاء والالتقاط الصور الساحرة' },
        { time: '01:30 م', title: 'غداء البوفيه المفتوح', desc: 'جمبري مشوي وسمك ودجاج وسلاطات وفواكه' },
        { time: '02:30 م', title: 'الوقفة الثانية والألعاب المائية', desc: 'مشاهدة شعاب مرجانية جديدة وركوب البنانا بووت' },
        { time: '04:30 م', title: 'العودة للمارينا', desc: 'الوصول والتوصيل للفندق' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '08:00 Uhr', title: 'Hotelabholung', desc: 'Fahrt zur Marina Hurghada' },
        { time: '09:00 Uhr', title: 'Abfahrt der Yacht', desc: 'Willkommensgetränk & Sicherheits-Briefing' },
        { time: '10:15 Uhr', title: 'Erster Schnorchelstopp', desc: 'Entdecken Sie die Unterwasserwelt' },
        { time: '11:45 Uhr', title: 'Insel Aufenthalt', desc: 'Entspannung am weißen Sandstrand' },
        { time: '13:30 Uhr', title: 'Meeresfrüchte Buffet', desc: 'Frisch zubereitetes Mittagessen an Bord' },
        { time: '16:30 Uhr', title: 'Rückkehr', desc: 'Transfer zurück zum Hotel' }
      ])
    }
  })

  const trip2 = await prisma.trip.create({
    data: {
      slug: 'mega-desert-safari-quad-bedouin-dinner',
      titleEn: 'Mega Desert Safari: Quad Bike, Camel Ride & Bedouin Show',
      titleAr: 'سفاري الصحراء الشامل: البيتش باجي وركوب الجمال والعشاء البدوي',
      titleDe: 'Mega Wüstensafari: Quad, Kamelritt & Beduinenshow',
      descEn: 'Experience the ultimate Hurghada desert adventure! Drive single or double quad bikes across high sand dunes, ride a spider buggy, visit a traditional Bedouin village, sip authentic herbal tea, ride camels, and enjoy an oriental show with tanoura & belly dance during a stargazing BBQ dinner.',
      descAr: 'خض مغامرة الصحراء الإفريقية المثيرة! قيادة البيتش باجي الرباعي فوق الكثبان الرملية، وسبايدر باجي، وزيارة القرية البدوية، وركوب الجمال، وحفلة الشرقي والتنورة مع عشاء المشويات تحت النجوم.',
      descDe: 'Erleben Sie das ultimative Wüstenabenteuer! Fahren Sie Quads über goldene Dünen, besuchen Sie ein Beduinendorf, reiten Sie auf Kamelen und genießen Sie eine spektakuläre orientalische Show mit BBQ.',
      categoryId: safariCat.id,
      priceAdultUsd: 35,
      priceChildUsd: 20,
      priceAdultEur: 32,
      priceChildEur: 18,
      priceAdultEgp: 1700,
      priceChildEgp: 950,
      duration: '6 Hours',
      pickupTime: '01:00 PM',
      location: 'Hurghada Desert',
      maxSeats: 40,
      bookedSeats: 18,
      isFeatured: true,
      isSpecialOffer: true,
      discountPercent: 15,
      rating: 4.92,
      reviewCount: 215,
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      includedEn: JSON.stringify(['Hotel Transfers in 4x4 Land Cruiser or AC Bus', '45 Mins Quad Biking Experience', '20 Mins Spider Dune Buggy', 'Bedouin Village Guided Tour & Herbal Tea', 'Camel Riding Experience', 'Oriental BBQ Dinner & Mineral Water', 'Belly Dance, Fire Show & Tanoura Performance', 'Sunset Viewing & Stargazing Telescope']),
      includedAr: JSON.stringify(['الانتقالات من وإلى الفندق', 'قيادة البيتش باجي لمدة 45 دقيقة', 'قيادة السبايدر باجي لمدة 20 دقيقة', 'جولة بالقرية البدوية وشرب الشاي البدوي', 'ركوب الجمال', 'عشاء المشويات البدوي مع المشروبات', 'عرض الشرقي والتنورة وعرض النار', 'مشاهدة الغروب ورصد النجوم']),
      includedDe: JSON.stringify(['Hotelabholung im 4x4 Land Cruiser', '45 Min. Quad-Fahrt', '20 Min. Spider Buggy', 'Beduinendorf Führung & Tee', 'Kamelreiten', 'BBQ-Abendessen & Getränke', 'Orientalische Show (Tanz & Feuer)', 'Sterngucken durch Teleskop']),
      excludedEn: JSON.stringify(['Bedouin Scarf (Arafat) & Goggles Rental ($2-$3)', 'Soft Drinks outside dinner', 'Quad Video DVD']),
      excludedAr: JSON.stringify(['الشال البدوي والنظارة (2-3 دولار)', 'المشروبات الغازية الخارجي', 'سيدي الفيديو']),
      excludedDe: JSON.stringify(['Beduinentuch & Schutzbrille', 'Extra Getränke', 'DVD Foto']),
      itineraryEn: JSON.stringify([
        { time: '01:00 PM', title: 'Hotel Pickup', desc: 'Pick up by Land Cruiser 4x4 or AC Minibus' },
        { time: '02:00 PM', title: 'Quad Base Arrival', desc: 'Safety instructions and test drive training' },
        { time: '02:30 PM', title: 'Quad Bike Dune Ride', desc: 'Drive 25 km into the heart of the Hurghada desert' },
        { time: '03:45 PM', title: 'Buggy Safari & Bedouin Village', desc: 'Arrive at Bedouin village, ride camels and taste handmade Bedouin bread' },
        { time: '05:30 PM', title: 'Sunset Magic', desc: 'Watch golden sunset over desert mountains' },
        { time: '06:30 PM', title: 'BBQ Dinner & Folkloric Show', desc: 'Feast on grilled kebabs & enjoy belly dance and Tanoura' },
        { time: '07:30 PM', title: 'Return Transfer', desc: 'Safe drop-off back at your hotel' }
      ]),
      itineraryAr: JSON.stringify([
        { time: '01:00 م', title: 'التحرك من الفندق', desc: 'الانتقال بسيارات فور باي فور الفاخرة' },
        { time: '02:00 م', title: 'الوصول لمركز السفاري', desc: 'التدريب على قيادة البيتش باجي وتعليمات الأمان' },
        { time: '02:30 م', title: 'انطلاق سفاري البيتش باجي', desc: 'قيادة 25 كم وسط الجبال والكثبان الرملية' },
        { time: '03:45 م', title: 'القرية البدوية والجمل', desc: 'زيارة القرية وشرب الشاي وتذوق العيش البدوي وركوب الجمال' },
        { time: '05:30 م', title: 'غروب الشمس الساحر', desc: 'صعود الهضبة لمشاهدة الغروب' },
        { time: '06:30 م', title: 'العشاء والحفلة البدوية', desc: 'بوفيه مشويات فاخر مع عروض التنورة والشرقي والنار' },
        { time: '07:30 م', title: 'العودة للفندق', desc: 'الوصول بسلامة الله للفندق' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '13:00 Uhr', title: 'Hotelabholung', desc: 'Fahrt in die Wüste' },
        { time: '14:30 Uhr', title: 'Quad-Fahrt', desc: 'Fahrt durch die Wüstenlandschaft' },
        { time: '16:00 Uhr', title: 'Beduinendorf & Kamelritt', desc: 'Einblick in das Leben der Beduinen' },
        { time: '18:30 Uhr', title: 'BBQ & Show', desc: 'Abendessen & Orientalische Show' },
        { time: '19:30 Uhr', title: 'Rückfahrt', desc: 'Ankunft im Hotel' }
      ])
    }
  })

  const trip3 = await prisma.trip.create({
    data: {
      slug: 'luxor-valley-of-the-kings-vip-day-tour',
      titleEn: 'Historical Luxor & Valley of the Kings Private / Small Group VIP Tour',
      titleAr: 'رحلة الأقصر ووادي الملوك الملكية بسيارات فاخرة',
      titleDe: 'Historisches Luxor & Tal der Könige VIP Ausflug',
      descEn: 'Travel in luxury air-conditioned comfort to the world’s greatest open-air museum. Guided by an expert Egyptologist, discover Karnak Temple, Hatshepsut Temple, Colossi of Memnon, sail the Nile by felucca, and step inside Tutankhamun’s royal tombs in the Valley of the Kings.',
      descAr: 'سافر في منتهى الراحة إلى أكبر متحف مفتوح في العالم. برفقة مرشد سياحي متخصص في الحضارة المصرية القديمة، اكتشف معبد الكرنك ومعبد حتشبسوت وتمثالي ممنون وركوب الفلوكة في النيل ودخول مقابر وادي الملوك.',
      descDe: 'Reisen Sie im luxuriösen VIP-Bus nach Luxor. Entdecken Sie den Karnak-Tempel, das Tal der Könige, den Hatschepsut-Tempel und genießen Sie eine Nilfahrt.',
      categoryId: historicalCat.id,
      priceAdultUsd: 85,
      priceChildUsd: 45,
      priceAdultEur: 79,
      priceChildEur: 42,
      priceAdultEgp: 4200,
      priceChildEgp: 2200,
      duration: '14 Hours',
      pickupTime: '05:00 AM',
      location: 'Luxor, Egypt',
      maxSeats: 16,
      bookedSeats: 8,
      isFeatured: true,
      isSpecialOffer: false,
      rating: 4.98,
      reviewCount: 96,
      coverImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      includedEn: JSON.stringify(['Roundtrip Luxury Transfers with WiFi', 'Licensed English/German/Arabic Egyptologist Guide', 'Entrance Tickets to Karnak Temple Complex', 'Entrance Tickets to Valley of the Kings (3 Royal Tombs)', 'Entrance Tickets to Hatshepsut Mortuary Temple', 'Colossi of Memnon Photo Stop', 'Traditional Nile River Boat Crossing', 'Lunch at Nile Riverside Restaurant']),
      includedAr: JSON.stringify(['انتقالات ذهاب وإياب في سيارات فاخرة مجهزة بـ WiFi', 'مرشد سياحي مرخص خبير في الآثار المصرية', 'تذاكر مجمع معابد الكرنك', 'تذاكر دخول 3 مقابر ملكية بوادي الملوك', 'تذاكر معبد الملكة حتشبسوت بالدير البحري', 'وقفة تصوير عند تمثالي ممنون', 'جولة مركب بالنيل', 'غداء فاخر في مطعم المطل على النيل']),
      includedDe: JSON.stringify(['VIP Transfers mit Klimaanlage & WiFi', 'Ägyptologe Reiseleiter (Deutschsprachig)', 'Eintrittskarten Karnak-Tempel', 'Eintrittskarten Tal der Könige (3 Gräber)', 'Eintrittskarten Hatschepsut-Tempel', 'Kolosse von Memnon', 'Nilfahrt mit der Feluke', 'Mittagessen am Nil']),
      excludedEn: JSON.stringify(['Tomb of Tutankhamun Special Ticket (Optional)', 'Drinks during lunch', 'Personal tipping for guide & driver']),
      excludedAr: JSON.stringify(['تذكرة مقبرة توت عنخ آمون الخاصة (اختياري)', 'المشروبات أثناء الغداء', 'إكراميات المرشد والسائق']),
      excludedDe: JSON.stringify(['Tutanchamun Grab Zusatzticket', 'Getränke beim Mittagessen', 'Trinkgelder']),
      itineraryEn: JSON.stringify([
        { time: '05:00 AM', title: 'Early Hotel Pickup', desc: 'Pick up in luxury Mercedes Sprinter' },
        { time: '08:30 AM', title: 'Rest Stop in Qena', desc: 'Brief comfort stop for coffee & breakfast box' },
        { time: '09:30 AM', title: 'Karnak Temple Complex', desc: 'Explore the vast Great Hypostyle Hall with 134 massive columns' },
        { time: '12:00 PM', title: 'Nile Crossing & Lunch', desc: 'Cross the Nile on a wooden motor boat and enjoy fresh Egyptian lunch' },
        { time: '01:30 PM', title: 'Valley of the Kings', desc: 'Explore vibrant ancient wall paintings inside 3 pharaonic tombs' },
        { time: '03:30 PM', title: 'Hatshepsut Temple & Memnon', desc: 'Admire female Pharaoh Hatshepsut architectural masterpiece' },
        { time: '05:00 PM', title: 'Return Journey', desc: 'Relax on comfortable ride back to Hurghada' },
        { time: '08:30 PM', title: 'Hotel Drop-off', desc: 'Return to hotel in Hurghada' }
      ]),
      itineraryAr: JSON.stringify([
        { time: '05:00 ص', title: 'التحرك المباشر من الفندق', desc: 'الانتقال بمرسيدس سبرينتر الحديثة' },
        { time: '08:30 ص', title: 'استراحة قنا', desc: 'تناول القهوة والكرواسون في الاستراحة' },
        { time: '09:30 ص', title: 'معبد الكرنك الأسطوري', desc: 'جولة صالة الأعمدة الكبرى وربط التاريخ بالمعالم' },
        { time: '12:00 م', title: 'عبور النيل والغداء', desc: 'عبور النيل بالمركب واستراحة الغداء الشرقي' },
        { time: '01:30 م', title: 'وادي الملوك', desc: 'زيارة 3 مقابر للملوك بألوانها الزاهية الأصلية' },
        { time: '03:30 م', title: 'معبد حتشبسوت وممنون', desc: 'مشاهدة تحفة حتشبسوت المعمارية وتمثالي ممنون' },
        { time: '05:00 م', title: 'انطلاق رحلة العودة', desc: 'الاسترخاء والعودة للغردقة' },
        { time: '08:30 م', title: 'الوصول للفندق', desc: 'الوصول للفندق بالسلامة' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '05:00 Uhr', title: 'Abholung', desc: 'Fahrt nach Luxor' },
        { time: '09:30 Uhr', title: 'Karnak-Tempel', desc: 'Führung durch den Tempelkomplex' },
        { time: '12:00 Uhr', title: 'Mittagessen am Nil', desc: 'Nilüberquerung & Essen' },
        { time: '13:30 Uhr', title: 'Tal der Könige', desc: 'Besichtigung von 3 Pharaonengräbern' },
        { time: '16:00 Uhr', title: 'Hatschepsut Tempel', desc: 'Fotostopp & Führung' },
        { time: '20:30 Uhr', title: 'Rückkehr', desc: 'Ankunft in Hurghada' }
      ])
    }
  })

  const trip4 = await prisma.trip.create({
    data: {
      slug: 'luxury-sunset-charter-private-yacht',
      titleEn: 'Royal Private Yacht Charter: Sunset & Dolphin Sanctuary Cruise',
      titleAr: 'تأجير يخت ملكي خاص: رحلة غروب الشمس ودولفين هاوس',
      titleDe: 'Exklusive Private Yacht-Charter: Sonnenuntergang & Delphine',
      descEn: 'Rent your own luxury 45-foot motor yacht exclusively for your family or group. Explore secret reefs in Dolphin House, enjoy personalized snorkeling guidance, a private chef serving lobster, fresh catch fish, grilled steaks, and chill on the sun deck with ambient music.',
      descAr: 'استأجر يختك الخاص بطول 45 قدماً حصرياً لعائلتك أو مجموعتك. استكشف بيت الدلافين والشعاب المرجانية السرية مع شيف خاص يقدم الاستاكوزا والأسماك والمشويات مع موسيقى الجاز والاسترخاء.',
      descDe: 'Mieten Sie Ihre eigene Luxusyacht exklusiv für Ihre Familie oder Gruppe. Erleben Sie Delphine hautnah, genießen Sie frische Meeresfrüchte von Ihrem privaten Koch.',
      categoryId: vipCat.id,
      priceAdultUsd: 280,
      priceChildUsd: 140,
      priceAdultEur: 260,
      priceChildEur: 130,
      priceAdultEgp: 14000,
      priceChildEgp: 7000,
      duration: '8 Hours',
      pickupTime: '09:00 AM',
      location: 'Dolphin House, Red Sea',
      maxSeats: 12,
      bookedSeats: 0,
      isFeatured: true,
      isSpecialOffer: true,
      discountPercent: 10,
      rating: 5.0,
      reviewCount: 42,
      coverImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
      includedEn: JSON.stringify(['Private Charter of 45-ft Luxury Motor Yacht', 'Private Captain, 2 Deck Crew & Dedicated Chef', 'Private Luxury Hotel Transfers in Mercedes V-Class', 'Unlimited Fresh Tropical Fruits, Cocktails & Soft Drinks', 'VIP 5-Course Seafood & Steak Lunch', 'Professional Snorkeling Guide & Premium Equipment', 'Seabob & Water Scooter Toys']),
      includedAr: JSON.stringify(['تأجير حصري ليخت ملكي 45 قدم', 'قبطان وطاقم خدمة وشيف خاص', 'انتقالات خاصة بسيارة مرسيدس V-Class', 'مشروبات وكوكتيلات وفواكه طازجة بلا حدود', 'غداء 5 نجوم مأكولات بحرية وستيك', 'مرشد سنوركلنج خاص ومعدات احترافية', 'ألعاب مائية وسيابوب']),
      includedDe: JSON.stringify(['Exklusive Nutzung der 45ft Luxusyacht', 'Privater Kapitän & Gourmet-Koch', 'Mercedes V-Klasse Hoteltransfer', 'Unbegrenzt Getränke & Cocktails', '5-Gänge-Gourmet-Menü an Bord', 'Privater Schnorchel-Guide']),
      excludedEn: JSON.stringify(['Alcoholic Beverages (BYOB permitted)', 'Personal souvenirs']),
      excludedAr: JSON.stringify(['المشروبات الروحية (مسموح جلبها)', 'المشتريات الشخصية']),
      excludedDe: JSON.stringify(['Alkoholische Getränke', 'Trinkgeld']),
      itineraryEn: JSON.stringify([
        { time: '09:00 AM', title: 'Private Mercedes Pickup', desc: 'VIP transfer from hotel to Private Yacht Club' },
        { time: '09:30 AM', title: 'Champagne Welcome', desc: 'Welcome mocktails & fruit platter upon boarding' },
        { time: '11:00 AM', title: 'Dolphin House Sanctuary', desc: 'Swim beside wild dolphins in crystal-clear turquoise waters' },
        { time: '01:30 PM', title: '5-Course Private Chef Lunch', desc: 'Lobster tail, jumbo prawns, tender steaks, and fine desserts' },
        { time: '03:30 PM', title: 'Secluded Lagoon & Seabob', desc: 'Underwater scooter exploration near hidden coral gardens' },
        { time: '05:30 PM', title: 'Golden Sunset Return', desc: 'Cruise into Hurghada marina during golden sunset hour' }
      ]),
      itineraryAr: JSON.stringify([
        { time: '09:00 ص', title: 'الاستقبال بالمرسيدس', desc: 'التوصيل الخاص من الفندق إلى نادي اليخوت' },
        { time: '09:30 ص', title: 'استقبال الكوكتيل الملكي', desc: 'تقديم الكوكتيلات وطبق الفواكه الاستوائية' },
        { time: '11:00 ص', title: 'محمية بيت الدلافين', desc: 'السباحة إلى جوار الدلافين في المياه الصافية' },
        { time: '01:30 م', title: 'غداء الشيف الخاص 5 نجوم', desc: 'استاكوزا وجمبري ملكي وستيك وحلويات فاخرة' },
        { time: '03:30 م', title: 'اللاجون السري والسيابوب', desc: 'تجربة المحركات المائية تحت الماء عند الشعاب المرجانية' },
        { time: '05:30 م', title: 'الإبحار وقت الغروب', desc: 'العودة للمارينا مع مشهد الغروب الذهبي الساحر' }
      ]),
      itineraryDe: JSON.stringify([
        { time: '09:00 Uhr', title: 'VIP Abholung', desc: 'Fahrt mit Mercedes V-Klasse' },
        { time: '11:00 Uhr', title: 'Delphin-Beobachtung', desc: 'Schwimmen mit Delphinen im Roten Meer' },
        { time: '13:30 Uhr', title: 'Gourmet Mittagessen', desc: 'Serviert von Ihrem privaten Koch' },
        { time: '17:30 Uhr', title: 'Sonnenuntergang', desc: 'Rückkehr in den Hafen bei Sonnenuntergang' }
      ])
    }
  })

  // 4. Create Trip Images
  await prisma.tripImage.createMany({
    data: [
      { tripId: trip1.id, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', order: 1, caption: 'Giftun Island Beach' },
      { tripId: trip1.id, url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80', order: 2, caption: 'Snorkeling at Coral Reef' },
      { tripId: trip1.id, url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80', order: 3, caption: 'VIP Deck Relaxation' },
      { tripId: trip2.id, url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', order: 1, caption: 'Quad Bike Safari' },
      { tripId: trip2.id, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', order: 2, caption: 'Bedouin Camp Night' },
      { tripId: trip3.id, url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80', order: 1, caption: 'Karnak Temple Pillars' },
      { tripId: trip4.id, url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80', order: 1, caption: 'Private Yacht Charter' }
    ]
  })

  // 5. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        tripId: trip1.id,
        author: 'Markus Weber',
        country: 'Germany',
        rating: 5,
        title: 'Unbelievable Experience in Hurghada!',
        comment: 'Everything was organized to perfection by Mr.Raw Travel. The seafood lunch was super fresh, boat was immaculately clean, and snorkeling guides took care of our kids so well.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      {
        tripId: trip1.id,
        author: 'Elena Rostova',
        country: 'Russia',
        rating: 5,
        title: 'Luxury quality at best price!',
        comment: 'Orange Bay is pure paradise! Warm clear water and beautiful white sand. Transfer picked us up right from hotel lobby in Sahl Hasheesh on time.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
      },
      {
        tripId: trip2.id,
        author: 'Sarah Jenkins',
        country: 'United Kingdom',
        rating: 5,
        title: 'Best Quad Safari of my life!',
        comment: 'Riding the quad bike across the dunes was exhilarating! The Bedouin dinner performance with the fire show and Tanoura dancer was breathtaking.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
      }
    ]
  })

  // 6. Create Booking & Payment Sample
  const booking = await prisma.booking.create({
    data: {
      bookingNumber: 'MR-2026-9821',
      userId: customerUser.id,
      tripId: trip1.id,
      tripDate: new Date('2026-08-05'),
      pickupLocation: 'Steigenberger ALDAU Beach Hotel Lobby',
      hotelName: 'Steigenberger ALDAU Beach Hotel',
      hotelAddress: 'Youssef Afifi Rd, Hurghada',
      roomNumber: '402',
      pickupTime: '08:15 AM',
      leadPassengerName: 'Alexander Schmidt',
      leadEmail: 'alex.schmidt@example.de',
      leadPhone: '+491712345678',
      leadWhatsApp: '+491712345678',
      leadNationality: 'Germany',
      specialNotes: 'Vegetarian lunch option preferred for 1 adult.',
      adults: 2,
      children: 1,
      currency: 'EUR',
      totalPrice: 107.0,
      paymentMethod: 'INSTAPAY',
      paymentStatus: 'APPROVED',
      bookingStatus: 'CONFIRMED',
      qrToken: 'MRRAW-TOKEN-88992211-DE'
    }
  })

  await prisma.paymentReceipt.create({
    data: {
      bookingId: booking.id,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      status: 'APPROVED',
      adminNotes: 'InstaPay transfer verified successfully against bank statement.'
    }
  })

  // 7. Create Fleet
  await prisma.guide.createMany({
    data: [
      { name: 'Mahmoud El-Sayed', phone: '+201011223344', languages: 'English, German, Arabic', rating: 4.98 },
      { name: 'Karem Farouk', phone: '+201022334455', languages: 'English, Russian, Arabic', rating: 4.95 }
    ]
  })

  await prisma.driver.createMany({
    data: [
      { name: 'Hassan Ibrahim', phone: '+201055667788', licenseNo: 'EGY-HRG-9941' },
      { name: 'Tarek Mansour', phone: '+201066778899', licenseNo: 'EGY-HRG-1024' }
    ]
  })

  await prisma.vehicle.createMany({
    data: [
      { model: 'Mercedes Sprinter VIP 2025 (16 Seats)', plateNo: 'ط ص أ 4912', capacity: 16 },
      { model: 'Toyota Coaster VIP AC (24 Seats)', plateNo: 'س ر ج 8831', capacity: 24 }
    ]
  })

  // 8. Create Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'VIPSUMMER', type: 'PERCENTAGE', value: 15, maxUses: 200, isActive: true },
      { code: 'WELCOME10', type: 'FIXED', value: 10, maxUses: 500, isActive: true }
    ]
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
