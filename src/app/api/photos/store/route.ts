import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storePhotoMetadata, PhotoData } from '@/lib/photo-storage';

interface StorePhotoRequest {
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: StorePhotoRequest = await request.json();
    
    const {
      title,
      aiTool,
      originalUrl,
      editedUrl,
      thumbnailUrl,
      editingSettings,
      price,
      printSize,
      status,
    } = body;

    // Validate required fields
    if (!title || !aiTool || !originalUrl || !printSize) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate AI tool
    const validTools = ['visa-photo', 'absher', 'saudi-look', 'baby-photo'];
    if (!validTools.includes(aiTool)) {
      return NextResponse.json({ error: 'Invalid AI tool' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['uploading', 'processing', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const photoData: PhotoData = {
      userId: session.user.id,
      title,
      aiTool,
      originalUrl,
      editedUrl,
      thumbnailUrl,
      editingSettings,
      price: price || 0,
      printSize,
      status,
    };

    const result = await storePhotoMetadata(photoData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to store photo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        photoId: result.photoId,
        message: 'Photo stored successfully',
      },
    });

  } catch (error) {
    console.error('Store photo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // In a real implementation, you would fetch the photo from the database
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      data: {
        photoId,
        status: 'completed',
        message: 'Photo retrieved successfully',
      },
    });

  } catch (error) {
    console.error('Get photo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}