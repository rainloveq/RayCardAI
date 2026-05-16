import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';

export async function POST(
  _req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const galleryCard = await prisma.galleryCard.findUnique({
      where: { cardId: params.cardId },
    });

    if (!galleryCard || !galleryCard.isPublic) {
      return NextResponse.json({ error: '作品不存在' }, { status: 404 });
    }

    if (galleryCard.userId === userId) {
      return NextResponse.json({ error: '不能對自己的作品按讚' }, { status: 400 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_galleryCardId: { userId, galleryCardId: params.cardId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: { userId, galleryCardId: params.cardId },
    });

    return NextResponse.json({ liked: true });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Like error:', err);
    return NextResponse.json({ error: '操作失敗' }, { status: 500 });
  }
}
