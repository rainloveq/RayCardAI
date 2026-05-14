import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { requireAuth } from '@/lib/checkSession';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: '缺少 sessionId' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: '付款未完成' }, { status: 400 });
    }

    // Verify this session belongs to the current user
    if (checkoutSession.metadata?.userId !== userId) {
      return NextResponse.json({ error: '無權限' }, { status: 403 });
    }

    const points = parseInt(checkoutSession.metadata?.points || '0');
    if (!points) {
      return NextResponse.json({ error: '無效的點數' }, { status: 400 });
    }

    // Idempotency check — already processed?
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existingOrder) {
      // Already credited, return current points
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return NextResponse.json({ points: user?.points || 0, alreadyProcessed: true });
    }

    // Create order and add points
    await prisma.order.create({
      data: {
        userId,
        amountHKD: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0,
        points,
        stripeSessionId: sessionId,
        stripePaymentIntent: checkoutSession.payment_intent as string || null,
        status: 'completed',
        completedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    await prisma.pointTransaction.create({
      data: {
        userId,
        type: 'credit',
        amount: points,
        description: `購買 ${checkoutSession.metadata?.planId || ''} ${points} 點數`,
      },
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

    return NextResponse.json({ points: updatedUser?.points || 0, alreadyProcessed: false });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Verify session error:', err);
    return NextResponse.json({ error: '驗證付款失敗' }, { status: 500 });
  }
}
