'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GalleryItem {
  id: string;
  imageUrl: string | null;
  festival: string;
  author: { name: string };
}

export default function HomePage() {
  const { data: session } = useSession();
  const [galleryCards, setGalleryCards] = useState<GalleryItem[]>([]);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch public gallery cards for preview
    fetch('/api/gallery?page=1&limit=8')
      .then((r) => r.json())
      .then((d) => setGalleryCards(d.cards || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setVisibleCards((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-cosmos-950">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Ambient light orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-electric-500/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-plasma-500/10 blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-electric-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              opacity: 0.2 + Math.random() * 0.4,
            }}
          />
        ))}

        <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-ink-gray">AI 驅動 · 一分鐘生成個人化賀卡</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ink-white mb-6 leading-tight">
            AI 個人化賀卡
            <br />
            <span className="bg-gradient-to-r from-electric-400 via-plasma-400 to-neon-400 bg-clip-text text-transparent">
              一分鐘搞定
            </span>
          </h1>

          <p className="text-lg text-ink-gray mb-10 max-w-md mx-auto">
            上傳照片 → AI 生成 → 分享祝福
          </p>

          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4">
              <Link href="/create" className="btn-primary !px-10 !py-4 !text-lg !rounded-2xl inline-flex items-center gap-3 shadow-glow-lg hover:shadow-glow-lg hover:scale-105 transition-all duration-300">
                <span>✨</span> 開始製作賀卡
              </Link>
              <p className="text-xs text-ink-dim">歡迎回來，{session.user?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => signIn('google', { callbackUrl: '/create' })}
                className="group relative inline-flex items-center gap-4 px-10 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-lg shadow-glow-lg hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                使用 Google 免費開始
              </button>
              <p className="text-xs text-ink-dim">註冊送 20 點 · 無需信用卡</p>
            </div>
          )}

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="w-6 h-6 text-ink-dim mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-ink-white mb-4">
            三步完成你的專屬賀卡
          </h2>
          <p className="text-center text-ink-gray mb-16">不用設計功底，不用複雜操作</p>

          <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📸', title: '上傳照片', desc: '拖放或點擊上傳，支援 JPG/PNG，自動壓縮優化', color: 'from-electric-500/20 to-electric-600/10' },
              { icon: '🤖', title: 'AI 生成', desc: '21 個背景主題 + 11 種畫風，保留真人樣貌不變', color: 'from-plasma-500/20 to-plasma-600/10' },
              { icon: '📤', title: '一鍵分享', desc: '社群分享圖自動生成，作品牆展示，下載動態賀卡', color: 'from-neon-500/20 to-neon-600/10' },
            ].map((feature, i) => (
              <div
                key={i}
                data-index={i}
                className={`feature-card card-elevated text-center p-8 transition-all duration-700 ${
                  visibleCards.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 text-4xl`}>
                  {feature.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-ink-white mb-3">{feature.title}</h3>
                <p className="text-sm text-ink-gray leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {galleryCards.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-ink-white mb-2">探索社群作品</h2>
                <p className="text-ink-gray">看看其他人製作的賀卡</p>
              </div>
              <Link href="/gallery" className="btn-secondary text-sm">
                瀏覽全部 →
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
              {[...galleryCards, ...galleryCards].slice(0, 8).map((card, i) => (
                <div
                  key={`${card.id}-${i}`}
                  className="flex-shrink-0 w-40 sm:w-48 scroll-snap-align-start group cursor-pointer"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="aspect-[3/4] bg-cosmos-800 rounded-xl overflow-hidden mb-2 shadow-elevated group-hover:shadow-glow transition-all duration-300">
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.festival}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className="text-xs text-ink-dim truncate">{card.festival}</p>
                  <p className="text-xs text-ink-dim/60">{card.author.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-ink-white mb-4">準備好創作了嗎？</h2>
          <p className="text-ink-gray mb-8">加入數千用戶，用 AI 創造獨一無二的賀卡</p>
          {!isLoggedIn && (
            <button
              onClick={() => signIn('google', { callbackUrl: '/create' })}
              className="group relative inline-flex items-center gap-4 px-10 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-lg shadow-glow-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 免費開始
            </button>
          )}
          {isLoggedIn && (
            <Link href="/create" className="btn-primary !px-10 !py-4 !text-lg !rounded-2xl inline-flex items-center gap-3 shadow-glow-lg">
              <span>✨</span> 開始製作賀卡
            </Link>
          )}
          <div className="mt-4">
            <Link href="/gallery" className="text-sm text-ink-dim hover:text-ink-gray transition-colors">
              或瀏覽作品牆 →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
