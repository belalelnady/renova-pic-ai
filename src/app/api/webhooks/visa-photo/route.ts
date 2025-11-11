import { NextRequest, NextResponse } from 'next/server';
import { WebhookService } from '@/lib/webhook-service';

export async function POST(request: NextRequest) {
  try {
    // Validate webhook authentication
    const authToken = process.env.VISA_PHOTO_AUTH_TOKEN;
    if (!WebhookService.validateWebhookAuth(request, authToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    
    // Handle the webhook callback
    const result = await WebhookService.handleWebhookCallback('visa-photo', payload);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Visa photo webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'visa-photo-webhook',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}