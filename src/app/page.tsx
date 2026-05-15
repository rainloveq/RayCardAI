'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-transparent" />
          <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 text-center relative">
            <div className="inline-flex items-center gap-2 bg-electric-400/10 text-electric-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-electric-400/20">
              <span>✨</span>
              <span>AI 個人化賀咭生成平台</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink-white leading-tight mb-4 text-balance">
              上傳相片，AI 為你生成
              <br />
              <span className="text-electric-300">獨一無二的賀咭</span>
            </h1>
            <p className="text-ink-gray text-lg max-w-lg mx-auto mb-8">
              上傳你的照片，選擇節日風格，AI 為你生成充滿個人色彩的賀咭圖片。
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/register"
                className="bg-electric-500 text-white px-8 py-3 rounded-xl font-medium text-base hover:bg-electric-400/100 active:scale-[0.98] transition-all shadow-lg shadow-amber-400/25"
              >
                立即免費試用
              </Link>
              <Link
                href="/login"
                className="bg-surface-card text-ink-white px-8 py-3 rounded-xl font-medium text-base border border-white/[0.15] hover:bg-surface-card/5 active:scale-[0.98] transition-all"
              >
                我已有帳號
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <span className="text-success font-medium">🎁 新用戶免費 20 點</span>
              <span className="text-ink-dim">·</span>
              <span className="text-ink-gray">生成失敗自動退款</span>
              <span className="text-ink-dim">·</span>
              <span className="text-ink-gray">按需購買，無月費</span>
            </div>
          </div>
        </section>

        {/* How it works — 四步完成 */}
        <section className="bg-surface-card py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-center text-ink-white mb-2">
              四步完成
            </h2>
            <p className="text-ink-gray text-center mb-12 max-w-md mx-auto">
              填寫以下資料，AI 即時為你生成
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', icon: '📸', title: '上傳相片',
                  desc: '上傳個人或合照，JPG/PNG 格式，最大 8MB' },
                { step: '2', icon: '🎨', title: '選擇風格',
                  desc: '角色變身保留樣貌，藝術插畫轉換畫風' },
                { step: '3', icon: '✨', title: 'AI 生成',
                  desc: '約 60–90 秒生成，失敗自動退回點數' },
                { step: '4', icon: '📥', title: '下載分享',
                  desc: '一鍵下載或分享至相簿，留為紀念' },
              ].map((item) => (
                <div key={item.step} className="text-center p-6">
                  <div className="w-14 h-14 bg-electric-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    {item.icon}
                  </div>
                  <div className="text-xs font-medium text-electric-300 uppercase tracking-wider mb-1">
                    步驟 {item.step}
                  </div>
                  <h3 className="font-serif font-semibold text-ink-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-ink-gray text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-cosmos-950">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-center text-ink-white mb-4">
              為什麼選擇 RayCardAI？
            </h2>
            <p className="text-ink-gray text-center mb-10 max-w-xl mx-auto">
              讓每張賀咭都獨一無二
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🖼️', title: '真正個人化',
                  desc: '上傳你的相片，AI 保留樣貌進行風格轉換，每張賀咭都是獨一無二的藝術品' },
                { icon: '🎯', title: '支援所有節日及風格',
                  desc: '生日、聖誕、農曆新年、復活節等多個節日，角色變身與藝術插畫兩大風格類別' },
                { icon: '🛡️', title: '生成失敗自動退款',
                  desc: 'AI 生成過程中出現問題？點數會自動退回你的帳戶，零風險體驗' },
              ].map((item) => (
                <div key={item.title} className="card text-center p-8 hover:shadow-elevated transition-shadow">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-serif font-semibold text-ink-white mb-2">{item.title}</h3>
                  <p className="text-ink-gray text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-brown-600 to-brown-700 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl">✨</div>
            <div className="absolute bottom-10 right-10 text-6xl">🎨</div>
          </div>
          <div className="max-w-xl mx-auto px-4 relative">
            <h2 className="text-3xl font-serif font-bold mb-3">
              準備好製作你的第一張賀咭了嗎？
            </h2>
            <p className="text-electric-300/80 mb-8">
              註冊即送 20 點，馬上體驗 AI 賀咭的魅力
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/register"
                className="bg-electric-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-electric-400/100 transition-colors"
              >
                免費開始使用
              </Link>
              <Link
                href="/login"
                className="bg-surface-card/10 text-white px-8 py-3 rounded-xl font-medium border border-white/[0.20] hover:bg-surface-card/20 transition-colors"
              >
                登入
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
