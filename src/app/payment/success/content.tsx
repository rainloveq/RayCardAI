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

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }
    const timer = setTimeout(() => {
      setStatus('success');
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-b from-amber-50/30 to-transparent">
        <div className="text-center animate-fade-in">
          {status === 'loading' && (
            <div>
              <div className="animate-spin w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-brown-600 font-medium">確認付款狀態中…</p>
              <p className="text-brown-400 text-sm mt-2">付款可能需要幾分鐘才能確認</p>
            </div>
          )}

          {status === 'success' && (
            <div className="card-elevated max-w-sm mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-serif font-bold text-brown-600 mb-2">
                付款成功！
              </h1>
              <p className="text-brown-400 mb-6">
                你的點數已成功發放至帳戶
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/create" className="btn-primary text-center !py-3">
                  ✨ 立即製作賀咭
                </Link>
                <Link href="/dashboard" className="btn-secondary text-center">
                  返回儀表板
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
              <p className="text-brown-400 mb-6">
                請稍後查看儀表板確認點數是否到帳
              </p>
              <Link href="/dashboard" className="btn-primary inline-block">
                返回儀表板
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
