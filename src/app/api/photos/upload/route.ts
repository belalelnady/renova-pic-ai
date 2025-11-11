import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileStorage } from '@/lib/file-storage';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload file using the file storage service
    const uploadResult = await fileStorage.uploadFile(file, session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        fileName: uploadResult.fileName,
        originalUrl: uploadResult.originalUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        fileSize: uploadResult.fileSize,
        fileType: uploadResult.mimeType,
        uploadedAt: uploadResult.uploadedAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      // Handle validation errors from file storage service
      if (error.message.includes('Invalid file type') || 
          error.message.includes('File too large') || 
          error.message.includes('File is empty')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}