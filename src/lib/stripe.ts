import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

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
          unit_amount: params.priceHKD * 100, // cents
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
  return await stripe.checkout.sessions.retrieve(sessionId);
}
