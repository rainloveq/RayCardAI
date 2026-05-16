import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';

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

    if (card.status !== 'completed') {
      return NextResponse.json({ error: '只有已完成的卡片可以公開' }, { status: 400 });
    }

    await prisma.galleryCard.upsert({
      where: { cardId: card.id },
      create: {
        cardId: card.id,
        userId,
        isPublic: true,
        publishedAt: new Date(),
      },
      update: {
        isPublic: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Publish error:', err);
    return NextResponse.json({ error: '發布失敗' }, { status: 500 });
  }
}
