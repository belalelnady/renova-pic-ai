import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PhotoService } from '@/lib/photo-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const aiTool = searchParams.get('aiTool') || undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let result;

    if (search) {
      // Use search functionality
      result = await PhotoService.searchPhotos(session.user.id, search, {
        page,
        limit,
      });
    } else {
      // Use regular filtering
      result = await PhotoService.getUserPhotos(session.user.id, {
        page,
        limit,
        aiTool,
        sortBy: sortBy as 'createdAt' | 'title',
        sortOrder: sortOrder as 'asc' | 'desc',
      });
    }

    return NextResponse.json({
      success: true,
      data: result.photos,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });

  } catch (error) {
    console.error('Photos fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}