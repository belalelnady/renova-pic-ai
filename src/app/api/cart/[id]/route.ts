import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemId = params.id;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId
      },
      data: {
        quantity: quantity,
        totalPrice: quantity * Number(cartItem.pricePerItem)
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedCartItem
    });

  } catch (error) {
    console.error('Cart item update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemId = params.id;

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItemId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully'
    });

  } catch (error) {
    console.error('Cart item deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}