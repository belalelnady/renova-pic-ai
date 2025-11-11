import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GalleryClient } from './GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('gallery');
  
  return {
    title: t('title'),
  };
}

export default function GalleryPage() {
  return <GalleryClient />;
}