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
    <header className="bg-white/90 backdrop-blur-sm border-b border-brown-100/60 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
          <span className="font-serif text-lg font-bold text-brown-600 tracking-tight">
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
                儀表板
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
                  className="flex items-center gap-1.5 text-sm bg-amber-50 text-amber-400 font-medium px-3.5 py-1.5 rounded-full hover:bg-amber-100 transition-colors border border-amber-200/50"
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
                className="btn-ghost text-sm text-brown-400 hidden sm:inline-flex"
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
