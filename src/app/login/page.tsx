'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
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
  const [socialLoading, setSocialLoading] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('請輸入電郵'); return; }
    if (!password) { setError('請輸入密碼'); return; }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 5) {
          setError('嘗試次數過多，請 15 分鐘後再試或使用 Google 登入');
        } else {
          setError(`電郵或密碼錯誤（剩餘 ${5 - newAttempts} 次嘗試）`);
        }
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
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-b from-electric-400/5 to-transparent">
        <div className="w-full max-w-sm">
          <div className="card-elevated animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✨</div>
              <h1 className="text-2xl font-serif font-bold text-ink-white">登入</h1>
              <p className="text-sm text-ink-gray mt-1">歡迎回來 RayCardAI</p>
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

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-ink-dim">或</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Social login buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => { setSocialLoading('google'); signIn('google', { callbackUrl: '/dashboard' }); }}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 text-sm font-medium text-ink-white transition-all"
              >
                {socialLoading === 'google' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                )}
                {socialLoading === 'google' ? '正在連接 Google…' : '使用 Google 登入'}
              </button>
              <button
                onClick={() => { setSocialLoading('facebook'); signIn('facebook', { callbackUrl: '/dashboard' }); }}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 text-sm font-medium text-ink-white transition-all"
              >
                {socialLoading === 'facebook' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                )}
                {socialLoading === 'facebook' ? '正在連接 Facebook…' : '使用 Facebook 登入'}
              </button>
              <button
                onClick={() => { setSocialLoading('apple'); signIn('apple', { callbackUrl: '/dashboard' }); }}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 text-sm font-medium text-ink-white transition-all"
              >
                {socialLoading === 'apple' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                )}
                {socialLoading === 'apple' ? '正在連接 Apple…' : '使用 Apple 登入'}
              </button>
            </div>

            <p className="text-center text-sm text-ink-gray mt-5">
              還沒有帳號？{' '}
              <Link href="/register" className="text-electric-300 font-medium hover:text-electric-200">
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
