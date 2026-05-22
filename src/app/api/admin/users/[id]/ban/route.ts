import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id }, select: { isBanned: true } });
  if (!user) return NextResponse.json({ error: '用戶不存在' }, { status: 404 });

  await prisma.user.update({
    where: { id: params.id },
    data: { isBanned: !user.isBanned },
  });

  return NextResponse.json({ isBanned: !user.isBanned });
}
