import { prisma } from './db';

export interface PhotoData {
  id?: string;
  userId: string;
  title: string;
  aiTool: string;
  originalUrl: string;
  editedUrl?: string;
  thumbnailUrl?: string;
  editingSettings: Record<string, any>;
  price: number;
  printSize: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
}

export interface PhotoStorageResult {
  success: boolean;
  photoId?: string;
  error?: string;
}

/**
 * Store photo metadata in the database
 */
export async function storePhotoMetadata(photoData: PhotoData): Promise<PhotoStorageResult> {
  try {
    const photo = await prisma.photo.create({
      data: {
        userId: photoData.userId,
        title: photoData.title,
        aiTool: photoData.aiTool,
        originalUrl: photoData.originalUrl,
        editedUrl: photoData.editedUrl,
        thumbnailUrl: photoData.thumbnailUrl,
        editingSettings: photoData.editingSettings,
        price: photoData.price,
        printSize: photoData.printSize,
        status: photoData.status,
      },
    });

    return {
      success: true,
      photoId: photo.id,
    };
  } catch (error) {
    console.error('Error storing photo metadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update photo with edited version
 */
export async function updatePhotoWithEditedVersion(
  photoId: string,
  editedUrl: string,
  thumbnailUrl?: string,
  status: 'completed' | 'failed' = 'completed'
): Promise<PhotoStorageResult> {
  try {
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        editedUrl,
        thumbnailUrl,
        status,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      photoId,
    };
  } catch (error) {
    console.error('Error updating photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update photo with pricing and editing settings
 */
export async function updatePhotoWithPricing(
  photoId: string,
  editingSettings: Record<string, any>,
  price: number,
  printSize: string
): Promise<PhotoStorageResult> {
  try {
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        editingSettings,
        price,
        printSize,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      photoId,
    };
  } catch (error) {
    console.error('Error updating photo pricing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get photo by ID
 */
export async function getPhotoById(photoId: string, userId: string) {
  try {
    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: userId,
      },
    });

    return photo;
  } catch (error) {
    console.error('Error fetching photo:', error);
    return null;
  }
}

/**
 * Get all photos for a user
 */
export async function getUserPhotos(userId: string) {
  try {
    const photos = await prisma.photo.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return photos;
  } catch (error) {
    console.error('Error fetching user photos:', error);
    return [];
  }
}

/**
 * Delete photo
 */
export async function deletePhoto(photoId: string, userId: string): Promise<PhotoStorageResult> {
  try {
    await prisma.photo.deleteMany({
      where: {
        id: photoId,
        userId: userId,
      },
    });

    return {
      success: true,
      photoId,
    };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate thumbnail URL (placeholder implementation)
 * In a real implementation, this would generate actual thumbnails
 */
export function generateThumbnailUrl(originalUrl: string): string {
  // For now, return the original URL
  // In production, you would use a service like Cloudinary or AWS Lambda to generate thumbnails
  return originalUrl;
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  
  return `${userId}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate file for storage
 */
export function validateFileForStorage(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}