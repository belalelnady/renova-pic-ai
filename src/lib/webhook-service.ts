import { PhotoService } from '@/lib/photo-service';

export interface WebhookConfig {
  url: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  authToken?: string;
}

export interface AIProcessingRequest {
  photoId: string;
  imageUrl: string;
  aiTool: 'visa-photo' | 'absher' | 'saudi-look' | 'baby-photo';
  userId: string;
  callbackUrl?: string;
}

export interface AIProcessingResponse {
  success: boolean;
  processedImageUrl?: string;
  error?: string;
  processingTime?: number;
  jobId?: string;
}

export class WebhookService {
  private static readonly WEBHOOK_CONFIGS: Record<string, WebhookConfig> = {
    'visa-photo': {
      url: process.env.VISA_PHOTO_WEBHOOK_URL || 'https://api.example.com/visa-photo/process',
      timeout: 60000, // 60 seconds
      retryAttempts: 3,
      retryDelay: 2000, // 2 seconds
      authToken: process.env.VISA_PHOTO_AUTH_TOKEN,
    },
    'absher': {
      url: process.env.ABSHER_WEBHOOK_URL || 'https://api.example.com/absher/process',
      timeout: 60000,
      retryAttempts: 3,
      retryDelay: 2000,
      authToken: process.env.ABSHER_AUTH_TOKEN,
    },
    'saudi-look': {
      url: process.env.SAUDI_LOOK_WEBHOOK_URL || 'https://api.example.com/saudi-look/process',
      timeout: 60000,
      retryAttempts: 3,
      retryDelay: 2000,
      authToken: process.env.SAUDI_LOOK_AUTH_TOKEN,
    },
    'baby-photo': {
      url: process.env.BABY_PHOTO_WEBHOOK_URL || 'https://api.example.com/baby-photo/process',
      timeout: 60000,
      retryAttempts: 3,
      retryDelay: 2000,
      authToken: process.env.BABY_PHOTO_AUTH_TOKEN,
    },
  };

  /**
   * Process photo with AI tool
   */
  static async processPhoto(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const config = this.WEBHOOK_CONFIGS[request.aiTool];
    
    if (!config) {
      throw new Error(`Unsupported AI tool: ${request.aiTool}`);
    }

    // Update photo status to processing
    await PhotoService.updatePhotoStatus(request.photoId, 'processing');

    try {
      const response = await this.callWebhookWithRetry(config, request);
      
      if (response.success && response.processedImageUrl) {
        // Update photo with processed image URL
        await PhotoService.updatePhotoWithEditedVersion(
          request.photoId,
          response.processedImageUrl,
          'completed'
        );
      } else {
        // Update photo status to failed
        await PhotoService.updatePhotoStatus(request.photoId, 'failed');
      }

      return response;
    } catch (error) {
      console.error(`AI processing failed for ${request.aiTool}:`, error);
      
      // Update photo status to failed
      await PhotoService.updatePhotoStatus(request.photoId, 'failed');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      };
    }
  }

  /**
   * Call webhook with retry logic
   */
  private static async callWebhookWithRetry(
    config: WebhookConfig,
    request: AIProcessingRequest
  ): Promise<AIProcessingResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        const response = await this.callWebhook(config, request);
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        console.warn(`Webhook attempt ${attempt} failed:`, lastError.message);
        
        // Don't retry on the last attempt
        if (attempt < config.retryAttempts) {
          await this.delay(config.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    throw lastError || new Error('All webhook attempts failed');
  }

  /**
   * Make actual webhook call
   */
  private static async callWebhook(
    config: WebhookConfig,
    request: AIProcessingRequest
  ): Promise<AIProcessingResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'PhotoApp/1.0',
      };

      if (config.authToken) {
        headers['Authorization'] = `Bearer ${config.authToken}`;
      }

      const payload = {
        imageUrl: request.imageUrl,
        tool: request.aiTool,
        userId: request.userId,
        photoId: request.photoId,
        callbackUrl: request.callbackUrl,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        processedImageUrl: result.processedImageUrl || result.editedUrl,
        processingTime: result.processingTime,
        jobId: result.jobId,
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Webhook request timed out');
      }
      
      throw error;
    }
  }

  /**
   * Validate webhook authentication
   */
  static validateWebhookAuth(
    request: Request,
    expectedToken?: string
  ): boolean {
    if (!expectedToken) {
      return true; // No auth required
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return false;
    }

    const token = authHeader.replace('Bearer ', '');
    return token === expectedToken;
  }

  /**
   * Handle webhook callback from AI service
   */
  static async handleWebhookCallback(
    aiTool: string,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { photoId, processedImageUrl, status, error } = payload;

      if (!photoId) {
        throw new Error('Photo ID is required');
      }

      if (status === 'completed' && processedImageUrl) {
        await PhotoService.updatePhotoWithEditedVersion(
          photoId,
          processedImageUrl,
          'completed'
        );
        
        return {
          success: true,
          message: 'Photo processing completed successfully',
        };
      } else if (status === 'failed' || error) {
        await PhotoService.updatePhotoStatus(photoId, 'failed');
        
        return {
          success: true,
          message: 'Photo processing failed, status updated',
        };
      } else {
        // Update processing status if provided
        if (status) {
          await PhotoService.updatePhotoStatus(photoId, status);
        }
        
        return {
          success: true,
          message: 'Photo status updated',
        };
      }

    } catch (error) {
      console.error('Webhook callback error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Callback processing failed',
      };
    }
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get webhook status for monitoring
   */
  static async getWebhookStatus(aiTool: string): Promise<{
    available: boolean;
    responseTime?: number;
    error?: string;
  }> {
    const config = this.WEBHOOK_CONFIGS[aiTool];
    
    if (!config) {
      return {
        available: false,
        error: 'Unsupported AI tool',
      };
    }

    try {
      const startTime = Date.now();
      
      const response = await fetch(`${config.url}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'PhotoApp/1.0',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout for health check
      });

      const responseTime = Date.now() - startTime;

      return {
        available: response.ok,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };

    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }
}