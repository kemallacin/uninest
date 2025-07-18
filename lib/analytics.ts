// Performance monitoring ve analytics utility'leri

interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

interface CustomEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private customEvents: CustomEvent[] = [];

  private constructor() {
    this.initWebVitals();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initWebVitals() {
    if (typeof window !== 'undefined') {
      // Core Web Vitals monitoring
      this.measureFCP();
      this.measureLCP();
      this.measureFID();
      this.measureCLS();
      this.measureTTFB();
    }
  }

  private measureFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.FCP = fcpEntry.startTime;
          this.logMetric('FCP', fcpEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  private measureLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.LCP = lastEntry.startTime;
          this.logMetric('LCP', lastEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private measureFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const firstInputEntry = entry as PerformanceEventTiming;
          this.metrics.FID = firstInputEntry.processingStart - firstInputEntry.startTime;
          this.logMetric('FID', this.metrics.FID);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private measureCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        this.metrics.CLS = clsValue;
        this.logMetric('CLS', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private measureTTFB() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
        this.logMetric('TTFB', this.metrics.TTFB);
      }
    }
  }

  private logMetric(name: string, value: number) {
    console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    
    // Google Analytics'e gönder (isteğe bağlı)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  }

  public trackCustomEvent(event: Omit<CustomEvent, 'timestamp'>) {
    const customEvent: CustomEvent = {
      ...event,
      timestamp: Date.now(),
    };
    
    this.customEvents.push(customEvent);
    
    console.log(`📈 Custom Event: ${event.name}`, event);
    
    // Google Analytics'e gönder
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  public trackPageView(page: string) {
    this.trackCustomEvent({
      name: 'page_view',
      category: 'Navigation',
      action: 'page_view',
      label: page,
    });
  }

  public trackUserAction(action: string, category: string, label?: string) {
    this.trackCustomEvent({
      name: 'user_action',
      category,
      action,
      label,
    });
  }

  public trackError(error: Error, context?: string) {
    this.trackCustomEvent({
      name: 'error',
      category: 'Error',
      action: 'error_occurred',
      label: `${error.name}: ${error.message}`,
    });
    
    console.error(`❌ Error tracked:`, { error: error.message, context });
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getCustomEvents(): CustomEvent[] {
    return [...this.customEvents];
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    const events = this.getCustomEvents();
    
    return `
📊 Performance Report
====================
Core Web Vitals:
${Object.entries(metrics).map(([key, value]) => `  ${key}: ${value?.toFixed(2)}ms`).join('\n')}

Custom Events (${events.length}):
${events.map(event => `  ${event.timestamp}: ${event.name} - ${event.category}/${event.action}`).join('\n')}
    `.trim();
  }
}

// Global instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions
export const trackPageView = (page: string) => performanceMonitor.trackPageView(page);
export const trackUserAction = (action: string, category: string, label?: string) => 
  performanceMonitor.trackUserAction(action, category, label);
export const trackError = (error: Error, context?: string) => 
  performanceMonitor.trackError(error, context);

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  return {
    trackPageView,
    trackUserAction,
    trackError,
    getMetrics: () => performanceMonitor.getMetrics(),
    getCustomEvents: () => performanceMonitor.getCustomEvents(),
    generateReport: () => performanceMonitor.generateReport(),
  };
};

// Auto-initialize
if (typeof window !== 'undefined') {
  // Sayfa yüklendiğinde otomatik olarak page view track et
  performanceMonitor.trackPageView(window.location.pathname);
  
  // Error tracking
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error, 'window_error');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), 'unhandled_rejection');
  });
} 