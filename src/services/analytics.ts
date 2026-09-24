import { GA4EventPayload } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

type EventListener = (events: GA4EventPayload[]) => void;

class AnalyticsManager {
  private events: GA4EventPayload[] = [];
  private listeners: Set<EventListener> = new Set();
  private measurementId: string = 'G-MERC2026DEV';
  private isConnected: boolean = false;

  constructor() {
    // Check saved measurement ID from localStorage
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('gms_ga4_measurement_id');
      if (savedId) {
        this.measurementId = savedId;
        this.initGtag(savedId);
      }
      // Initialize mock or real dataLayer
      window.dataLayer = window.dataLayer || [];
    }
  }

  public setMeasurementId(id: string) {
    this.measurementId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gms_ga4_measurement_id', id);
      this.initGtag(id);
    }
  }

  public getMeasurementId(): string {
    return this.measurementId;
  }

  public getEvents(): GA4EventPayload[] {
    return [...this.events];
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    listener(this.getEvents());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const eventList = this.getEvents();
    this.listeners.forEach((l) => l(eventList));
  }

  public clearEvents() {
    this.events = [];
    this.notify();
  }

  private initGtag(id: string) {
    if (typeof window === 'undefined' || !id || id.trim() === '') return;
    try {
      // Inject Google Analytics tag if not already present
      const scriptId = 'ga4-gtag-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        document.head.appendChild(script);
      } else {
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false });
      this.isConnected = true;
    } catch (e) {
      console.warn('Could not initialize gtag.js:', e);
    }
  }

  private recordEvent(event: GA4EventPayload['event'], params: Record<string, any>) {
    const payload: GA4EventPayload = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event,
      params,
      status: 'dispatched',
    };

    this.events.unshift(payload);
    // Keep max 100 recent events
    if (this.events.length > 100) {
      this.events = this.events.slice(0, 100);
    }

    // Push to browser dataLayer
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event,
          ...params,
        });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, params);
      }
    }

    this.notify();
  }

  // --- PRD Specified GA4 Events ---

  // 1. page_view: Opens page -> page_path
  public trackPageView(pagePath: string) {
    this.recordEvent('page_view', {
      page_path: pagePath,
    });
  }

  // 2. search: Searches product -> search_term
  public trackSearch(searchTerm: string) {
    this.recordEvent('search', {
      search_term: searchTerm,
    });
  }

  // 3. select_category: Selects category -> category_name
  public trackSelectCategory(categoryName: string) {
    this.recordEvent('select_category', {
      category_name: categoryName,
    });
  }

  // 4. select_item: Opens product -> item_id, item_name
  public trackSelectItem(itemId: string, itemName: string) {
    this.recordEvent('select_item', {
      item_id: itemId,
      item_name: itemName,
    });
  }

  // 5. add_to_wishlist: Saves product -> item_id, price
  public trackAddToWishlist(itemId: string, price: number) {
    this.recordEvent('add_to_wishlist', {
      item_id: itemId,
      price: price,
    });
  }

  // 6. add_to_cart: Adds product -> item_id, value, currency
  public trackAddToCart(itemId: string, value: number, currency: string = 'INR') {
    this.recordEvent('add_to_cart', {
      item_id: itemId,
      value: value,
      currency: currency,
    });
  }

  // 7. select_promotion: Clicks banner -> promotion_name
  public trackSelectPromotion(promotionName: string) {
    this.recordEvent('select_promotion', {
      promotion_name: promotionName,
    });
  }

  // 8. view_cart: Opens cart -> value, items
  public trackViewCart(value: number, items: any[]) {
    this.recordEvent('view_cart', {
      value: value,
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
      })),
    });
  }

  // 9. begin_checkout: Starts checkout -> value, items
  public trackBeginCheckout(value: number, items: any[]) {
    this.recordEvent('begin_checkout', {
      value: value,
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
      })),
    });
  }

  // 10. purchase: Completes purchase -> transaction_id, value
  public trackPurchase(transactionId: string, value: number) {
    this.recordEvent('purchase', {
      transaction_id: transactionId,
      value: value,
    });
  }
}

export const analytics = new AnalyticsManager();
