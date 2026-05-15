import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SIGNUP_BONUS } from '@/lib/constants';
import { rateLimit, getClientIP, isValidEmail, isStrongPassword } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIP = getClientIP(req);

    // Rate limit: max 3 registrations per IP per hour
    const rl = rateLimit(`register:${clientIP}`, 3, 60 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json({
        error: '註冊次數過多，請稍後再試',
        retryAfter: Math.ceil((rl.resetAt - Date.now()) / 1000),
      }, { status: 429 });
    }

    const { email, password, displayName, recaptchaToken } = await req.json();

    // Validate display name
    if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 1) {
      return NextResponse.json({ error: '請輸入名稱' }, { status: 400 });
    }
    if (displayName.length > 50) {
      return NextResponse.json({ error: '名稱不能超過 50 個字元' }, { status: 400 });
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: '請輸入有效的電郵地址' }, { status: 400 });
    }

    // Validate password strength
    const pwCheck = isStrongPassword(password || '');
    if (!pwCheck.valid) {
      return NextResponse.json({ error: pwCheck.message }, { status: 400 });
    }

    // Verify reCAPTCHA if token provided
    if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success || verifyData.score < 0.5) {
        return NextResponse.json({ error: '驗證失敗，請重新嘗試' }, { status: 400 });
      }
    }

    // Check for existing email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '此電郵已被註冊' }, { status: 409 });
    }

    // Check for excessive registrations from same IP (abuse detection)
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    // If too many registrations recently, require reCAPTCHA
    if (recentUsers > 50 && !recaptchaToken) {
      return NextResponse.json({ error: '請完成驗證後再註冊' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Atomic: create user + record signup bonus
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          displayName: displayName.trim(),
          points: SIGNUP_BONUS,
        },
      });

      await tx.pointTransaction.create({
        data: {
          userId: newUser.id,
          type: 'credit',
          amount: SIGNUP_BONUS,
          description: '註冊贈送點數',
        },
      });

      return newUser;
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
