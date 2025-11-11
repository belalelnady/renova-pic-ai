'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Photo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';

// Lazy load the slideshow component
const PhotoSlideshow = lazy(() => 
  import('@/components/photo/PhotoSlideshow').then(module => ({ 
    default: module.PhotoSlideshow 
  }))
);

interface PhotoGalleryProps {
  photos: Photo[];
  onAddToCart?: (photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;
  selectedPhotos?: string[];
  onPhotoSelect?: (photoId: string) => void;
  showBatchActions?: boolean;
}

export function PhotoGallery({ 
  photos, 
  onAddToCart, 
  onDeletePhoto,
  selectedPhotos = [],
  onPhotoSelect,
  showBatchActions = false
}: PhotoGalleryProps) {
  const t = useTranslations();
  const [slideshowPhoto, setSlideshowPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    setSlideshowPhoto(photo);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getAiToolLabel = (aiTool: string) => {
    switch (aiTool) {
      case 'visa':
        return t('photo.visaPhoto');
      case 'absher':
        return t('photo.absherPhoto');
      case 'saudi-look':
        return t('photo.saudiLook');
      case 'baby':
        return t('photo.babyPhoto');
      default:
        return aiTool;
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('gallery.empty')}
        </h3>
        <p className="text-gray-500">
          {t('gallery.emptyDescription')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="group overflow-hidden">
            <CardContent className="p-0">
              {/* Photo Image */}
              <div className="relative aspect-square">
                <Image
                  src={photo.thumbnailUrl || photo.editedUrl || photo.originalUrl}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={false}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                
                {/* Selection Checkbox */}
                {showBatchActions && onPhotoSelect && (
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => onPhotoSelect(photo.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePhotoClick(photo)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {photo.editedUrl && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(photo.editedUrl!, `${photo.title}-edited.jpg`)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {onAddToCart && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onAddToCart(photo)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm truncate flex-1">
                    {photo.title}
                  </h3>
                  {onDeletePhoto && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeletePhoto(photo.id)}
                      className="text-red-500 hover:text-red-700 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {getAiToolLabel(photo.aiTool)}
                  </Badge>
                  <span className="text-sm font-medium text-green-600">
                    ${photo.price.toString()}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slideshow Modal */}
      {slideshowPhoto && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>}>
          <PhotoSlideshow
            photo={slideshowPhoto}
            photos={photos}
            onClose={() => setSlideshowPhoto(null)}
            onAddToCart={onAddToCart}
            onDeletePhoto={onDeletePhoto}
          />
        </Suspense>
      )}
    </>
  );
}