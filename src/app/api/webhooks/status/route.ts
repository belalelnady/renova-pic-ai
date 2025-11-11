import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WebhookService } from '@/lib/webhook-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow authenticated users to check webhook status
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const aiTool = searchParams.get('aiTool');

    if (aiTool) {
      // Check status for specific AI tool
      const status = await WebhookService.getWebhookStatus(aiTool);
      
      return NextResponse.json({
        success: true,
        data: {
          aiTool,
          ...status,
        }
      });
    } else {
      // Check status for all AI tools
      const aiTools = ['visa-photo', 'absher', 'saudi-look', 'baby-photo'];
      const statusPromises = aiTools.map(async (tool) => {
        const status = await WebhookService.getWebhookStatus(tool);
        return {
          aiTool: tool,
          ...status,
        };
      });

      const statuses = await Promise.all(statusPromises);
      
      return NextResponse.json({
        success: true,
        data: statuses,
        summary: {
          total: statuses.length,
          available: statuses.filter(s => s.available).length,
          unavailable: statuses.filter(s => !s.available).length,
        }
      });
    }

  } catch (error) {
    console.error('Webhook status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check webhook status' },
      { status: 500 }
    );
  }
}