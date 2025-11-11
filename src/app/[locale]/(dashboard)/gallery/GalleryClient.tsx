'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePhotos } from '@/hooks/usePhotos';
import { useCart } from '@/hooks/useCart';
import { PhotoGallery } from '@/components/photo/PhotoGallery';
import { GalleryFilters } from '@/components/photo/GalleryFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Photo } from '@/types';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GalleryClient() {
  const t = useTranslations();
  const { toast } = useToast();
  
  // Filter states
  const [aiTool, setAiTool] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  
  // Batch selection states
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  // Fetch photos with current filters
  const { photos, loading, error, refetch } = usePhotos({
    aiTool: aiTool === 'all' ? undefined : aiTool,
    sortBy: sortBy as 'newest' | 'oldest' | 'alphabetical',
    search: search || undefined
  });

  // Cart functionality
  const { addToCart } = useCart();

  const handlePhotoSelect = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(p => p.id));
    }
  };

  const handleAddToCart = async (photo: Photo) => {
    try {
      await addToCart(photo.id);
      toast({
        title: t('cart.itemAdded'),
        description: `${photo.title} ${t('cart.itemAdded').toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('cart.addError'),
        variant: 'destructive',
      });
    }
  };

  const handleBatchAddToCart = async () => {
    try {
      const selectedPhotoObjects = photos.filter(p => selectedPhotos.includes(p.id));
      
      // Add each selected photo to cart
      for (const photo of selectedPhotoObjects) {
        await addToCart(photo.id);
      }
      
      setSelectedPhotos([]);
      toast({
        title: t('cart.itemAdded'),
        description: `${selectedPhotos.length} ${t('gallery.photos')} ${t('cart.itemAdded').toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('cart.addError'),
        variant: 'destructive',
      });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm(t('gallery.deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      toast({
        title: t('gallery.deletePhoto'),
        description: t('gallery.photoDeleted'),
      });

      // Remove from selected photos if it was selected
      setSelectedPhotos(prev => prev.filter(id => id !== photoId));
      
      // Refetch photos
      refetch();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('gallery.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`${t('gallery.deleteConfirm')} (${selectedPhotos.length} ${t('gallery.photos')})`)) {
      return;
    }

    try {
      // Delete each selected photo
      for (const photoId of selectedPhotos) {
        await fetch(`/api/photos/${photoId}`, {
          method: 'DELETE',
        });
      }

      toast({
        title: t('gallery.deletePhoto'),
        description: `${selectedPhotos.length} ${t('gallery.photos')} ${t('gallery.deleted')}`,
      });

      setSelectedPhotos([]);
      refetch();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('gallery.deleteError'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch}>{t('common.retry')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('gallery.title')}
        </h1>
        
        {photos.length > 0 && (
          <div className="flex items-center gap-4">
            <Button
              variant={showBatchActions ? "default" : "outline"}
              onClick={() => {
                setShowBatchActions(!showBatchActions);
                setSelectedPhotos([]);
              }}
            >
              {showBatchActions ? t('common.cancel') : t('gallery.batchActions')}
            </Button>
          </div>
        )}
      </div>

      {/* Batch Actions Bar */}
      {showBatchActions && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAll}
                >
                  {selectedPhotos.length === photos.length ? t('gallery.deselectAll') : t('gallery.selectAll')}
                </Button>
                
                {selectedPhotos.length > 0 && (
                  <Badge variant="secondary">
                    {selectedPhotos.length} {t('gallery.selectedCount')}
                  </Badge>
                )}
              </div>

              {selectedPhotos.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleBatchAddToCart}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t('gallery.addSelectedToCart')}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBatchDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <GalleryFilters
        aiTool={aiTool}
        sortBy={sortBy}
        search={search}
        onAiToolChange={setAiTool}
        onSortByChange={setSortBy}
        onSearchChange={setSearch}
        photoCount={photos.length}
      />

      {/* Gallery */}
      <div className="mt-8">
        <PhotoGallery
          photos={photos}
          onAddToCart={handleAddToCart}
          onDeletePhoto={handleDeletePhoto}
          selectedPhotos={selectedPhotos}
          onPhotoSelect={showBatchActions ? handlePhotoSelect : undefined}
          showBatchActions={showBatchActions}
        />
      </div>
    </div>
  );
}