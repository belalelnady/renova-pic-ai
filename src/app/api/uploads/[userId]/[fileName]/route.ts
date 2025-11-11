import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    userId: string;
    fileName: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId, fileName } = params;
    
    // Get session to verify access
    const session = await getServerSession(authOptions);
    
    // Allow access if user owns the file or if it's a thumbnail (for public viewing)
    const isOwner = session?.user?.id === userId;
    const isThumbnail = fileName.startsWith('thumb_');
    
    if (!isOwner && !isThumbnail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Construct file path
    const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
    const filePath = path.join(uploadDir, userId, fileName);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentType = getContentType(ext);
    
    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  
  return contentTypes[extension] || 'application/octet-stream';
}