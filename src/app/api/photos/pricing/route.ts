import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updatePhotoWithPricing, getPhotoById } from '@/lib/photo-storage';
import { validateEditingSettings, calculatePrintPrice } from '@/lib/pricing';
import { EditingSettings } from '@/types';

interface UpdatePricingRequest {
  photoId: string;
  editingSettings: EditingSettings;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdatePricingRequest = await request.json();
    const { photoId, editingSettings } = body;

    // Validate required fields
    if (!photoId || !editingSettings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate editing settings
    const validationErrors = validateEditingSettings(editingSettings);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid editing settings', details: validationErrors },
        { status: 400 }
      );
    }

    // Verify photo ownership
    const existingPhoto = await getPhotoById(photoId, session.user.id);
    if (!existingPhoto) {
      return NextResponse.json(
        { error: 'Photo not found or access denied' },
        { status: 404 }
      );
    }

    // Calculate pricing
    const pricingBreakdown = calculatePrintPrice(editingSettings);

    // Update photo with new pricing
    const result = await updatePhotoWithPricing(
      photoId,
      editingSettings,
      pricingBreakdown.totalPrice,
      editingSettings.size
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update photo pricing' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        photoId,
        editingSettings,
        pricing: pricingBreakdown,
        message: 'Photo pricing updated successfully',
      },
    });

  } catch (error) {
    console.error('Update pricing error:', error);
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

    const body: { editingSettings: EditingSettings } = await request.json();
    const { editingSettings } = body;

    // Validate editing settings
    const validationErrors = validateEditingSettings(editingSettings);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid editing settings', details: validationErrors },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricingBreakdown = calculatePrintPrice(editingSettings);

    return NextResponse.json({
      success: true,
      data: {
        editingSettings,
        pricing: pricingBreakdown,
      },
    });

  } catch (error) {
    console.error('Calculate pricing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}