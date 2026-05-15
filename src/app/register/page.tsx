'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('密碼不一致');
      return;
    }

    if (form.password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          displayName: form.displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '註冊失敗');
        setLoading(false);
        return;
      }

      // Auto login after register
      const loginResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch {
      setError('網路錯誤，請稍後再試');
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
              <div className="text-4xl mb-3">🎁</div>
              <h1 className="text-2xl font-serif font-bold text-ink-white">免費註冊</h1>
              <p className="text-sm text-ink-gray mt-1">
                新用戶自動獲得 20 點（可生成 2 張賀咭）
              </p>
            </div>

            {error && (
              <div className="bg-danger-light text-danger text-sm px-4 py-2.5 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">名稱</label>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="你的名字"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="input-label">電郵</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="input-label">密碼</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="至少 6 個字元"
                  className="w-full"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="input-label">確認密碼</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="再次輸入密碼"
                  className="w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3"
              >
                {loading ? '註冊中…' : '免費註冊'}
              </button>
            </form>

            <div className="mt-4 p-3 bg-electric-400/10 rounded-xl text-xs text-center text-electric-300">
              🎉 註冊即送 20 點 · 生成失敗自動退款
            </div>

            <p className="text-center text-sm text-ink-gray mt-4">
              已有帳號？{' '}
              <Link href="/login" className="text-electric-300 font-medium hover:text-electric-200">
                登入
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
