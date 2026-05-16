'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GalleryItem {
  id: string;
  imageUrl: string | null;
  festival: string;
  greetingText: string;
  createdAt: string;
  publishedAt: string;
  author: { id: string; name: string; image: string | null };
  likesCount: number;
}

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCard, setSelectedCard] = useState<GalleryItem | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch(`/api/gallery?page=${page}&limit=20`)
        .then((r) => r.json())
        .then((d) => {
          setCards(d.cards || []);
          setTotalPages(d.totalPages || 1);
          const likeState: Record<string, { count: number; liked: boolean }> = {};
          (d.cards || []).forEach((c: GalleryItem) => {
            likeState[c.id] = { count: c.likesCount || 0, liked: false };
          });
          setLikes(likeState);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session, page]);

  const handleLike = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading === cardId) return;
    setLikeLoading(cardId);
    try {
      const res = await fetch(`/api/gallery/${cardId}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setLikes((prev) => ({
          ...prev,
          [cardId]: {
            count: data.liked ? prev[cardId].count + 1 : prev[cardId].count - 1,
            liked: data.liked,
          },
        }));
      }
    } catch {}
    setLikeLoading(null);
  };

  const handleDownload = async (card: GalleryItem) => {
    if (!card.imageUrl) return;
    try {
      const res = await fetch(card.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raycardai-${card.id.slice(0, 8)}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(card.imageUrl, '_blank');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full" />
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
              🖼️ 探索作品
            </h1>
            <Link href="/create" className="btn-primary text-sm !px-4 !py-2">
              ✨ 製作賀卡
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : cards.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">🎨</div>
              <p className="text-ink-gray mb-3">還沒有人分享作品，成為第一個！</p>
              <Link href="/create" className="btn-primary inline-block">
                ✨ 製作第一張賀卡
              </Link>
            </div>
          ) : (
            <>
              {/* Modal */}
              {selectedCard && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
                  onClick={() => setSelectedCard(null)}
                >
                  <div
                    className="bg-surface-card rounded-xl max-w-lg w-full p-5 animate-fade-in shadow-elevated"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="aspect-[3/4] bg-cosmos-800 rounded-lg overflow-hidden mb-4">
                      {selectedCard.imageUrl && (
                        <img src={selectedCard.imageUrl} alt="賀卡" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-ink-gray">{selectedCard.author.name}</span>
                      <span className="text-sm text-ink-gray">{selectedCard.festival}</span>
                    </div>
                    <p className="text-ink-dim text-sm mb-4">{selectedCard.greetingText}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDownload(selectedCard)} className="btn-primary flex-1">
                        📥 下載
                      </button>
                      <button onClick={() => setSelectedCard(null)} className="btn-secondary">
                        關閉
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="card p-3 cursor-pointer hover:shadow-elevated transition-all group"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="aspect-[3/4] bg-cosmos-800 rounded-lg mb-2 overflow-hidden">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="賀卡" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-dim text-sm">圖片載入中</div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-ink-white truncate">{card.festival}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-ink-dim">{card.author.name}</span>
                      <button
                        onClick={(e) => handleLike(card.id, e)}
                        disabled={likeLoading === card.id}
                        className={`text-xs flex items-center gap-1 transition-colors ${
                          likes[card.id]?.liked ? 'text-danger' : 'text-ink-dim hover:text-danger'
                        }`}
                      >
                        ❤️ <span>{likes[card.id]?.count || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="btn-secondary text-sm !px-4 !py-2 disabled:opacity-30"
                  >
                    上一頁
                  </button>
                  <span className="text-sm text-ink-dim">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="btn-secondary text-sm !px-4 !py-2 disabled:opacity-30"
                  >
                    下一頁
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
