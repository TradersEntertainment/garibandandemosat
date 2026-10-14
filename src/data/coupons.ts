import { Coupon } from '../types';

export const POPULAR_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    store: 'Amazon TR',
    title: 'İlk Alışverişe Özel Prime İndirimi',
    code: 'GARIBANAMAZON150',
    discount: '150 ₺',
    minSpend: '750 ₺ ve üzeri',
    expires: 'Kalan süre: 2 gün',
    verifiedToday: true,
  },
  {
    id: 'c-2',
    store: 'Trendyol',
    title: 'Elektronik & Küçük Ev Aletleri Sepette Net İndirim',
    code: 'GARIBAN500',
    discount: '500 ₺',
    minSpend: '3.000 ₺ ve üzeri',
    expires: 'Bugün son gün',
    verifiedToday: true,
  },
  {
    id: 'c-3',
    store: 'Hepsiburada',
    title: 'Premium Üyelere Özel Süpermarket Fırsatı',
    code: 'HEPSIYUDUM100',
    discount: '100 ₺',
    minSpend: '500 ₺ ve üzeri',
    expires: 'Kalan süre: 4 gün',
    verifiedToday: true,
  },
  {
    id: 'c-4',
    store: 'N11',
    title: 'Uçuran Kupon Festivali',
    code: 'N11KUPON250',
    discount: '250 ₺',
    minSpend: '1.500 ₺ ve üzeri',
    expires: 'Kalan süre: 12 saat',
    verifiedToday: true,
  },
  {
    id: 'c-5',
    store: 'Teknosa',
    title: 'Web Özel Kulaklık & Aksesuar İndirimi',
    code: 'TEKNO75',
    discount: '75 ₺',
    minSpend: '400 ₺ ve üzeri',
    expires: 'Kalan süre: 6 gün',
    verifiedToday: true,
  }
];
