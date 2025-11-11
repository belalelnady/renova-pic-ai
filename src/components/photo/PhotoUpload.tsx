'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Camera, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  onUploadComplete?: (file: File, url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function PhotoUpload({
  onUploadComplete,
  onUploadError,
  className,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: PhotoUploadProps) {
  const t = useTranslations('photo');
  const { toast } = useToast();
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return t('fileTypeError');
    }
    
    // Check file size (convert MB to bytes)
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return t('fileSizeError');
    }
    
    return null;
  }, [acceptedTypes, maxSizeInMB, t]);

  const createPreview = useCallback((file: File) => {
    // Create a compressed preview for better performance
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Calculate dimensions for preview (max 400px width)
        const maxWidth = 400;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw compressed image
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            resolve(url);
          } else {
            // Fallback to original file
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            resolve(url);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => {
        // Fallback to original file
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        resolve(url);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [previewUrl]);

  const simulateUpload = useCallback(async (file: File): Promise<string> => {
    // Simulate upload progress
    setUploadProgress(0);
    
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 20;
          if (next >= 100) {
            clearInterval(interval);
            // Simulate successful upload with a blob URL for now
            // In real implementation, this would be the actual uploaded file URL
            const uploadedUrl = URL.createObjectURL(file);
            resolve(uploadedUrl);
            return 100;
          }
          return next;
        });
      }, 100);
      
      // Simulate potential upload failure (5% chance)
      setTimeout(() => {
        if (Math.random() < 0.05) {
          clearInterval(interval);
          reject(new Error(t('uploadError')));
        }
      }, 500);
    });
  }, [t]);

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: t('uploadError'),
        description: validationError,
        variant: 'destructive',
      });
      onUploadError?.(validationError);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Create preview asynchronously
      await createPreview(file);
      
      const uploadedUrl = await simulateUpload(file);
      
      toast({
        title: t('processed'),
        description: `${file.name} uploaded successfully`,
      });
      
      onUploadComplete?.(file, uploadedUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('uploadError');
      
      toast({
        title: t('uploadError'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      onUploadError?.(errorMessage);
      clearPreview();
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [validateFile, createPreview, simulateUpload, toast, t, onUploadComplete, onUploadError, clearPreview]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    clearPreview();
    setIsUploading(false);
    setUploadProgress(0);
    
    // Reset file inputs
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  }, [clearPreview]);

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          isUploading && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile && previewUrl ? (
          <div className="space-y-4">
            {/* Preview Image */}
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg shadow-md"
              />
              {!isUploading && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* File Info */}
            <div className="text-sm text-gray-600">
              <p className="font-medium">{selectedFile.name}</p>
              <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600">
                  {t('processing')} {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload Icon */}
            <div className="flex justify-center">
              <FileImage className="w-16 h-16 text-gray-400" />
            </div>
            
            {/* Upload Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {t('upload')}
              </h3>
              <p className="text-gray-600">
                {t('uploadDescription')}
              </p>
            </div>
            
            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleBrowseClick}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t('uploadFromDevice')}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCameraClick}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {t('uploadFromCamera')}
              </Button>
            </div>
            
            {/* File Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Max file size: {maxSizeInMB}MB</p>
              <p>Supported formats: JPG, PNG, WEBP</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}