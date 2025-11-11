'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Photo } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ShoppingCart, 
  Trash2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import Image from 'next/image';

interface PhotoSlideshowProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onAddToCart?: (photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;
}

export function PhotoSlideshow({ 
  photo, 
  photos, 
  onClose, 
  onAddToCart, 
  onDeletePhoto 
}: PhotoSlideshowProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Find current photo index
  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setCurrentIndex(index);
  }, [photo.id, photos]);

  const currentPhoto = photos[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium">{currentPhoto.title}</h2>
            <Badge variant="secondary">
              {getAiToolLabel(currentPhoto.aiTool)}
            </Badge>
            <span className="text-sm opacity-75">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsZoomed(!isZoomed)}
              className="text-white hover:bg-white/20"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </Button>
            
            {currentPhoto.originalUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(currentPhoto.originalUrl, `${currentPhoto.title}-original.jpg`)}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-1" />
                {t('gallery.downloadOriginal')}
              </Button>
            )}
            
            {currentPhoto.editedUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(currentPhoto.editedUrl!, `${currentPhoto.title}-edited.jpg`)}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-1" />
                {t('gallery.downloadEdited')}
              </Button>
            )}
            
            {onAddToCart && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddToCart(currentPhoto)}
                className="text-white hover:bg-white/20"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {t('print.addToCart')}
              </Button>
            )}
            
            {onDeletePhoto && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeletePhoto(currentPhoto.id)}
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <Button
            size="lg"
            variant="ghost"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-16">
        <div className={`relative ${isZoomed ? 'w-full h-full' : 'max-w-4xl max-h-full'}`}>
          <Image
            src={currentPhoto.editedUrl || currentPhoto.originalUrl}
            alt={currentPhoto.title}
            fill
            className={`object-contain ${isZoomed ? 'object-cover cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
            priority
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-4">
            <span>{t('print.size')}: {currentPhoto.printSize}</span>
            <span>{t('print.price')}: ${currentPhoto.price.toString()}</span>
          </div>
          <span className="opacity-75">
            {new Date(currentPhoto.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}