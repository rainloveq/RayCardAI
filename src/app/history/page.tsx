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
  const [publishing, setPublishing] = useState(false);
  const [cardPublishState, setCardPublishState] = useState<Record<string, boolean>>({});

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

  const handleDelete = async (card: Card, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`確定要刪除這張 ${card.festival} 賀卡嗎？此操作無法復原。`)) return;

    try {
      const res = await fetch(`/api/cards/${card.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== card.id));
        if (selectedCard?.id === card.id) setSelectedCard(null);
      }
    } catch {
      // silently fail
    }
  };

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

  const handleTogglePublish = async (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPublishing(true);
    const isPub = cardPublishState[cardId] || false;
    const endpoint = isPub ? 'unpublish' : 'publish';
    try {
      const res = await fetch(`/api/cards/${cardId}/${endpoint}`, { method: 'POST' });
      if (res.ok) {
        setCardPublishState((prev) => ({ ...prev, [cardId]: !isPub }));
      }
    } catch {}
    setPublishing(false);
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold text-ink-white">
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
              <div className="animate-spin w-8 h-8 border-2 border-electric-400/60 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : cards.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">🎴</div>
              <p className="text-ink-gray mb-3">還沒有生成記錄</p>
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
                    className="bg-surface-card rounded-xl max-w-lg w-full p-5 animate-fade-in shadow-elevated"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="aspect-[3/4] bg-cosmos-800 rounded-lg overflow-hidden mb-4">
                      {selectedCard.generatedImageUrl && (
                        <img
                          src={selectedCard.generatedImageUrl}
                          alt="賀咭"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-center text-sm text-ink-gray mb-4">
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
                        onClick={(e) => handleDelete(selectedCard, e)}
                        className="btn-secondary flex-1 text-danger"
                      >
                        🗑️ 刪除
                      </button>
                      <button
                        onClick={(e) => handleTogglePublish(selectedCard.id, e)}
                        disabled={publishing}
                        className="btn-secondary"
                      >
                        {cardPublishState[selectedCard.id] ? '🔒 取消公開' : '🌐 設為公開'}
                      </button>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="btn-secondary"
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
                    className="card p-3 cursor-pointer hover:shadow-elevated transition-all group relative"
                    onClick={() => setSelectedCard(card)}
                  >
                    <button
                      onClick={(e) => handleDelete(card, e)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-cosmos-900/80 hover:bg-danger hover:text-white text-ink-gray rounded-full flex items-center justify-center text-sm shadow opacity-0 group-hover:opacity-100 transition-all"
                      title="刪除"
                    >
                      🗑️
                    </button>
                    <div className="aspect-[3/4] bg-cosmos-800 rounded-lg mb-2 overflow-hidden">
                      {card.generatedImageUrl ? (
                        <img
                          src={card.generatedImageUrl}
                          alt="賀咭"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : card.status === 'failed' ? (
                        <div className="w-full h-full flex items-center justify-center text-ink-dim text-sm">
                          生成失敗
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-dim text-sm">
                          ⏳ 生成中…
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-ink-white truncate">
                      {card.festival}
                    </div>
                    <div className="text-xs text-ink-dim">
                      {formatDate(card.createdAt)}
                    </div>
                    {card.status === 'failed' && (
                      <div className="text-xs text-danger mt-1">⚠ 生成失敗</div>
                    )}
                    {card.status === 'generating' && (
                      <div className="text-xs text-electric-300 mt-1">⏳ 生成中</div>
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
