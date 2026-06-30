import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    oauthOnly: !user.passwordHash, // No password = OAuth-only account
  });
}
