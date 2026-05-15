'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast, { useToast } from '@/components/Toast';
import { POINTS_PLANS, POINTS_PER_CARD } from '@/lib/constants';

export default function BuyPointsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast, showToast, clearToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      window.location.href = data.url;
    } catch (err: any) {
      showToast({ message: err.message || '無法建立付款', type: 'error' });
      setLoading(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-electric-400/60 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif font-bold text-ink-white">購買點數</h1>
            <p className="text-ink-gray mt-2">
              按需購買，無月費負擔。每次生成消耗 {POINTS_PER_CARD} 點
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
            {POINTS_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative card-elevated text-center p-8 transition-all hover:shadow-elevated ${
                  plan.popular ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                    最受歡迎
                  </div>
                )}

                <div className="text-4xl mb-3">🪙</div>
                <h2 className="font-serif text-xl font-bold text-ink-white mb-1">
                  {plan.name}
                </h2>
                <div className="text-3xl font-bold text-ink-white mb-2">
                  HK${plan.priceHKD}
                </div>
                <div className="text-ink-gray text-sm mb-1">
                  {plan.points} 點數
                </div>
                <div className="text-ink-dim text-xs mb-1">
                  （可生成 {plan.points / POINTS_PER_CARD} 張賀咭）
                </div>
                <div className="text-ink-dim text-xs mb-6">
                  每張費用 HK${(plan.priceHKD / (plan.points / POINTS_PER_CARD)).toFixed(1)}
                </div>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full !py-3.5 rounded-xl font-medium text-base transition-all ${
                    plan.popular
                      ? 'bg-electric-500 text-white hover:bg-electric-400/100 shadow-lg shadow-amber-400/25'
                      : 'bg-surface-card text-ink-white border-2 border-white/[0.15] hover:border-electric-400/60 hover:text-electric-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? '處理中…' : '選擇方案'}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12 card p-8">
            <h3 className="font-serif font-semibold text-ink-white mb-4 text-center">常見問題</h3>
            <div className="space-y-4 max-w-lg mx-auto">
              {[
                { q: '每次生成消耗多少點？', a: `每次製作賀卡消耗 ${POINTS_PER_CARD} 點，無論圖片大小或風格。` },
                { q: '生成失敗會退款嗎？', a: '是的。如果 AI 生成失敗，系統會自動將點數退回你的帳戶。' },
                { q: '點數會過期嗎？', a: '不會。購買的點數永久有效，不設使用期限。' },
                { q: '支援哪些付款方式？', a: '透過 Stripe 安全付款，支援 Visa、Mastercard 等主要信用卡。' },
              ].map((faq) => (
                <div key={faq.q} className="text-sm">
                  <p className="font-medium text-ink-white mb-1">{faq.q}</p>
                  <p className="text-ink-gray">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-ink-dim space-y-1">
            <p>由於 AI 生圖屬數位內容服務，一經購買即時生效，所有點數購買均不設退款</p>
            <p>付款即代表您同意本平台的服務條款與退款政策</p>
          </div>
        </div>
      </main>
      <Footer />
      {toast && <Toast {...toast} onClose={clearToast} />}
    </>
  );
}
