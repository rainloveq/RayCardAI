'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Card } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [points, setPoints] = useState<number | null>(null);
  const [recentCards, setRecentCards] = useState<Card[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/points')
        .then((r) => r.json())
        .then((d) => setPoints(d.points))
        .catch(() => {});

      fetch('/api/cards?limit=4')
        .then((r) => r.json())
        .then((d) => setRecentCards(d.cards || []))
        .catch(() => {});
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto animate-fade-in">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif font-bold text-brown-600">
              你好，{session?.user?.name} 👋
            </h1>
            <p className="text-brown-400 mt-1">準備好製作一張獨一無二的賀咭了嗎？</p>
          </div>

          {/* Points card */}
          <div className="bg-gradient-to-br from-brown-600 to-brown-700 rounded-xl p-6 text-white mb-8 shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/80 text-sm">剩餘點數</p>
                <p className="text-4xl font-bold mt-1">
                  {points !== null ? points : '—'}
                </p>
                <p className="text-amber-200/60 text-xs mt-1">
                  每次製作消耗 10 點 · 新用戶免費獲得 20 點
                </p>
              </div>
              <div className="text-right space-y-2">
                <Link
                  href="/create"
                  className="inline-block bg-amber-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-amber-500 transition-colors shadow-lg"
                >
                  ✨ 製作賀咭
                </Link>
                <br />
                <Link
                  href="/buy-points"
                  className="inline-block text-amber-200/70 text-xs hover:text-amber-200 transition-colors"
                >
                  購買點數 →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { href: '/create', icon: '✨', label: '製作賀咭' },
              { href: '/history', icon: '📖', label: '歷史記錄' },
              { href: '/buy-points', icon: '🪙', label: '購買點數' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card hover:shadow-elevated transition-all text-center p-5 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-sm font-medium text-brown-600">{item.label}</div>
              </Link>
            ))}
          </div>

          {/* Recent cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-semibold text-brown-600">最近製作</h2>
              <Link href="/history" className="text-sm text-amber-400 hover:text-amber-500 font-medium">
                查看全部 →
              </Link>
            </div>

            {recentCards.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-5xl mb-4">🎴</div>
                <p className="text-brown-400 mb-3">還沒有生成記錄</p>
                <Link
                  href="/create"
                  className="btn-primary inline-block"
                >
                  ✨ 製作第一張賀咭
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentCards.map((card) => (
                  <Link
                    key={card.id}
                    href="/history"
                    className="card p-3 hover:shadow-elevated transition-all group"
                  >
                    <div className="aspect-[3/4] bg-cream-100 rounded-lg mb-2 overflow-hidden">
                      {card.generatedImageUrl ? (
                        <img
                          src={card.generatedImageUrl}
                          alt="賀咭"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🎨
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-brown-400 truncate">
                      {card.festival}
                    </div>
                    <div className="text-xs text-brown-300">
                      {card.status === 'completed' ? '✅ 已完成' :
                       card.status === 'generating' ? '⏳ 生成中' :
                       card.status === 'failed' ? '❌ 失敗' : '📝 待處理'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
