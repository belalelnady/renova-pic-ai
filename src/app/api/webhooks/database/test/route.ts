import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DatabaseWebhookService } from '@/lib/database-webhook';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventType } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    let result;

    switch (eventType) {
      case 'photo_created':
        // Send test photo_created event
        const testPhotoData = {
          id: 'test-photo-id',
          userId: session.user.id,
          title: 'Test Photo',
          aiTool: 'visa-photo',
          originalUrl: 'https://example.com/test-photo.jpg',
          editedUrl: null,
          thumbnailUrl: 'https://example.com/test-photo-thumb.jpg',
          editingSettings: { category: 'visa', size: '4x6' },
          price: 25.00,
          printSize: '4x6',
          status: 'uploaded',
          createdAt: new Date(),
        };
        
        result = await DatabaseWebhookService.sendPhotoCreatedEvent(
          testPhotoData,
          session.user.id
        );
        break;

      case 'order_created':
        // Send test order_created event
        const testOrderData = {
          id: 'test-order-id',
          userId: session.user.id,
          orderNumber: 'ORD-TEST-123456',
          items: [
            {
              photoTitle: 'Test Photo',
              photoUrl: 'https://example.com/test-photo.jpg',
              printSize: '4x6',
              quantity: 1,
              price: 25.00,
            }
          ],
          totalAmount: 46.25, // Including shipping and tax
          shippingAddress: {
            fullName: 'Test User',
            addressLine1: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            country: 'Test Country',
          },
          status: 'pending',
          orderDate: new Date(),
          createdAt: new Date(),
        };
        
        result = await DatabaseWebhookService.sendOrderCreatedEvent(
          testOrderData,
          session.user.id
        );
        break;

      case 'photo_updated':
        // Send test photo_updated event
        const testUpdatedPhotoData = {
          id: 'test-photo-id',
          userId: session.user.id,
          title: 'Test Photo',
          aiTool: 'visa-photo',
          originalUrl: 'https://example.com/test-photo.jpg',
          editedUrl: 'https://example.com/test-photo-edited.jpg',
          thumbnailUrl: 'https://example.com/test-photo-thumb.jpg',
          editingSettings: { category: 'visa', size: '4x6' },
          price: 25.00,
          printSize: '4x6',
          status: 'completed',
          updatedAt: new Date(),
        };
        
        result = await DatabaseWebhookService.sendPhotoUpdatedEvent(
          testUpdatedPhotoData,
          session.user.id,
          ['editedUrl', 'status']
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid event type. Supported: photo_created, order_created, photo_updated' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        eventType,
        deliveryResult: result,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Database webhook test error:', error);
    return NextResponse.json(
      { error: 'Failed to test database webhook' },
      { status: 500 }
    );
  }
}