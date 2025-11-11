// Performance monitoring utilities
import React from 'react';

export interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

function getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Web Vitals observer
export function observeWebVitals(onMetric: (metric: PerformanceMetrics) => void) {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        
        onMetric({
          name: 'LCP',
          value,
          rating: getRating(value, THRESHOLDS.LCP),
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const value = (entry as any).processingStart - entry.startTime;
          onMetric({
            name: 'FID',
            value,
            rating: getRating(value, THRESHOLDS.FID),
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        onMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating(clsValue, THRESHOLDS.CLS),
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          onMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating(entry.startTime, THRESHOLDS.FCP),
          });
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer not supported');
    }
  }

  // Time to First Byte (using Navigation Timing API)
  if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        onMetric({
          name: 'TTFB',
          value: ttfb,
          rating: getRating(ttfb, THRESHOLDS.TTFB),
        });
      }
    });
  }
}

// Performance timing utilities
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    console.log(`⏱️ ${this.name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Image loading performance
export function trackImageLoad(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`🖼️ Image loaded: ${src} (${loadTime.toFixed(2)}ms)`);
      resolve();
    };
    
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      console.error(`❌ Image failed to load: ${src} (${loadTime.toFixed(2)}ms)`);
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
}

// Memory usage monitoring
export function getMemoryUsage(): { used: number; total: number; percentage: number } | null {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
  };
}

// Bundle size analyzer (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.group('📦 Bundle Analysis');
  
  scripts.forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (src.includes('/_next/')) {
      console.log(`JS: ${src.split('/').pop()}`);
    }
  });
  
  styles.forEach((style) => {
    const href = (style as HTMLLinkElement).href;
    if (href.includes('/_next/')) {
      console.log(`CSS: ${href.split('/').pop()}`);
    }
  });
  
  console.groupEnd();
}

// React component performance wrapper
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    const timer = new PerformanceTimer(`${componentName} render`);
    
    React.useEffect(() => {
      timer.end();
    });

    return React.createElement(Component, props);
  };
}