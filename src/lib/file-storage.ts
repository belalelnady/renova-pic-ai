import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export class FileStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './public/uploads';
    this.baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  /**
   * Upload a file and generate thumbnail
   */
  async uploadFile(
    file: File,
    userId: string,
    options: ThumbnailOptions = {}
  ): Promise<FileUploadResult> {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = this.getFileExtension(file.name);
    const uniqueFileName = `${uuidv4()}-${Date.now()}${fileExtension}`;
    const userDir = path.join(this.uploadDir, userId);
    
    // Ensure user directory exists
    await this.ensureDirectoryExists(userDir);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Save original file
    const originalPath = path.join(userDir, uniqueFileName);
    await writeFile(originalPath, buffer);

    // Generate thumbnail
    const thumbnailFileName = `thumb_${uniqueFileName}`;
    const thumbnailPath = path.join(userDir, thumbnailFileName);
    await this.generateThumbnail(buffer, thumbnailPath, options);

    // Generate URLs
    const originalUrl = this.generateFileUrl(userId, uniqueFileName);
    const thumbnailUrl = this.generateFileUrl(userId, thumbnailFileName);

    return {
      originalUrl,
      thumbnailUrl,
      fileName: uniqueFileName,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
    };
  }

  /**
   * Generate thumbnail from image buffer
   */
  private async generateThumbnail(
    buffer: Buffer,
    outputPath: string,
    options: ThumbnailOptions = {}
  ): Promise<void> {
    const { width = 300, height = 300, quality = 80 } = options;

    await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality })
      .toFile(outputPath);
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File): void {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Check if file has content
    if (file.size === 0) {
      throw new Error('File is empty.');
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    return ext || '.jpg'; // Default to .jpg if no extension
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Generate public URL for file
   */
  private generateFileUrl(userId: string, fileName: string): string {
    return `${this.baseUrl}/uploads/${userId}/${fileName}`;
  }

  /**
   * Delete file and its thumbnail
   */
  async deleteFile(userId: string, fileName: string): Promise<void> {
    const userDir = path.join(this.uploadDir, userId);
    const originalPath = path.join(userDir, fileName);
    const thumbnailPath = path.join(userDir, `thumb_${fileName}`);

    try {
      const fs = await import('fs/promises');
      
      // Delete original file
      if (existsSync(originalPath)) {
        await fs.unlink(originalPath);
      }

      // Delete thumbnail
      if (existsSync(thumbnailPath)) {
        await fs.unlink(thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get file info without uploading
   */
  static getFileInfo(file: File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
    };
  }
}

// Export singleton instance
export const fileStorage = new FileStorageService();