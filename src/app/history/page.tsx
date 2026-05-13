'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Card } from '@/types';
import { formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/cards?limit=100')
        .then((r) => r.json())
        .then((d) => setCards(d.cards || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleDownload = async (card: Card) => {
    if (!card.generatedImageUrl) return;
    try {
      const res = await fetch(card.generatedImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raycardai-${card.id.slice(0, 8)}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(card.generatedImageUrl, '_blank');
    }
  };

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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold text-brown-600">
              歷史記錄
            </h1>
            <Link
              href="/create"
              className="btn-primary text-sm !px-4 !py-2"
            >
              ✨ 製作新賀咭
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : cards.length === 0 ? (
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
            <>
              {/* Modal */}
              {selectedCard && (
                <div
                  className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
                  onClick={() => setSelectedCard(null)}
                >
                  <div
                    className="bg-white rounded-xl max-w-lg w-full p-5 animate-fade-in shadow-elevated"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="aspect-[3/4] bg-cream-100 rounded-lg overflow-hidden mb-4">
                      {selectedCard.generatedImageUrl && (
                        <img
                          src={selectedCard.generatedImageUrl}
                          alt="賀咭"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-center text-sm text-brown-400 mb-4">
                      {selectedCard.festival} · {formatDate(selectedCard.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(selectedCard)}
                        className="btn-primary flex-1"
                      >
                        📥 下載
                      </button>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="btn-secondary flex-1"
                      >
                        關閉
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="card p-3 cursor-pointer hover:shadow-elevated transition-all group"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="aspect-[3/4] bg-cream-100 rounded-lg mb-2 overflow-hidden">
                      {card.generatedImageUrl ? (
                        <img
                          src={card.generatedImageUrl}
                          alt="賀咭"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : card.status === 'failed' ? (
                        <div className="w-full h-full flex items-center justify-center text-brown-300 text-sm">
                          生成失敗
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-300 text-sm">
                          ⏳ 生成中…
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-brown-600 truncate">
                      {card.festival}
                    </div>
                    <div className="text-xs text-brown-300">
                      {formatDate(card.createdAt)}
                    </div>
                    {card.status === 'failed' && (
                      <div className="text-xs text-danger mt-1">⚠ 生成失敗</div>
                    )}
                    {card.status === 'generating' && (
                      <div className="text-xs text-amber-400 mt-1">⏳ 生成中</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
