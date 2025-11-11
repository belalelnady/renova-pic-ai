import { prisma } from '@/lib/db';
import { fileStorage, FileUploadResult } from '@/lib/file-storage';
import { DatabaseWebhookService } from '@/lib/database-webhook';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreatePhotoData {
  title: string;
  aiTool: string;
  editingSettings: any;
  price: number;
  printSize: string;
}

export interface PhotoWithUrls {
  id: string;
  userId: string;
  title: string;
  aiTool: string;
  originalUrl: string;
  editedUrl: string | null;
  thumbnailUrl: string | null;
  editingSettings: any;
  price: Decimal;
  printSize: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PhotoService {
  /**
   * Create a new photo record with uploaded file
   */
  static async createPhoto(
    userId: string,
    file: File,
    photoData: CreatePhotoData
  ): Promise<PhotoWithUrls> {
    try {
      // Upload file and generate thumbnail
      const uploadResult = await fileStorage.uploadFile(file, userId);
      
      // Create photo record in database
      const photo = await prisma.photo.create({
        data: {
          userId,
          title: photoData.title,
          aiTool: photoData.aiTool,
          originalUrl: uploadResult.originalUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          editingSettings: photoData.editingSettings,
          price: new Decimal(photoData.price),
          printSize: photoData.printSize,
          status: 'uploaded',
        },
      });

      // Send database webhook for photo creation
      try {
        await DatabaseWebhookService.sendPhotoCreatedEvent(photo, userId);
      } catch (webhookError) {
        console.error('Failed to send photo_created webhook:', webhookError);
        // Don't fail the photo creation if webhook fails
      }

      return photo;
    } catch (error) {
      console.error('Error creating photo:', error);
      throw new Error('Failed to create photo record');
    }
  }

  /**
   * Update photo with processed/edited version
   */
  static async updatePhotoWithEditedVersion(
    photoId: string,
    editedUrl: string,
    status: string = 'completed'
  ): Promise<PhotoWithUrls> {
    try {
      const photo = await prisma.photo.update({
        where: { id: photoId },
        data: {
          editedUrl,
          status,
          updatedAt: new Date(),
        },
      });

      // Send database webhook for photo update
      try {
        await DatabaseWebhookService.sendPhotoUpdatedEvent(
          photo, 
          photo.userId, 
          ['editedUrl', 'status']
        );
      } catch (webhookError) {
        console.error('Failed to send photo_updated webhook:', webhookError);
        // Don't fail the photo update if webhook fails
      }

      return photo;
    } catch (error) {
      console.error('Error updating photo:', error);
      throw new Error('Failed to update photo');
    }
  }

  /**
   * Get user's photos with pagination
   */
  static async getUserPhotos(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      aiTool?: string;
      sortBy?: 'createdAt' | 'title';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ photos: PhotoWithUrls[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      aiTool,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(aiTool && { aiTool }),
    };

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.photo.count({ where }),
    ]);

    return { photos, total };
  }

  /**
   * Get photo by ID (with ownership check)
   */
  static async getPhotoById(
    photoId: string,
    userId: string
  ): Promise<PhotoWithUrls | null> {
    try {
      const photo = await prisma.photo.findFirst({
        where: {
          id: photoId,
          userId,
        },
      });

      return photo;
    } catch (error) {
      console.error('Error getting photo:', error);
      return null;
    }
  }

  /**
   * Delete photo and associated files
   */
  static async deletePhoto(photoId: string, userId: string): Promise<boolean> {
    try {
      // Get photo record first
      const photo = await prisma.photo.findFirst({
        where: {
          id: photoId,
          userId,
        },
      });

      if (!photo) {
        throw new Error('Photo not found');
      }

      // Extract filename from URL
      const originalFileName = photo.originalUrl.split('/').pop();
      
      if (originalFileName) {
        // Delete files from storage
        await fileStorage.deleteFile(userId, originalFileName);
      }

      // Delete photo record from database
      await prisma.photo.delete({
        where: { id: photoId },
      });

      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  /**
   * Update photo status
   */
  static async updatePhotoStatus(
    photoId: string,
    status: string
  ): Promise<PhotoWithUrls | null> {
    try {
      const photo = await prisma.photo.update({
        where: { id: photoId },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      // Send database webhook for photo status update
      try {
        await DatabaseWebhookService.sendPhotoUpdatedEvent(
          photo, 
          photo.userId, 
          ['status']
        );
      } catch (webhookError) {
        console.error('Failed to send photo_updated webhook:', webhookError);
        // Don't fail the status update if webhook fails
      }

      return photo;
    } catch (error) {
      console.error('Error updating photo status:', error);
      return null;
    }
  }

  /**
   * Search photos by title
   */
  static async searchPhotos(
    userId: string,
    searchTerm: string,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ photos: PhotoWithUrls[]; total: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      title: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
    };

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photo.count({ where }),
    ]);

    return { photos, total };
  }
}