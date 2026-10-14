export interface StoreOffer {
  id: string;
  storeName: 'Trendyol' | 'Hepsiburada' | 'Amazon TR' | 'N11' | 'Teknosa' | 'MediaMarkt' | 'Vatan Bilgisayar' | 'Pazarama' | 'Migros' | 'A101';
  storeLogo?: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewCount: number;
  price: number;
  originalPrice?: number;
  shippingFee: number; // 0 = Ücretsiz
  shippingTime: string; // e.g. "Yarın Kapında", "2 Günde Kargo"
  installments: string; // e.g. "Peşin fiyatına 3 taksit"
  inStock: boolean;
  affiliateUrl: string;
  badge?: 'En Ucuz' | 'Hızlı Kargo' | 'Resmi Satıcı' | 'Puanı Yüksek';
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  store: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  brand: string;
  image: string;
  rating: number;
  reviewCount: number;
  garibanScore: number; // 0 to 10
  garibanVerdict: 'Efsane Kelepir' | 'Fiyatı Uygun' | 'Normal Fiyat' | 'Fiyatı Şişirilmiş / Bekle';
  aiAdvice: string;
  lowestPrice: number;
  highestPrice: number;
  previousPrice?: number;
  discountPercentage?: number;
  storesCount: number;
  freeShippingAvailable: boolean;
  offers: StoreOffer[];
  priceHistory: {
    labels: string[];
    prices: number[];
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
  };
  specs: Record<string, string>;
  isKelepir?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  popularSearch: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  brand: string;
  unit: string;
  image: string;
  prices: {
    migros: number;
    carrefour: number;
    sok: number;
    a101: number;
  };
  cheapestStore: string;
}

export interface Coupon {
  id: string;
  store: string;
  title: string;
  code: string;
  discount: string;
  minSpend: string;
  expires: string;
  verifiedToday: boolean;
}

// -------------------------------------------------------------
// Armut + Cimri Fusion: Hizmet & Usta Karşılaştırma Modelleri
// -------------------------------------------------------------

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  rating: number;
  completedJobsCount: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  responseTime: string; // e.g. "20 Dk İçinde Kapında"
  location: string; // e.g. "Kadıköy / İstanbul (2.4 km)"
  warrantyDays: number; // e.g. 180 (6 ay işçilik garantisi)
  verifiedBadge: 'Ustalık Belgeli' | 'Kurumsal Onaylı' | 'Gariban Onaylı Esnaf';
  isCheapest?: boolean;
  phone: string;
  notes: string;
}

export interface ServiceOption {
  id: string;
  label: string;
  multiplier: number; // e.g. 1.0 for 1+1, 1.4 for 2+1, 1.8 for 3+1
  description?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'temizlik' | 'tamir' | 'elektronik' | 'nakliyat' | 'cilingir' | 'boya';
  categoryLabel: string;
  shortDesc: string;
  image: string;
  baseFloorPrice: number; // Gariban en ucuz taban fiyatı
  armutAveragePrice: number; // Armut / piyasa şişirilmiş ortalaması
  savings: number;
  unit: string; // e.g. "seans başı", "aralık başı", "saatlik"
  options: ServiceOption[];
  providers: ServiceProvider[];
  guaranteeText: string;
  tags: string[];
}
