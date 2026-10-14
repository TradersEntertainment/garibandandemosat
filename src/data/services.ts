import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    id: 's-1',
    title: 'Detaylı Ev Temizliği (Gündelikçi / Profesyonel Ekip)',
    category: 'temizlik',
    categoryLabel: 'Ev Temizliği',
    shortDesc: 'Camlar, mutfak dolapları, banyo dezenfeksiyonu ve zemin temizliği dahil 8 saatlik tam gün hizmet.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 1250,
    armutAveragePrice: 2400,
    savings: 1150,
    unit: 'seans başı',
    guaranteeText: 'Memnun kalınmazsa ücretsiz telafi temizliği garantisi.',
    tags: ['ev temizliği', 'gündelikçi', 'temizlikçi', 'cam silme', 'boş ev temizliği', 'armut'],
    options: [
      { id: 'opt-1-1', label: '1+1 Daire (Standart)', multiplier: 1.0, description: '1 Personel • 6-7 Saat' },
      { id: 'opt-1-2', label: '2+1 Daire (Detaylı)', multiplier: 1.35, description: '1 Personel • Tam Gün' },
      { id: 'opt-1-3', label: '3+1 Daire (Geniş Ev)', multiplier: 1.7, description: '2 Personel • Tam Gün' },
      { id: 'opt-1-4', label: 'Boş / Taşınma Öncesi', multiplier: 2.1, description: '2 Personel • Özel Kimyasal İlaçlı' },
    ],
    providers: [
      {
        id: 'sp-1-1',
        name: 'Fatma & Ayşe Hanım Ekibi',
        businessName: 'Pırıl Ev Temizlik Hizmetleri',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 1420,
        reviewCount: 390,
        price: 1250,
        originalPrice: 2200,
        responseTime: 'Bugün İçin Uygun',
        location: 'Kadıköy & Tüm Anadolu Yakası',
        warrantyDays: 3,
        verifiedBadge: 'Gariban Onaylı Esnaf',
        isCheapest: true,
        phone: '0532 400 12 34',
        notes: 'Deterjanlar ve microfiber bezler tarafımızca getirilir.'
      },
      {
        id: 'sp-1-2',
        name: 'EkoClean Profesyonel',
        businessName: 'EkoClean Tesis Yönetimi',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        completedJobsCount: 980,
        reviewCount: 240,
        price: 1450,
        originalPrice: 2400,
        responseTime: 'Yarın 09:00',
        location: 'Tüm İstanbul (Avrupa + Anadolu)',
        warrantyDays: 7,
        verifiedBadge: 'Kurumsal Onaylı',
        phone: '0850 300 45 67',
        notes: 'Sigortalı kurumsal temizlik personeli.'
      },
      {
        id: 'sp-1-3',
        name: 'Merve Temizlik',
        businessName: 'Merve Ev Hizmetleri',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        rating: 4.7,
        completedJobsCount: 650,
        reviewCount: 180,
        price: 1550,
        originalPrice: 2300,
        responseTime: 'Hafta Sonu Uygun',
        location: 'Beşiktaş, Şişli, Sarıyer',
        warrantyDays: 2,
        verifiedBadge: 'Ustalık Belgeli',
        phone: '0533 111 22 33',
        notes: 'Buharlı zemin dezenfeksiyonu hediye.'
      }
    ]
  },
  {
    id: 's-2',
    title: 'Kombi Bakımı & İlaçlı Petek Temizliği',
    category: 'tamir',
    categoryLabel: 'Tesisat & Kombi',
    shortDesc: 'Doğalgaz faturasını %30 düşüren çift yönlü makineli petek yıkama ve kombi yanma odası bakımı.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 750,
    armutAveragePrice: 1850,
    savings: 1100,
    unit: 'kombi + sistem',
    guaranteeText: '1 Yıl teknik servis & sızdırmazlık garantisi.',
    tags: ['kombi bakımı', 'petek temizleme', 'doğalgaz', 'vaillant', 'bosch', 'demirdöküm', 'armut'],
    options: [
      { id: 'opt-2-1', label: 'Sadece Kombi Bakımı', multiplier: 1.0, description: 'Genleşme tankı, brülör, fan ve filtre bakımı' },
      { id: 'opt-2-2', label: 'Kombi + 4-6 Petek Temizliği', multiplier: 1.6, description: 'Makineli kimyasallı yıkama + Kombi bakımı' },
      { id: 'opt-2-3', label: 'Kombi + Dubleks / 8+ Petek', multiplier: 2.2, description: 'Tam kapsamlı termal tesisat temizliği' }
    ],
    providers: [
      {
        id: 'sp-2-1',
        name: 'Selim Usta (MYK Belgeli)',
        businessName: 'IsıTeknik Doğalgaz & Kombi Servisi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 2100,
        reviewCount: 680,
        price: 750,
        originalPrice: 1800,
        responseTime: '1 Saat İçinde Kapında',
        location: 'Kadıköy, Üsküdar, Maltepe',
        warrantyDays: 365,
        verifiedBadge: 'Ustalık Belgeli',
        isCheapest: true,
        phone: '0544 500 60 70',
        notes: 'Yetkili gaz yakıcı cihazlar servis belgemiz mevcuttur.'
      },
      {
        id: 'sp-2-2',
        name: 'KombiPro Teknik',
        businessName: 'KombiPro Isıtma Sistemleri',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        completedJobsCount: 1350,
        reviewCount: 420,
        price: 890,
        originalPrice: 1950,
        responseTime: 'Aynı Gün Servis',
        location: 'Avrupa Yakası Tümü',
        warrantyDays: 365,
        verifiedBadge: 'Kurumsal Onaylı',
        phone: '0212 400 99 88',
        notes: 'Rothenberger profesyonel makineli yıkama.'
      }
    ]
  },
  {
    id: 's-3',
    title: 'Kırmadan Termal Kameralı Su Kaçağı Tespiti',
    category: 'tamir',
    categoryLabel: 'Tesisat & Kaçak',
    shortDesc: 'Duvarı kırmadan, akustik dinleme cihazı ve termal kamera ile noktasal su kaçağı bulma ve tamiri.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 850,
    armutAveragePrice: 2200,
    savings: 1350,
    unit: 'tespit işlemi',
    guaranteeText: 'Noktasal tespit garantisi, bulunamazsa ücret alınmaz.',
    tags: ['su kaçağı', 'tesisatçı', 'boru patlağı', 'termal kamera', 'su sızıntısı', 'usta'],
    options: [
      { id: 'opt-3-1', label: 'Cihazla Noktasal Kaçak Tespiti', multiplier: 1.0, description: 'Termal kamera + akustik dinleme' },
      { id: 'opt-3-2', label: 'Kaçak Tespiti + Tek Nokta Boru Onarımı', multiplier: 1.7, description: '1 fayans kırılarak boru değişimi dahil' },
      { id: 'opt-3-3', label: 'Gider Tıkanıklığı Açma (Robotlu)', multiplier: 1.2, description: 'Kameralı robot cihazla pimaş açma' }
    ],
    providers: [
      {
        id: 'sp-3-1',
        name: 'Ahmet & Murat Usta',
        businessName: 'Uzman Termal Tesisat',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 1890,
        reviewCount: 510,
        price: 850,
        originalPrice: 2100,
        responseTime: '30 Dk İçinde Kapında (Acil)',
        location: 'Tüm İstanbul 7/24',
        warrantyDays: 180,
        verifiedBadge: 'Ustalık Belgeli',
        isCheapest: true,
        phone: '0535 777 88 99',
        notes: 'Alman Testo termal kamera kullanıyoruz. Kırmadan tespit garantili!'
      }
    ]
  },
  {
    id: 's-4',
    title: 'iPhone & Telefon Ekran & Batarya Değişimi (Adreste Servis)',
    category: 'elektronik',
    categoryLabel: 'Telefon & Elektronik',
    shortDesc: 'Gözünüzün önünde 20 dakikada orijinal revize ekran veya yüksek kapasiteli batarya montajı.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 1450,
    armutAveragePrice: 3800,
    savings: 2350,
    unit: 'parça + işçilik',
    guaranteeText: '6 Ay birebir parça değişim garantisi.',
    tags: ['iphone ekran', 'batarya değişimi', 'kadıköy telefon tamiri', 'ekran kırıldı', 'apple servis'],
    options: [
      { id: 'opt-4-1', label: 'iPhone 11 / 12 / 13 Orijinal Batarya', multiplier: 1.0, description: 'Deji Yüksek Kapasite veya Orijinal Çip' },
      { id: 'opt-4-2', label: 'iPhone 13 / 14 / 15 OLED Ekran', multiplier: 2.2, description: 'True Tone ve Dokunmatik Aktarımlı' },
      { id: 'opt-4-3', label: 'Arka Cam Lazerle Değişim', multiplier: 1.3, description: 'Kasa açılmadan lazerle söküm' }
    ],
    providers: [
      {
        id: 'sp-4-1',
        name: 'FixPoint Kadıköy',
        businessName: 'FixPoint Akıllı Cihaz Laboratuvarı',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 3400,
        reviewCount: 920,
        price: 1450,
        originalPrice: 3600,
        responseTime: 'Adrese Motorlu Kurye Servisi',
        location: 'Kadıköy Yazıcıoğlu İş Merkezi',
        warrantyDays: 180,
        verifiedBadge: 'Kurumsal Onaylı',
        isCheapest: true,
        phone: '0216 345 67 89',
        notes: 'Verileriniz sıfırlanmaz, yanınızda montaj yapılır.'
      }
    ]
  },
  {
    id: 's-5',
    title: 'Koltuk & Yatak Buharlı Derin Yıkama',
    category: 'temizlik',
    categoryLabel: 'Koltuk & Yatak',
    shortDesc: '85 derece sıcak buhar ve Kärcher endüstriyel vakumla mayt, leke ve koku temizliği.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 790,
    armutAveragePrice: 1700,
    savings: 910,
    unit: 'takım başı',
    guaranteeText: 'Kusma ve koku yapmama garantisi, kuruma süresi 3 saat.',
    tags: ['koltuk yıkama', 'yatak yıkama', 'buharlı temizlik', 'kärcher', 'leke çıkarma'],
    options: [
      { id: 'opt-5-1', label: 'L Koltuk (Köşe Takımı)', multiplier: 1.0, description: 'Tüm minderler dahil antibakteriyel yıkama' },
      { id: 'opt-5-2', label: 'Tam Koltuk Takımı (3+3+1)', multiplier: 1.45, description: '2 Büyük Kanepe + 1 Berjer' },
      { id: 'opt-5-3', label: 'Çift Kişilik Yatak (Ön + Arka)', multiplier: 0.9, description: 'Anti-Akar ultraviyole temizlik' }
    ],
    providers: [
      {
        id: 'sp-5-1',
        name: 'VakumMaster Hijyen',
        businessName: 'VakumMaster Profesyonel Yıkama',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        completedJobsCount: 1620,
        reviewCount: 480,
        price: 790,
        originalPrice: 1650,
        responseTime: 'Aynı Gün Randevu',
        location: 'Tüm İstanbul İlçeleri',
        warrantyDays: 7,
        verifiedBadge: 'Gariban Onaylı Esnaf',
        isCheapest: true,
        phone: '0538 900 11 22',
        notes: 'Kärcher Puzzi 10/1 profesyonel cihazlar kullanıyoruz.'
      }
    ]
  },
  {
    id: 's-6',
    title: 'Boya Badana (Oda Başı veya Komple Daire)',
    category: 'boya',
    categoryLabel: 'Boya & Badana',
    shortDesc: 'Eşyaların maskelenmesi, çatlak alçı tamiri, tavan boyası ve 2 kat Filli Boya / Jotun uygulama.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 8500,
    armutAveragePrice: 17500,
    savings: 9000,
    unit: 'daire başı',
    guaranteeText: 'Temiz teslimat garantisi, damlama ve leke bırakılmaz.',
    tags: ['boya badana', 'boyacı ustası', 'jotun', 'filli boya', 'ev boyama', 'tadilat'],
    options: [
      { id: 'opt-6-1', label: '1+1 Daire (Malzeme Dahil)', multiplier: 1.0, description: 'Tavan boyası + 2 kat silinebilir duvar boyası' },
      { id: 'opt-6-2', label: '2+1 Daire (Malzeme Dahil)', multiplier: 1.4, description: '2 günde tertemiz anahtar teslim' },
      { id: 'opt-6-3', label: '3+1 Daire (Malzeme Dahil)', multiplier: 1.85, description: '3 usta ile 2 günde teslim' }
    ],
    providers: [
      {
        id: 'sp-6-1',
        name: 'Halil Usta & Oğulları',
        businessName: 'Usta Eller Dekoratif Boya',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 780,
        reviewCount: 310,
        price: 8500,
        originalPrice: 16500,
        responseTime: 'Hemen Keşif İmkanı',
        location: 'İstanbul Geneli',
        warrantyDays: 730,
        verifiedBadge: 'Ustalık Belgeli',
        isCheapest: true,
        phone: '0542 333 44 55',
        notes: 'Tüm yerler kalın koruyucu naylonla kapatılır, tozsuz teslim edilir.'
      }
    ]
  },
  {
    id: 's-7',
    title: '7/24 Acil Çilingir & Kilit Değişimi',
    category: 'cilingir',
    categoryLabel: 'Çilingir & Kilit',
    shortDesc: 'Kapıda kalma durumunda kırmadan 15 dakikada motorlu ekip ile kapı açma ve Kale kilit montajı.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 500,
    armutAveragePrice: 1400,
    savings: 900,
    unit: 'müdahale başı',
    guaranteeText: 'Kapıya veya kilit mekanizmasına sıfır hasar garantisi.',
    tags: ['çilingir', 'kale kilit', 'kapıda kaldım', 'acil çilingir', 'kilit değiştirme'],
    options: [
      { id: 'opt-7-1', label: 'Kilitli Olmayan Kapı Açma (Dilli)', multiplier: 1.0, description: 'Röntgen filmi ve aparat ile hasarsız açım' },
      { id: 'opt-7-2', label: 'Kilitli Çelik Kapı Açma + Bilyalı Göbek', multiplier: 1.8, description: 'Kale Kilit 3 anahtarlı yeni göbek dahil' },
      { id: 'opt-7-3', label: 'Tuzaklı / Hırsız Kırmaz Kilit Montajı', multiplier: 2.3, description: 'Yüksek güvenlikli çelik rozet + kilit' }
    ],
    providers: [
      {
        id: 'sp-7-1',
        name: 'Şimşek Çilingir 7/24',
        businessName: 'Şimşek Anahtar & Güvenlik Sistemleri',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        completedJobsCount: 2800,
        reviewCount: 840,
        price: 500,
        originalPrice: 1350,
        responseTime: '15 Dakikada Kapında (Motorlu)',
        location: 'Kadıköy, Üsküdar, Ataşehir, Beşiktaş',
        warrantyDays: 365,
        verifiedBadge: 'Ustalık Belgeli',
        isCheapest: true,
        phone: '0533 999 00 11',
        notes: 'Çilingirler Odası onaylı kimlik kartlı personel.'
      }
    ]
  },
  {
    id: 's-8',
    title: 'Şehir İçi Parça Eşya Taşıma & Küçük Kamyonet',
    category: 'nakliyat',
    categoryLabel: 'Nakliyat & Kamyonet',
    shortDesc: 'Büyük nakliye şirketlerine binlerce lira ödemeden; koltuk, beyaz eşya, öğrenci evi eşyası taşıma.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    baseFloorPrice: 1400,
    armutAveragePrice: 3200,
    savings: 1800,
    unit: 'sefer başı',
    guaranteeText: 'Taşıma esnasında eşya güvenliği ve battaniyeli koruma.',
    tags: ['nakliyat', 'kamyonet kiralama', 'parça eşya taşıma', 'öğrenci nakliye', 'ikea taşıma'],
    options: [
      { id: 'opt-8-1', label: 'Sadece Araç & Şoför (Yükleme Size Ait)', multiplier: 1.0, description: 'Kapıdan kapıya Ford Transit kamyonet' },
      { id: 'opt-8-2', label: 'Araç + 1 Taşıyıcı Personel', multiplier: 1.55, description: 'Eşyaların taşınması ve yerleştirilmesi dahil' },
      { id: 'opt-8-3', label: 'Araç + 2 Taşıyıcı + Streç & Demontaj', multiplier: 2.1, description: 'Tam donanımlı montaj ve paketleme dahil' }
    ],
    providers: [
      {
        id: 'sp-8-1',
        name: 'Mustafa Bey (Transit Nakliye)',
        businessName: 'Hızlı Parça Nakliyat Express',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        completedJobsCount: 1150,
        reviewCount: 390,
        price: 1400,
        originalPrice: 3100,
        responseTime: 'Hemen Çağır',
        location: 'İstanbul İçi Her İki Yaka',
        warrantyDays: 1,
        verifiedBadge: 'Gariban Onaylı Esnaf',
        isCheapest: true,
        phone: '0541 222 33 44',
        notes: 'Kapalı kasa temiz araç. Mobilyalar battaniye ve balonlu naylonla sarılır.'
      }
    ]
  }
];
