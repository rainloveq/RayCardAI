'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('缺少付款 session');
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus('error');
          setErrorMsg(data.error || '驗證失敗');
          return;
        }

        setStatus('success');
      } catch (err: any) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err.message || '網絡錯誤');
        }
      }
    };

    verifyPayment();

    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-b from-amber-50/30 to-transparent">
        <div className="text-center animate-fade-in">
          {status === 'loading' && (
            <div>
              <div className="animate-spin w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-brown-600 font-medium">驗證付款中…</p>
              <p className="text-brown-400 text-sm mt-2">請稍候，正在確認付款並發放點數</p>
            </div>
          )}

          {status === 'success' && (
            <div className="card-elevated max-w-sm mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-serif font-bold text-brown-600 mb-2">
                付款成功！
              </h1>
              <p className="text-brown-400 mb-2">
                你的點數已成功發放至帳戶
              </p>
              <p className="text-xs text-brown-300 mb-6">
                可在主頁查看剩餘點數
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/create" className="btn-primary text-center !py-3">
                  ✨ 立即製作賀咭
                </Link>
                <Link href="/dashboard" className="btn-secondary text-center">
                  返回主頁
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="card-elevated max-w-sm mx-auto">
              <div className="text-5xl mb-4">🤔</div>
              <h1 className="text-2xl font-serif font-bold text-brown-600 mb-2">
                付款確認中
              </h1>
              <p className="text-brown-400 mb-4">
                {errorMsg || '付款已成功，但點數發放需要一些時間'}
              </p>
              <p className="text-xs text-brown-300 mb-6">
                系統會透過 Webhook 自動補發點數，請稍後查看主頁
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="btn-primary inline-block text-center">
                  查看主頁
                </Link>
                <Link href="/create" className="btn-secondary text-center">
                  返回製作賀咭
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
