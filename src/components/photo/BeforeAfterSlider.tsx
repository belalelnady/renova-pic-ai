'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  RotateCcw, 
  Maximize2, 
  SplitSquareHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  originalUrl: string;
  editedUrl: string;
  originalTitle?: string;
  editedTitle?: string;
  className?: string;
  onDownloadOriginal?: () => void;
  onDownloadEdited?: () => void;
}

type ViewMode = 'slider' | 'side-by-side' | 'original-only' | 'edited-only';

export function BeforeAfterSlider({
  originalUrl,
  editedUrl,
  originalTitle = 'Original',
  editedTitle = 'Edited',
  className,
  onDownloadOriginal,
  onDownloadEdited,
}: BeforeAfterSliderProps) {
  const t = useTranslations('photo');
  
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const resetSlider = () => {
    setSliderPosition(50);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderSliderView = () => (
    <div
      ref={containerRef}
      className="relative w-full h-96 overflow-hidden rounded-lg cursor-col-resize select-none"
    >
      {/* Edited Image (Background) */}
      <img
        src={editedUrl}
        alt={editedTitle}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Original Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt={originalTitle}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      
      {/* Slider Handle */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <SplitSquareHorizontal className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/70 text-white">
          {t('original')}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-black/70 text-white">
          {t('edited')}
        </Badge>
      </div>
    </div>
  );

  const renderSideBySideView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{t('original')}</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadOriginal}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={originalUrl}
            alt={originalTitle}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{t('edited')}</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadEdited}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={editedUrl}
            alt={editedTitle}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );

  const renderSingleView = (url: string, title: string, isOriginal: boolean) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={isOriginal ? onDownloadOriginal : onDownloadEdited}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={url}
          alt={title}
          className="w-full h-96 object-cover"
        />
      </div>
    </div>
  );

  const getViewModeContent = () => {
    switch (viewMode) {
      case 'slider':
        return renderSliderView();
      case 'side-by-side':
        return renderSideBySideView();
      case 'original-only':
        return renderSingleView(originalUrl, t('original'), true);
      case 'edited-only':
        return renderSingleView(editedUrl, t('edited'), false);
      default:
        return renderSliderView();
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{t('beforeAfter')}</CardTitle>
          
          {/* View Mode Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'slider' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('slider')}
              className="flex items-center gap-2"
            >
              <SplitSquareHorizontal className="w-4 h-4" />
              Slider
            </Button>
            
            <Button
              variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('side-by-side')}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Side by Side
            </Button>
            
            <Button
              variant={viewMode === 'original-only' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('original-only')}
              title="Original Only"
            >
              O
            </Button>
            
            <Button
              variant={viewMode === 'edited-only' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('edited-only')}
              title="Edited Only"
            >
              E
            </Button>
            
            {viewMode === 'slider' && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetSlider}
                title="Reset Slider"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {getViewModeContent()}
        
        {/* Slider Position Indicator */}
        {viewMode === 'slider' && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Drag the slider to compare • Position: {Math.round(sliderPosition)}%</p>
          </div>
        )}
        
        {/* Download All Button */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onDownloadOriginal}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Original
          </Button>
          <Button
            onClick={onDownloadEdited}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Edited
          </Button>
        </div>
      </CardContent>
      
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-full">
            <Button
              variant="outline"
              className="absolute top-4 right-4 z-10"
              onClick={toggleFullscreen}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
            
            <div className="w-full h-full">
              {viewMode === 'slider' ? (
                <div
                  ref={containerRef}
                  className="relative w-full h-full overflow-hidden cursor-col-resize select-none"
                >
                  <img
                    src={editedUrl}
                    alt={editedTitle}
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                  />
                  
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={originalUrl}
                      alt={originalTitle}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <SplitSquareHorizontal className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getViewModeContent()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}