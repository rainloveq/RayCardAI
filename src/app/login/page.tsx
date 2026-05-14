'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('電郵或密碼錯誤');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-b from-amber-50/30 to-transparent">
        <div className="w-full max-w-sm">
          <div className="card-elevated animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✨</div>
              <h1 className="text-2xl font-serif font-bold text-brown-600">登入</h1>
              <p className="text-sm text-brown-400 mt-1">歡迎回來 RayCardAI</p>
            </div>

            {error && (
              <div className="bg-danger-light text-danger text-sm px-4 py-2.5 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">電郵</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="input-label">密碼</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3"
              >
                {loading ? '登入中…' : '登入'}
              </button>
            </form>

            <p className="text-center text-sm text-brown-400 mt-6">
              還沒有帳號？{' '}
              <Link href="/register" className="text-amber-400 font-medium hover:text-amber-500">
                免費註冊
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
