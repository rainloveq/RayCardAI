'use client';

import { useState, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { score: 1, label: '弱', color: 'bg-danger' };
  if (score <= 3) return { score: 2, label: '一般', color: 'bg-amber-400' };
  if (score <= 4) return { score: 3, label: '強', color: 'bg-electric-400' };
  return { score: 4, label: '很強', color: 'bg-success' };
}

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
  const [socialLoading, setSocialLoading] = useState('');

  const pwStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = (): string | null => {
    if (!form.displayName.trim()) return '請輸入名稱';
    if (form.displayName.length > 50) return '名稱不能超過 50 個字元';
    if (!form.email) return '請輸入電郵';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) return '請輸入有效的電郵地址';
    if (form.password.length < 8) return '密碼至少需要 8 個字元';
    if (!/[a-zA-Z]/.test(form.password)) return '密碼需包含至少一個英文字母';
    if (!/[0-9]/.test(form.password)) return '密碼需包含至少一個數字';
    if (form.password !== form.confirmPassword) return '兩次密碼不一致';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);

    try {
      // Get reCAPTCHA token (if configured)
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        try {
          recaptchaToken = await (window as any).grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
            { action: 'register' }
          );
        } catch {}
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          displayName: form.displayName.trim(),
          recaptchaToken: recaptchaToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '註冊失敗');
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch {
      setError('網絡錯誤，請稍後再試');
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
              <h1 className="text-2xl font-serif font-bold text-ink-white">註冊</h1>
              <p className="text-sm text-ink-gray mt-1">建立你的 RayCardAI 帳戶</p>
            </div>

            {error && (
              <div className="bg-danger-light text-danger text-sm px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
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
                  maxLength={50}
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
                  placeholder="至少 8 個字元，含英文及數字"
                  className="w-full"
                  required
                  minLength={8}
                />
                {/* Password strength indicator */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i <= pwStrength.score ? pwStrength.color : 'bg-white/[0.08]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: pwStrength.color === 'bg-danger' ? '#F87171' : pwStrength.color === 'bg-amber-400' ? '#FBBF24' : pwStrength.color === 'bg-electric-400' ? '#60A5FA' : '#22D3EE' }}>
                      密碼強度：{pwStrength.label}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="input-label">確認密碼</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="再次輸入密碼"
                  className={`w-full ${form.confirmPassword && form.password !== form.confirmPassword ? 'ring-2 ring-danger/30 border-danger' : ''}`}
                  required
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-danger mt-1">兩次密碼不一致</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3"
              >
                {loading ? '註冊中…' : '免費註冊（送 20 點）'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-ink-dim">或</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Social login */}
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
                {socialLoading === 'google' ? '正在連接 Google…' : '使用 Google 註冊'}
              </button>
            </div>

            <p className="text-center text-sm text-ink-gray mt-5">
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
