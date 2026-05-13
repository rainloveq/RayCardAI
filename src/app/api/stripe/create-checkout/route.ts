import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/checkSession';
import { createCheckoutSession } from '@/lib/stripe';
import { POINTS_PLANS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const userEmail = session.user.email;

    const { planId } = await req.json();
    const plan = POINTS_PLANS.find((p) => p.id === planId);

    if (!plan) {
      return NextResponse.json({ error: '無效的方案' }, { status: 400 });
    }

    const checkoutSession = await createCheckoutSession({
      planId: plan.id,
      priceHKD: plan.priceHKD,
      points: plan.points,
      userId,
      userEmail,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: '請先登入' }, { status: 401 });
    }
    console.error('Checkout error:', err);
    return NextResponse.json({ error: '建立付款失敗' }, { status: 500 });
  }
}
