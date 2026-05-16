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

    const galleryCard = await prisma.galleryCard.findUnique({
      where: { cardId: params.id },
    });

    if (!galleryCard || galleryCard.userId !== userId) {
      return NextResponse.json({ error: '無權限' }, { status: 403 });
    }

    await prisma.galleryCard.update({
      where: { cardId: params.id },
      data: { isPublic: false },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Unpublish error:', err);
    return NextResponse.json({ error: '取消發布失敗' }, { status: 500 });
  }
}
