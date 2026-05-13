import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}

export async function createCheckoutSession(params: {
  planId: string;
  priceHKD: number;
  points: number;
  userId: string;
  userEmail: string;
}) {
  const stripe = getStripe();
  const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'hkd',
          product_data: {
            name: `RayCardAI ${params.points} 點數`,
            description: `HK$${params.priceHKD} 購買 ${params.points} 點（可製作 ${params.points / 10} 張賀卡）`,
          },
          unit_amount: params.priceHKD * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: params.userId,
      points: params.points.toString(),
      planId: params.planId,
    },
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/payment/cancel`,
  });

  return session;
}

export async function retrieveCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  return await stripe.checkout.sessions.retrieve(sessionId);
}
