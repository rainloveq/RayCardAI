import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/checkSession';
import { POINTS_PER_CARD } from '@/lib/constants';
import { generateCardImage, buildKIEPrompt } from '@/lib/kie';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ cards });
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    return NextResponse.json({ error: '獲取記錄失敗' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const body = await req.json();
    const {
      originalImageUrl, festival, styleId, styleType,
      decorations, greetingText, extraInstructions, customPrompt,
    } = body;

    // Validation
    if (!originalImageUrl || !festival || !styleId || !styleType || !greetingText) {
      return NextResponse.json({ error: '請填寫所有必填欄位' }, { status: 400 });
    }

    // Check points
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.points < POINTS_PER_CARD) {
      return NextResponse.json({ error: '點數不足，請先購買點數' }, { status: 403 });
    }

    // Create card record
    const card = await prisma.card.create({
      data: {
        userId,
        originalImageUrl,
        festival,
        styleId,
        styleType,
        decorations: decorations || [],
        greetingText,
        extraInstructions,
        status: 'generating',
      },
    });

    // Deduct points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: POINTS_PER_CARD } },
    });
    await prisma.pointTransaction.create({
      data: {
        userId,
        type: 'debit',
        amount: POINTS_PER_CARD,
        description: `製作賀卡（${festival}）`,
        referenceId: card.id,
      },
    });

    // Build KIE prompt using new style system
    const prompt = buildKIEPrompt({
      styleType: styleType as 'character' | 'illustration',
      styleId,
      customPrompt,
      festival,
      decorations: decorations || [],
      greetingText,
      extraInstructions,
    });

    // Call KIE AI
    try {
      const generatedImageUrl = await generateCardImage({
        imageUrl: originalImageUrl,
        prompt,
      });

      await prisma.card.update({
        where: { id: card.id },
        data: {
          status: 'completed',
          generatedImageUrl,
          completedAt: new Date(),
        },
      });
    } catch (err) {
      // Refund points on failure
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: POINTS_PER_CARD } },
      });
      await prisma.pointTransaction.create({
        data: {
          userId,
          type: 'credit',
          amount: POINTS_PER_CARD,
          description: `生成失敗退回點數（${festival}）`,
          referenceId: card.id,
        },
      });
      await prisma.card.update({
        where: { id: card.id },
        data: { status: 'failed' },
      });

      return NextResponse.json({
        card: { ...card, status: 'failed' },
        error: '賀卡生成失敗，已退回點數',
      }, { status: 500 });
    }

    return NextResponse.json({
      card: await prisma.card.findUnique({ where: { id: card.id } }),
    });
  } catch (err) {
    console.error('Create card error:', err);
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    return NextResponse.json({ error: '製作賀卡失敗' }, { status: 500 });
  }
}
