import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';
import { POINTS_PER_CARD } from '@/lib/constants';

export async function POST(
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

    if (card.status !== 'generating') {
      return NextResponse.json({ error: '卡片狀態不需要取消' }, { status: 400 });
    }

    // Refund points and mark as failed atomically
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: POINTS_PER_CARD } },
      });
      await tx.pointTransaction.create({
        data: {
          userId,
          type: 'credit',
          amount: POINTS_PER_CARD,
          description: `用戶取消生成退回點數（${card.festival}）`,
          referenceId: card.id,
        },
      });
      await tx.card.update({
        where: { id: card.id },
        data: { status: 'failed' },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Cancel card error:', err);
    return NextResponse.json({ error: '取消失敗' }, { status: 500 });
  }
}
