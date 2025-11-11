import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WebhookService } from '@/lib/webhook-service';

interface ProcessingRequest {
  photoId: string;
  imageUrl: string;
  aiTool: 'visa-photo' | 'absher' | 'saudi-look' | 'baby-photo';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ProcessingRequest = await request.json();
    const { photoId, imageUrl, aiTool } = body;

    if (!photoId || !imageUrl || !aiTool) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate AI tool
    const validTools = ['visa-photo', 'absher', 'saudi-look', 'baby-photo'];
    if (!validTools.includes(aiTool)) {
      return NextResponse.json({ error: 'Invalid AI tool' }, { status: 400 });
    }

    // Generate callback URL for webhook response
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/webhooks/${aiTool}`;

    // Process photo using webhook service
    const processingResult = await WebhookService.processPhoto({
      photoId,
      imageUrl,
      aiTool,
      userId: session.user.id,
      callbackUrl,
    });

    if (processingResult.success) {
      return NextResponse.json({
        success: true,
        data: {
          photoId,
          status: 'processing',
          jobId: processingResult.jobId,
          message: 'Photo processing started successfully',
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: processingResult.error || 'Processing failed',
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Processing error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Processing timeout - please try again' },
          { status: 408 }
        );
      }
      
      if (error.message.includes('Unsupported AI tool')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Processing failed - please try again' },
      { status: 500 }
    );
  }
}

// Get processing status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');
    
    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
    }
    
    // Get photo status from database
    const { PhotoService } = await import('@/lib/photo-service');
    const photo = await PhotoService.getPhotoById(photoId, session.user.id);
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        photoId: photo.id,
        status: photo.status,
        originalUrl: photo.originalUrl,
        editedUrl: photo.editedUrl,
        updatedAt: photo.updatedAt,
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check processing status' },
      { status: 500 }
    );
  }
}