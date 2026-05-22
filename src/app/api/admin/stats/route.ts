import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalRevenue,
    todayCards,
    totalCards,
    topFestivals,
    topStyles,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { amountHKD: true },
      where: { status: 'completed' },
    }),
    prisma.card.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.card.count(),
    prisma.card.groupBy({
      by: ['festival'],
      _count: { festival: true },
      orderBy: { _count: { festival: 'desc' } },
      take: 5,
    }),
    prisma.card.groupBy({
      by: ['styleId'],
      _count: { styleId: true },
      orderBy: { _count: { styleId: 'desc' } },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalRevenue: totalRevenue._sum.amountHKD || 0,
    todayCards,
    totalCards,
    topFestivals: topFestivals.map((f) => ({ name: f.festival, count: f._count.festival })),
    topStyles: topStyles.map((s) => ({ name: s.styleId, count: s._count.styleId })),
  });
}
