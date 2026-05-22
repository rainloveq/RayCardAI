import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete gallery associations first, then the card
  await prisma.$transaction(async (tx) => {
    await tx.like.deleteMany({ where: { galleryCardId: params.id } });
    await tx.galleryCard.deleteMany({ where: { cardId: params.id } });
    await tx.card.delete({ where: { id: params.id } });
  });

  return NextResponse.json({ success: true });
}
