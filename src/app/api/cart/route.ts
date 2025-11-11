import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        photo: {
          select: {
            id: true,
            title: true,
            editedUrl: true,
            thumbnailUrl: true,
            originalUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: cartItems
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { photoId, quantity = 1 } = body;

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    // Get photo details
    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: session.user.id
      }
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        photoId: photoId
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
          totalPrice: (existingCartItem.quantity + quantity) * Number(photo.price)
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          photoId: photoId,
          photoTitle: photo.title,
          photoUrl: photo.editedUrl || photo.originalUrl,
          printSize: photo.printSize,
          quantity: quantity,
          pricePerItem: photo.price,
          totalPrice: quantity * Number(photo.price)
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: cartItem
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}