export interface DatabaseWebhookPayload {
  event: 'photo_created' | 'order_created' | 'photo_updated';
  data: any;
  timestamp: string;
  userId: string;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  deliveryTime?: number;
}

export class DatabaseWebhookService {
  private static readonly WEBHOOK_URL = process.env.DATABASE_WEBHOOK_URL;
  private static readonly AUTH_TOKEN = process.env.DATABASE_WEBHOOK_AUTH_TOKEN;
  private static readonly TIMEOUT = 30000; // 30 seconds
  private static readonly MAX_RETRIES = 3;

  /**
   * Send photo_created event webhook
   */
  static async sendPhotoCreatedEvent(
    photoData: any,
    userId: string
  ): Promise<WebhookDeliveryResult> {
    const payload: DatabaseWebhookPayload = {
      event: 'photo_created',
      data: {
        id: photoData.id,
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
        createdAt: photoData.createdAt,
      },
      timestamp: new Date().toISOString(),
      userId,
    };

    return this.deliverWebhook(payload);
  }

  /**
   * Send order_created event webhook
   */
  static async sendOrderCreatedEvent(
    orderData: any,
    userId: string
  ): Promise<WebhookDeliveryResult> {
    const payload: DatabaseWebhookPayload = {
      event: 'order_created',
      data: {
        id: orderData.id,
        userId: orderData.userId,
        orderNumber: orderData.orderNumber,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        status: orderData.status,
        orderDate: orderData.orderDate,
        createdAt: orderData.createdAt,
      },
      timestamp: new Date().toISOString(),
      userId,
    };

    return this.deliverWebhook(payload);
  }

  /**
   * Send photo_updated event webhook
   */
  static async sendPhotoUpdatedEvent(
    photoData: any,
    userId: string,
    changes: string[]
  ): Promise<WebhookDeliveryResult> {
    const payload: DatabaseWebhookPayload = {
      event: 'photo_updated',
      data: {
        id: photoData.id,
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
        updatedAt: photoData.updatedAt,
        changes,
      },
      timestamp: new Date().toISOString(),
      userId,
    };

    return this.deliverWebhook(payload);
  }

  /**
   * Deliver webhook with retry logic
   */
  private static async deliverWebhook(
    payload: DatabaseWebhookPayload
  ): Promise<WebhookDeliveryResult> {
    if (!this.WEBHOOK_URL) {
      console.warn('Database webhook URL not configured');
      return {
        success: false,
        error: 'Webhook URL not configured',
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.makeWebhookRequest(payload);
        
        // Log successful delivery
        console.log(`Database webhook delivered successfully on attempt ${attempt}:`, {
          event: payload.event,
          userId: payload.userId,
          statusCode: result.statusCode,
          deliveryTime: result.deliveryTime,
        });

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        console.warn(`Database webhook attempt ${attempt} failed:`, {
          event: payload.event,
          userId: payload.userId,
          error: lastError.message,
        });

        // Don't retry on the last attempt
        if (attempt < this.MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          await this.delay(delay);
        }
      }
    }

    // Log final failure
    console.error('Database webhook delivery failed after all retries:', {
      event: payload.event,
      userId: payload.userId,
      error: lastError?.message,
    });

    return {
      success: false,
      error: lastError?.message || 'All delivery attempts failed',
    };
  }

  /**
   * Make the actual webhook HTTP request
   */
  private static async makeWebhookRequest(
    payload: DatabaseWebhookPayload
  ): Promise<WebhookDeliveryResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const startTime = Date.now();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'PhotoApp-DatabaseWebhook/1.0',
        'X-Event-Type': payload.event,
        'X-Timestamp': payload.timestamp,
      };

      if (this.AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${this.AUTH_TOKEN}`;
      }

      const response = await fetch(this.WEBHOOK_URL!, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const deliveryTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        statusCode: response.status,
        deliveryTime,
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
   * Test webhook connectivity
   */
  static async testWebhookConnectivity(): Promise<{
    available: boolean;
    responseTime?: number;
    error?: string;
  }> {
    if (!this.WEBHOOK_URL) {
      return {
        available: false,
        error: 'Webhook URL not configured',
      };
    }

    try {
      const startTime = Date.now();

      const response = await fetch(`${this.WEBHOOK_URL}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'PhotoApp-DatabaseWebhook/1.0',
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

  /**
   * Get webhook configuration status
   */
  static getWebhookConfig(): {
    configured: boolean;
    url?: string;
    hasAuth: boolean;
  } {
    return {
      configured: !!this.WEBHOOK_URL,
      url: this.WEBHOOK_URL ? this.maskUrl(this.WEBHOOK_URL) : undefined,
      hasAuth: !!this.AUTH_TOKEN,
    };
  }

  /**
   * Mask URL for logging/display purposes
   */
  private static maskUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return 'Invalid URL';
    }
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}