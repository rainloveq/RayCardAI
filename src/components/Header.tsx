'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/points')
        .then((r) => r.json())
        .then((d) => setPoints(d.points))
        .catch(() => {});
    }
  }, [session]);

  return (
    <header className="bg-cosmos-900/80 backdrop-blur-sm border-b border-white/[0.10] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
          <span className="font-serif text-lg font-bold text-ink-white tracking-tight">
            RayCardAI
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="btn-ghost text-sm hidden sm:inline-flex"
              >
                主頁
              </Link>
              <Link
                href="/gallery"
                className="btn-ghost text-sm hidden sm:inline-flex"
              >
                探索
              </Link>
              <Link
                href="/history"
                className="btn-ghost text-sm hidden sm:inline-flex"
              >
                歷史記錄
              </Link>
              {points !== null && (
                <Link
                  href="/buy-points"
                  className="flex items-center gap-1.5 text-sm bg-electric-400/10 text-electric-300 font-medium px-3.5 py-1.5 rounded-full hover:bg-electric-400/20 transition-colors border border-electric-400/20"
                >
                  <span className="text-base">🪙</span>
                  <span>{points}</span>
                </Link>
              )}
              <Link
                href="/create"
                className="btn-primary text-sm !px-4 !py-2"
              >
                ✨ 製作賀卡
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost text-sm text-ink-gray hidden sm:inline-flex"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                登入
              </Link>
              <Link href="/register" className="btn-primary text-sm !px-4 !py-2">
                免費註冊
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
