import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}