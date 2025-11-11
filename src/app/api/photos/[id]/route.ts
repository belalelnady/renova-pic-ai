import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const photoId = params.id;

    // Check if photo exists and belongs to user
    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: session.user.id
      }
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete related cart items first
    await prisma.cartItem.deleteMany({
      where: {
        photoId: photoId
      }
    });

    // Delete the photo
    await prisma.photo.delete({
      where: {
        id: photoId
      }
    });

    // In a real implementation, you would also delete the actual files from storage
    // await deleteFileFromStorage(photo.originalUrl);
    // if (photo.editedUrl) await deleteFileFromStorage(photo.editedUrl);
    // if (photo.thumbnailUrl) await deleteFileFromStorage(photo.thumbnailUrl);

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully'
    });

  } catch (error) {
    console.error('Photo deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const photoId = params.id;

    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        aiTool: true,
        originalUrl: true,
        editedUrl: true,
        thumbnailUrl: true,
        editingSettings: true,
        price: true,
        printSize: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: photo
    });

  } catch (error) {
    console.error('Photo fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}