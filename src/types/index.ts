export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: 't-shirts' | 'hoodies' | 'accessories' | 'drinkware' | 'collectibles';
  gender: 'men' | 'women' | 'unisex';
  collection: 'google-originals' | 'tech-culture' | 'pixel-collection' | 'android-world' | 'work-play';
  price: number; // in INR ₹
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badges?: ('TRENDING' | 'BESTSELLER' | 'NEW' | 'LIMITED DROP')[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  isNewArrival?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
  description: string;
  material: string;
  fit: string;
  colors: { name: string; hex: string }[];
  sku: string;
}

export interface CartItem {
  product: Product;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export type NavigationTab = 'home' | 'men' | 'women' | 'accessories' | 'collections' | 'new-arrivals' | 'sale' | 'catalog';

export interface GA4EventPayload {
  id: string;
  timestamp: string;
  event: 
    | 'page_view'
    | 'search'
    | 'select_category'
    | 'select_item'
    | 'add_to_wishlist'
    | 'add_to_cart'
    | 'select_promotion'
    | 'view_cart'
    | 'begin_checkout'
    | 'purchase';
  params: Record<string, any>;
  status: 'dispatched' | 'buffered';
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  priceRange: string;
  gender: string;
  collection: string;
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high';
  searchQuery: string;
}
