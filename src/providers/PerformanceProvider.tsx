'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { observeWebVitals, PerformanceMetrics, getMemoryUsage } from '@/lib/performance';

interface PerformanceContextType {
  metrics: PerformanceMetrics[];
  memoryUsage: { used: number; total: number; percentage: number } | null;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}

interface PerformanceProviderProps {
  children: ReactNode;
  enableInProduction?: boolean;
}

export function PerformanceProvider({ 
  children, 
  enableInProduction = false 
}: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; percentage: number } | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Only enable monitoring in development or when explicitly enabled in production
  const shouldMonitor = process.env.NODE_ENV === 'development' || enableInProduction;

  const startMonitoring = () => {
    if (!shouldMonitor) return;
    
    setIsMonitoring(true);
    
    // Start Web Vitals monitoring
    observeWebVitals((metric) => {
      setMetrics(prev => {
        const existing = prev.find(m => m.name === metric.name);
        if (existing) {
          return prev.map(m => m.name === metric.name ? metric : m);
        }
        return [...prev, metric];
      });
    });

    // Monitor memory usage every 5 seconds
    const memoryInterval = setInterval(() => {
      const usage = getMemoryUsage();
      if (usage) {
        setMemoryUsage(usage);
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(memoryInterval);
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (shouldMonitor) {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [shouldMonitor]);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && metrics.length > 0) {
      console.group('🚀 Performance Metrics');
      metrics.forEach(metric => {
        const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
        console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
      });
      
      if (memoryUsage) {
        const memoryMB = (memoryUsage.used / 1024 / 1024).toFixed(2);
        const totalMB = (memoryUsage.total / 1024 / 1024).toFixed(2);
        console.log(`🧠 Memory: ${memoryMB}MB / ${totalMB}MB (${memoryUsage.percentage.toFixed(1)}%)`);
      }
      
      console.groupEnd();
    }
  }, [metrics, memoryUsage]);

  const value: PerformanceContextType = {
    metrics,
    memoryUsage,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}