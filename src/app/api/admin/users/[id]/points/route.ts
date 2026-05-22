import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, reason } = await req.json();
  if (!amount || typeof amount !== 'number') {
    return NextResponse.json({ error: '無效的點數' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: params.id },
      data: { points: { increment: amount } },
    });
    await tx.pointTransaction.create({
      data: {
        userId: params.id,
        type: amount > 0 ? 'credit' : 'debit',
        amount: Math.abs(amount),
        description: `管理員${amount > 0 ? '加' : '扣'}點：${reason || '無原因'}`,
      },
    });
  });

  const user = await prisma.user.findUnique({ where: { id: params.id }, select: { points: true } });
  return NextResponse.json({ points: user?.points });
}
