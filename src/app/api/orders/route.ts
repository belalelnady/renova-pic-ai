import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { orderSchema } from '@/lib/validations';
import { DatabaseWebhookService } from '@/lib/database-webhook';
import { z } from 'zod';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}



// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Generate unique order number
    let orderNumber: string;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      orderNumber = generateOrderNumber();
      attempts++;
      
      // Check if order number already exists
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber },
      });
      
      if (!existingOrder) break;
      
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique order number');
      }
    } while (attempts < maxAttempts);

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => sum + item.price, 0);
    const shipping = 25; // Fixed shipping cost
    const tax = subtotal * 0.15; // 15% tax
    const calculatedTotal = subtotal + shipping + tax;

    // Verify total amount matches calculation
    if (Math.abs(calculatedTotal - validatedData.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Total amount mismatch' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        items: validatedData.items,
        totalAmount: validatedData.totalAmount,
        shippingAddress: validatedData.shippingAddress,
        status: 'pending',
        orderDate: new Date(),
      },
    });

    // Clear user's cart after successful order creation
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Trigger database webhook for external processing (non-blocking)
    DatabaseWebhookService.sendOrderCreatedEvent(order, session.user.id).catch(error => {
      console.error('Database webhook failed:', error);
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          orderDate: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}