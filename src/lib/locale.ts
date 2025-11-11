import { headers } from 'next/headers';

export type Locale = 'en' | 'ar';

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (isValidLocale(potentialLocale)) {
    return potentialLocale;
  }
  
  return defaultLocale;
}

export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && isValidLocale(segments[1])) {
    segments.splice(1, 1);
  }
  return segments.join('/') || '/';
}

export function addLocaleToPath(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(pathname);
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

export function detectLocale(): Locale {
  // Try to get locale from browser preferences
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('preferred-locale');
    if (stored && isValidLocale(stored)) {
      return stored;
    }
    
    const browserLocale = navigator.language.split('-')[0];
    if (isValidLocale(browserLocale)) {
      return browserLocale;
    }
  }
  
  // Server-side detection from headers
  try {
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().split('-')[0]);
      
      for (const lang of languages) {
        if (isValidLocale(lang)) {
          return lang;
        }
      }
    }
  } catch (error) {
    // Headers not available in client-side context
  }
  
  return defaultLocale;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}