import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event;
    try {
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

        // Update order
        const existingOrder = await prisma.order.findUnique({
          where: { stripeSessionId: checkoutSession.id },
        });

        if (!existingOrder) {
          // Create order and add points
          await prisma.order.create({
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

          await prisma.user.update({
            where: { id: userId },
            data: { points: { increment: pointsNum } },
          });

          await prisma.pointTransaction.create({
            data: {
              userId,
              type: 'credit',
              amount: pointsNum,
              description: `購買 ${planId || ''} ${pointsNum} 點數`,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
