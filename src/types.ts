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
  garibanScore: number; // 0 to 10 (e.g. 9.6: "Efsane Kelepir", 7.5: "Fiyatı Normal", 4.2: "Pahalı/Şişirilmiş")
  garibanVerdict: 'Efsane Kelepir' | 'Fiyatı Uygun' | 'Normal Fiyat' | 'Fiyatı Şişirilmiş / Bekle';
  aiAdvice: string;
  lowestPrice: number;
  highestPrice: number;
  previousPrice?: number; // for discount calculations
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
  isKelepir?: boolean; // Günün kelepiri
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
