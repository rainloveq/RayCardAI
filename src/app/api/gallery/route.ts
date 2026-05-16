import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.galleryCard.findMany({
        where: { isPublic: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          cardId: true,
          publishedAt: true,
          user: { select: { id: true, displayName: true, image: true } },
          card: {
            select: {
              id: true,
              generatedImageUrl: true,
              festival: true,
              greetingText: true,
              createdAt: true,
            },
          },
          _count: { select: { likes: true } },
        },
      }),
      prisma.galleryCard.count({ where: { isPublic: true } }),
    ]);

    const cards = items.map((item) => ({
      id: item.cardId,
      imageUrl: item.card.generatedImageUrl,
      festival: item.card.festival,
      greetingText: item.card.greetingText,
      createdAt: item.card.createdAt,
      publishedAt: item.publishedAt,
      author: { id: item.user.id, name: item.user.displayName, image: item.user.image },
      likesCount: item._count.likes,
    }));

    return NextResponse.json({ cards, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Gallery list error:', err);
    return NextResponse.json({ error: '獲取作品失敗' }, { status: 500 });
  }
}
