'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page load performance
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      
      // Log performance data in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Page Load Performance - ${pathname}:`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && loadTime > 3000) {
        // Log slow pages
        console.warn(`⚠️ Slow page load detected: ${pathname} (${loadTime.toFixed(2)}ms)`);
      }
    };

    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(handleLoad);
    } else {
      setTimeout(handleLoad, 0);
    }

    // Track navigation performance
    return () => {
      const navigationTime = performance.now() - startTime;
      if (navigationTime > 1000) {
        console.warn(`⚠️ Slow navigation: ${pathname} (${navigationTime.toFixed(2)}ms)`);
      }
    };
  }, [pathname]);

  return null; // This component doesn't render anything
} 