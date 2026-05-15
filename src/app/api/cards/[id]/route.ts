import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';
import { checkKIETaskStatus } from '@/lib/kie';
import { POINTS_PER_CARD } from '@/lib/constants';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const card = await prisma.card.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!card) {
      return NextResponse.json({ error: '卡片不存在' }, { status: 404 });
    }

    // If card is still generating and has a KIE taskId, check status
    if (card.status === 'generating' && card.taskId) {
      try {
        const kieResult = await checkKIETaskStatus(card.taskId);

        if (kieResult.state === 'success' && kieResult.imageUrl) {
          await prisma.card.update({
            where: { id: card.id },
            data: {
              status: 'completed',
              generatedImageUrl: kieResult.imageUrl,
              completedAt: new Date(),
            },
          });
          card.status = 'completed';
          card.generatedImageUrl = kieResult.imageUrl;
        } else if (kieResult.state === 'failed') {
          // Refund points atomically
          await prisma.$transaction(async (tx) => {
            await tx.user.update({
              where: { id: session.user.id },
              data: { points: { increment: POINTS_PER_CARD } },
            });
            await tx.pointTransaction.create({
              data: {
                userId: session.user.id,
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
          card.status = 'failed';
        }
        // 'processing' → no update, still waiting
      } catch {
        // KIE check failed (network etc.) — don't update, just return current status
      }
    }

    return NextResponse.json({ card });
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    return NextResponse.json({ error: '獲取卡片失敗' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const card = await prisma.card.findFirst({
      where: { id: params.id, userId },
    });

    if (!card) {
      return NextResponse.json({ error: '卡片不存在' }, { status: 404 });
    }

    await prisma.card.delete({ where: { id: card.id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Delete card error:', err);
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 });
  }
}
