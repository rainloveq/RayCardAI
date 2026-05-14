import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { POINTS_PER_CARD } from '@/lib/constants';

// KIE AI callback endpoint
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, state, imageUrl } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'missing taskId' }, { status: 400 });
    }

    const card = await prisma.card.findFirst({ where: { taskId } });
    if (!card) {
      return NextResponse.json({ error: 'card not found' }, { status: 404 });
    }

    // Idempotency: only process if card is still 'generating'
    if (card.status !== 'generating') {
      return NextResponse.json({ received: true, skipped: true });
    }

    if (state === 'success' && imageUrl) {
      await prisma.card.update({
        where: { id: card.id },
        data: {
          status: 'completed',
          generatedImageUrl: imageUrl,
          completedAt: new Date(),
        },
      });
    } else if (state === 'fail' || state === 'failed') {
      // Refund points atomically
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: card.userId },
          data: { points: { increment: POINTS_PER_CARD } },
        });
        await tx.pointTransaction.create({
          data: {
            userId: card.userId,
            type: 'credit',
            amount: POINTS_PER_CARD,
            description: `生成失敗退回點數（${card.festival}）`,
            referenceId: card.id,
          },
        });
        await tx.card.update({
          where: { id: card.id },
          data: { status: 'failed' },
        });
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('KIE callback error:', err);
    return NextResponse.json({ error: 'callback failed' }, { status: 500 });
  }
}
