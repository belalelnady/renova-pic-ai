import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users (for development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Creating sample users...');
    
    const sampleUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
        image: 'https://via.placeholder.com/150',
      },
    });

    console.log('Creating sample photos...');
    
    // Create sample photos
    const samplePhotos = [
      {
        title: 'Sample Visa Photo',
        aiTool: 'visa',
        originalUrl: 'https://via.placeholder.com/600x800/0066cc/ffffff?text=Original+Visa+Photo',
        editedUrl: 'https://via.placeholder.com/600x800/00cc66/ffffff?text=Edited+Visa+Photo',
        thumbnailUrl: 'https://via.placeholder.com/200x200/0066cc/ffffff?text=Visa+Thumb',
        editingSettings: {
          category: 'visa',
          size: '2x2',
          quantity: 4,
          addFrame: false,
        },
        price: 15.99,
        printSize: '2x2 inches',
        status: 'completed',
        userId: sampleUser.id,
      },
      {
        title: 'Sample Absher Photo',
        aiTool: 'absher',
        originalUrl: 'https://via.placeholder.com/600x800/cc6600/ffffff?text=Original+Absher+Photo',
        editedUrl: 'https://via.placeholder.com/600x800/66cc00/ffffff?text=Edited+Absher+Photo',
        thumbnailUrl: 'https://via.placeholder.com/200x200/cc6600/ffffff?text=Absher+Thumb',
        editingSettings: {
          category: 'absher',
          size: '4x6',
          quantity: 2,
          addFrame: true,
        },
        price: 12.99,
        printSize: '4x6 inches',
        status: 'completed',
        userId: sampleUser.id,
      },
      {
        title: 'Sample Saudi Look Photo',
        aiTool: 'saudi-look',
        originalUrl: 'https://via.placeholder.com/600x800/6600cc/ffffff?text=Original+Saudi+Look',
        editedUrl: 'https://via.placeholder.com/600x800/cc0066/ffffff?text=Edited+Saudi+Look',
        thumbnailUrl: 'https://via.placeholder.com/200x200/6600cc/ffffff?text=Saudi+Thumb',
        editingSettings: {
          category: 'saudi-look',
          size: '5x7',
          quantity: 1,
          addFrame: false,
        },
        price: 18.99,
        printSize: '5x7 inches',
        status: 'completed',
        userId: sampleUser.id,
      },
    ];

    for (const photoData of samplePhotos) {
      await prisma.photo.upsert({
        where: { 
          id: `sample-${photoData.aiTool}-${sampleUser.id}` 
        },
        update: {},
        create: {
          id: `sample-${photoData.aiTool}-${sampleUser.id}`,
          ...photoData,
        },
      });
    }

    console.log('Creating sample cart items...');
    
    // Create sample cart item
    const samplePhoto = await prisma.photo.findFirst({
      where: { userId: sampleUser.id },
    });

    if (samplePhoto) {
      await prisma.cartItem.upsert({
        where: { 
          id: `sample-cart-${sampleUser.id}` 
        },
        update: {},
        create: {
          id: `sample-cart-${sampleUser.id}`,
          userId: sampleUser.id,
          photoId: samplePhoto.id,
          photoTitle: samplePhoto.title,
          photoUrl: samplePhoto.thumbnailUrl || samplePhoto.editedUrl || samplePhoto.originalUrl,
          printSize: samplePhoto.printSize,
          quantity: 2,
          pricePerItem: samplePhoto.price,
          totalPrice: Number(samplePhoto.price) * 2,
        },
      });
    }

    console.log('Creating sample order...');
    
    // Create sample order
    await prisma.order.upsert({
      where: { 
        orderNumber: 'ORD-SAMPLE-001' 
      },
      update: {},
      create: {
        orderNumber: 'ORD-SAMPLE-001',
        userId: sampleUser.id,
        items: [
          {
            photoTitle: 'Sample Visa Photo',
            photoUrl: 'https://via.placeholder.com/200x200/0066cc/ffffff?text=Visa+Thumb',
            printSize: '2x2 inches',
            quantity: 4,
            price: 15.99,
          },
        ],
        totalAmount: 15.99,
        shippingAddress: {
          fullName: 'Demo User',
          addressLine1: '123 Demo Street',
          city: 'Demo City',
          state: 'Demo State',
          postalCode: '12345',
          country: 'Demo Country',
        },
        status: 'pending',
        trackingNumber: 'TRACK123456789',
      },
    });

    console.log(`✅ Sample data created for user: ${sampleUser.email}`);
  }

  // Create indexes for better performance
  console.log('Creating database indexes...');
  
  try {
    // These would typically be in migration files, but we'll ensure they exist
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_photos_user_id ON photos(user_id);`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_photos_ai_tool ON photos(ai_tool);`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_photos_created_at ON photos(created_at);`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_order_number ON orders(order_number);`;
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.log('ℹ️ Some indexes may already exist, continuing...');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });