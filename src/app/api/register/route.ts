import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SIGNUP_BONUS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: '請填寫所有必填欄位' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密碼至少需要 6 個字元' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '此電郵已註冊' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        points: SIGNUP_BONUS,
        transactions: {
          create: {
            type: 'credit',
            amount: SIGNUP_BONUS,
            description: '註冊贈送點數',
          },
        },
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      points: user.points,
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: '註冊失敗，請稍後再試' }, { status: 500 });
  }
}
