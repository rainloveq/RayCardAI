import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth';

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 50;
  const userId = searchParams.get('userId') || '';

  const where: any = {};
  if (userId) where.userId = userId;

  const [cards, total] = await Promise.all([
    prisma.card.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.card.count({ where }),
  ]);

  return NextResponse.json({ cards, total, page, totalPages: Math.ceil(total / limit) });
}
