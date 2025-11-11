'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Locale = 'en' | 'ar';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLocale 
}: { 
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  const isRTL = locale === 'ar';

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Store preference in localStorage
    localStorage.setItem('preferred-locale', newLocale);
    
    // Update document direction
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    
    // Navigate to new locale path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  useEffect(() => {
    // Set initial document direction and language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}