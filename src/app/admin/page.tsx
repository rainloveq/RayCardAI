'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [data, setData] = useState<any>({});

  const api = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      if (res.status === 401) { setAuthenticated(false); return null; }
      return await res.json();
    } catch { return null; }
  };

  const handleLogin = async () => {
    setLoginError('');
    const d = await api('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (d?.success) { setAuthenticated(true); }
    else { setLoginError(d?.error || '登入失敗'); }
  };

  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      const [s, u, o, c] = await Promise.all([
        api('/api/admin/stats'),
        api('/api/admin/users'),
        api('/api/admin/orders'),
        api('/api/admin/cards'),
      ]);
      setData({ stats: s, users: u?.users || [], orders: o?.orders || [], cards: c?.cards || [] });
    })();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4">
        <div className="card-elevated max-w-sm w-full p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-serif font-bold text-ink-white">後臺管理</h1>
          </div>
          {!!loginError && <div className="bg-danger-light text-danger text-sm px-4 py-2.5 rounded-xl mb-4">{loginError}</div>}
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="管理員密碼" className="w-full mb-4" />
          <button onClick={handleLogin} className="btn-primary w-full !py-3">登入</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: '📊 總覽' },
    { id: 'users', label: '👥 用戶' },
    { id: 'orders', label: '💰 訂單' },
    { id: 'cards', label: '🎴 卡片' },
  ];

  return (
    <div className="min-h-screen bg-cosmos-950">
      <header className="bg-cosmos-900/80 backdrop-blur-sm border-b border-white/[0.05] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-serif font-bold text-ink-white">🔐 後臺管理</span>
          <button onClick={() => { api('/api/admin/logout', { method: 'POST' }); setAuthenticated(false); setData({}); }} className="text-xs text-ink-dim hover:text-ink-gray">登出</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-cosmos-900 rounded-xl p-1 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-electric-500 text-white' : 'text-ink-dim hover:text-ink-gray'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-8">
        {activeTab === 'stats' && data.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              ['總用戶', data.stats.totalUsers],
              ['總收入 HKD', '$' + (data.stats.totalRevenue || 0)],
              ['今日生成', data.stats.todayCards],
              ['總卡片', data.stats.totalCards],
            ].map(([label, value]) => (
              <div key={label as string} className="card text-center p-5">
                <div className="text-2xl font-bold text-electric-300 mb-1">{String(value)}</div>
                <div className="text-xs text-ink-dim">{label as string}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-ink-dim border-b border-white/[0.05]"><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">名稱</th><th className="py-2 pr-4">點數</th><th className="py-2 pr-4">狀態</th></tr></thead>
              <tbody>
                {(data.users || []).map((u: any) => (
                  <tr key={u.id} className="border-b border-white/[0.02]">
                    <td className="py-2 pr-4 text-ink-white text-xs">{u.email}</td>
                    <td className="py-2 pr-4 text-ink-gray">{u.displayName}</td>
                    <td className="py-2 pr-4 text-ink-white">{u.points}</td>
                    <td className="py-2 pr-4">{u.isBanned ? <span className="text-danger text-xs">已封鎖</span> : <span className="text-success text-xs">正常</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data.users || data.users.length === 0) && <p className="text-center text-ink-dim py-8">無資料</p>}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-ink-dim border-b border-white/[0.05]"><th className="py-2 pr-4">用戶</th><th className="py-2 pr-4">金額</th><th className="py-2 pr-4">點數</th><th className="py-2 pr-4">狀態</th><th className="py-2">時間</th></tr></thead>
              <tbody>
                {(data.orders || []).map((o: any) => (
                  <tr key={o.id} className="border-b border-white/[0.02]">
                    <td className="py-2 pr-4 text-ink-white text-xs">{o.user?.email}</td>
                    <td className="py-2 pr-4 text-ink-white">HK${Number(o.amountHKD || 0).toFixed(0)}</td>
                    <td className="py-2 pr-4">{o.points}</td>
                    <td className="py-2 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'completed' ? 'bg-success-light text-success' : 'bg-white/5 text-ink-dim'}`}>{o.status}</span></td>
                    <td className="py-2 text-ink-dim text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data.orders || data.orders.length === 0) && <p className="text-center text-ink-dim py-8">無資料</p>}
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-ink-dim border-b border-white/[0.05]"><th className="py-2 pr-4">用戶</th><th className="py-2 pr-4">節日</th><th className="py-2 pr-4">風格</th><th className="py-2 pr-4">狀態</th><th className="py-2">時間</th></tr></thead>
              <tbody>
                {(data.cards || []).map((c: any) => (
                  <tr key={c.id} className="border-b border-white/[0.02]">
                    <td className="py-2 pr-4 text-ink-white text-xs">{c.user?.email}</td>
                    <td className="py-2 pr-4 text-ink-gray">{c.festival}</td>
                    <td className="py-2 pr-4 text-ink-gray">{c.styleId}</td>
                    <td className="py-2 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'completed' ? 'bg-success-light text-success' : 'bg-white/5 text-ink-dim'}`}>{c.status}</span></td>
                    <td className="py-2 pr-4 text-ink-dim text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data.cards || data.cards.length === 0) && <p className="text-center text-ink-dim py-8">無資料</p>}
          </div>
        )}
      </main>
    </div>
  );
}
