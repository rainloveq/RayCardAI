import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event;
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as any;
      const { userId, points, planId } = checkoutSession.metadata;

      if (userId && points) {
        const pointsNum = parseInt(points);

        await prisma.$transaction(async (tx) => {
          // Check if already processed
          const existingOrder = await tx.order.findFirst({
            where: { stripeSessionId: checkoutSession.id },
          });

          if (existingOrder) return; // Already processed, skip

          // Create order
          await tx.order.create({
            data: {
              userId,
              amountHKD: checkoutSession.amount_total / 100,
              points: pointsNum,
              stripeSessionId: checkoutSession.id,
              stripePaymentIntent: checkoutSession.payment_intent,
              status: 'completed',
              completedAt: new Date(),
            },
          });

          // Add points
          await tx.user.update({
            where: { id: userId },
            data: { points: { increment: pointsNum } },
          });

          // Record transaction
          await tx.pointTransaction.create({
            data: {
              userId,
              type: 'credit',
              amount: pointsNum,
              description: `購買 ${planId || ''} ${pointsNum} 點數`,
            },
          });
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
