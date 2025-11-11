import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DatabaseWebhookService } from '@/lib/database-webhook';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow authenticated users to check webhook status
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get webhook configuration
    const config = DatabaseWebhookService.getWebhookConfig();
    
    // Test connectivity if webhook is configured
    let connectivity = null;
    if (config.configured) {
      connectivity = await DatabaseWebhookService.testWebhookConnectivity();
    }

    return NextResponse.json({
      success: true,
      data: {
        configuration: config,
        connectivity,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Database webhook status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check database webhook status' },
      { status: 500 }
    );
  }
}