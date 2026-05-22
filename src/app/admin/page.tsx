'use client';

import { useState, useEffect } from 'react';

type Tab = 'stats' | 'users' | 'orders' | 'cards';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<any>(null);
  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [pointsModal, setPointsModal] = useState<{ userId: string; email: string } | null>(null);
  const [pointsAmount, setPointsAmount] = useState(0);
  const [pointsReason, setPointsReason] = useState('');
  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState('');
  // Cards
  const [cards, setCards] = useState<any[]>([]);
  const [cardUserId, setCardUserId] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const fetchJson = async (url: string) => {
    const res = await fetch(url);
    if (res.status === 401) { setAuthenticated(false); return null; }
    return res.json();
  };

  const handleLogin = async () => {
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthenticated(true); setPassword(''); }
    else { const d = await res.json(); setLoginError(d.error || '登入失敗'); }
  };

  const loadStats = async () => { setLoading(true); const d = await fetchJson('/api/admin/stats'); if (d) setStats(d); setLoading(false); };
  const loadUsers = async (search = '') => { const d = await fetchJson(`/api/admin/users?search=${search}`); if (d) setUsers(d.users); };
  const loadOrders = async (status = '') => { const d = await fetchJson(`/api/admin/orders?status=${status}`); if (d) setOrders(d.orders); };
  const loadCards = async (userId = '') => { const d = await fetchJson(`/api/admin/cards?userId=${userId}`); if (d) setCards(d.cards); };

  useEffect(() => { if (authenticated) { loadStats(); loadUsers(); loadOrders(); loadCards(); } }, [authenticated]);

  const handlePoints = async () => {
    if (!pointsModal) return;
    await fetch(`/api/admin/users/${pointsModal.userId}/points`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: pointsAmount, reason: pointsReason }),
    });
    setPointsModal(null); setPointsAmount(0); setPointsReason('');
    loadUsers(userSearch);
  };

  const handleBan = async (userId: string) => {
    await fetch(`/api/admin/users/${userId}/ban`, { method: 'POST' });
    loadUsers(userSearch);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('確定刪除此卡片？')) return;
    await fetch(`/api/admin/cards/${cardId}`, { method: 'DELETE' });
    setSelectedCard(null);
    loadCards(cardUserId);
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4">
        <div className="card-elevated max-w-sm w-full p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-serif font-bold text-ink-white">後臺管理</h1>
          </div>
          {loginError && <div className="bg-danger-light text-danger text-sm px-4 py-2.5 rounded-xl mb-4">{loginError}</div>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="管理員密碼"
            className="w-full mb-4"
          />
          <button onClick={handleLogin} className="btn-primary w-full !py-3">登入</button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stats', label: '總覽', icon: '📊' },
    { id: 'users', label: '用戶', icon: '👥' },
    { id: 'orders', label: '訂單', icon: '💰' },
    { id: 'cards', label: '卡片', icon: '🎴' },
  ];

  return (
    <div className="min-h-screen bg-cosmos-950">
      {/* Admin header */}
      <header className="bg-cosmos-900/80 backdrop-blur-sm border-b border-white/[0.05] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔐</span>
            <span className="font-serif font-bold text-ink-white">後臺管理</span>
          </div>
          <button onClick={() => { fetch('/api/admin/login', { method: 'DELETE' }); setAuthenticated(false); }} className="text-xs text-ink-dim hover:text-ink-gray">登出</button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-cosmos-900 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id);
                if (t.id === 'stats') loadStats();
                if (t.id === 'users') loadUsers(userSearch);
                if (t.id === 'orders') loadOrders(orderStatus);
                if (t.id === 'cards') loadCards(cardUserId);
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id ? 'bg-electric-500 text-white shadow' : 'text-ink-dim hover:text-ink-gray'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: '總用戶', value: stats.totalUsers, color: 'text-electric-300' },
                { label: '總收入 (HKD)', value: `$${(stats.totalRevenue || 0).toFixed(0)}`, color: 'text-success' },
                { label: '今日生成', value: stats.todayCards, color: 'text-neon-300' },
                { label: '總卡片', value: stats.totalCards, color: 'text-plasma-300' },
              ].map((s) => (
                <div key={s.label} className="card text-center p-5">
                  <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-xs text-ink-dim">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-medium text-ink-white mb-3">熱門節日 Top 5</h3>
                {stats.topFestivals?.map((f: any, i: number) => (
                  <div key={f.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
                    <span className="text-sm text-ink-gray">{i + 1}. {f.name}</span>
                    <span className="text-xs text-ink-dim">{f.count} 張</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 className="font-medium text-ink-white mb-3">熱門風格 Top 5</h3>
                {stats.topStyles?.map((s: any, i: number) => (
                  <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
                    <span className="text-sm text-ink-gray">{i + 1}. {s.name}</span>
                    <span className="text-xs text-ink-dim">{s.count} 張</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="flex gap-3 mb-4">
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers(userSearch)}
                placeholder="搜尋 email 或名稱…"
                className="flex-1"
              />
              <button onClick={() => loadUsers(userSearch)} className="btn-primary !px-6">搜尋</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-dim border-b border-white/[0.05]">
                    <th className="py-2 pr-4">Email</th><th className="py-2 pr-4">名稱</th><th className="py-2 pr-4">點數</th><th className="py-2 pr-4">卡片</th><th className="py-2 pr-4">狀態</th><th className="py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/[0.02]">
                      <td className="py-2 pr-4 text-ink-white">{u.email}</td>
                      <td className="py-2 pr-4 text-ink-gray">{u.displayName}</td>
                      <td className="py-2 pr-4 text-ink-white font-medium">{u.points}</td>
                      <td className="py-2 pr-4 text-ink-dim">{u._count.cards}</td>
                      <td className="py-2 pr-4">{u.isBanned ? <span className="text-danger text-xs">已封鎖</span> : <span className="text-success text-xs">正常</span>}</td>
                      <td className="py-2 flex gap-1.5">
                        <button onClick={() => setPointsModal({ userId: u.id, email: u.email })} className="text-xs px-2 py-1 rounded bg-electric-400/10 text-electric-300 hover:bg-electric-400/20">點數</button>
                        <button onClick={() => handleBan(u.id)} className={`text-xs px-2 py-1 rounded ${u.isBanned ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>{u.isBanned ? '解封' : '封鎖'}</button>
                        <button onClick={() => { setCardUserId(u.id); setActiveTab('cards'); loadCards(u.id); }} className="text-xs px-2 py-1 rounded bg-white/5 text-ink-dim hover:bg-white/10">卡片</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Points modal */}
            {pointsModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPointsModal(null)}>
                <div className="bg-surface-card rounded-xl p-6 max-w-sm w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-bold text-ink-white mb-2">調整點數 — {pointsModal.email}</h3>
                  <input type="number" value={pointsAmount} onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)} placeholder="+100 或 -50" className="w-full mb-2" />
                  <input value={pointsReason} onChange={(e) => setPointsReason(e.target.value)} placeholder="原因（可選）" className="w-full mb-4" />
                  <div className="flex gap-2">
                    <button onClick={handlePoints} className="btn-primary flex-1">確認</button>
                    <button onClick={() => setPointsModal(null)} className="btn-secondary flex-1">取消</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <div className="flex gap-3 mb-4">
              <select value={orderStatus} onChange={(e) => { setOrderStatus(e.target.value); loadOrders(e.target.value); }} className="w-48">
                <option value="">全部狀態</option>
                <option value="completed">已完成</option>
                <option value="pending">待處理</option>
                <option value="failed">失敗</option>
                <option value="refunded">已退款</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-dim border-b border-white/[0.05]">
                    <th className="py-2 pr-4">用戶</th><th className="py-2 pr-4">方案</th><th className="py-2 pr-4">金額</th><th className="py-2 pr-4">點數</th><th className="py-2 pr-4">狀態</th><th className="py-2">時間</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-white/[0.02]">
                      <td className="py-2 pr-4 text-ink-white text-xs">{o.user?.email}</td>
                      <td className="py-2 pr-4 text-ink-gray">{o.stripeSessionId?.slice(-8)}</td>
                      <td className="py-2 pr-4 text-ink-white">HK${Number(o.amountHKD).toFixed(0)}</td>
                      <td className="py-2 pr-4">{o.points}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          o.status === 'completed' ? 'bg-success-light text-success' :
                          o.status === 'failed' ? 'bg-danger-light text-danger' : 'bg-white/5 text-ink-dim'
                        }`}>{o.status}</span>
                      </td>
                      <td className="py-2 text-ink-dim text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="animate-fade-in">
            {cardUserId && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-ink-dim">篩選用戶：{cardUserId}</span>
                <button onClick={() => { setCardUserId(''); loadCards(''); }} className="text-xs text-danger">清除</button>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-dim border-b border-white/[0.05]">
                    <th className="py-2 pr-4">用戶</th><th className="py-2 pr-4">節日</th><th className="py-2 pr-4">風格</th><th className="py-2 pr-4">狀態</th><th className="py-2 pr-4">時間</th><th className="py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} className="border-b border-white/[0.02]">
                      <td className="py-2 pr-4 text-ink-white text-xs">{c.user?.email}</td>
                      <td className="py-2 pr-4 text-ink-gray">{c.festival}</td>
                      <td className="py-2 pr-4 text-ink-gray">{c.styleId}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          c.status === 'completed' ? 'bg-success-light text-success' :
                          c.status === 'generating' ? 'bg-electric-400/10 text-electric-300' : 'bg-danger-light text-danger'
                        }`}>{c.status}</span>
                      </td>
                      <td className="py-2 pr-4 text-ink-dim text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 flex gap-1.5">
                        <button onClick={() => setSelectedCard(c)} className="text-xs px-2 py-1 rounded bg-electric-400/10 text-electric-300 hover:bg-electric-400/20">詳情</button>
                        <button onClick={() => handleDeleteCard(c.id)} className="text-xs px-2 py-1 rounded bg-danger-light text-danger hover:bg-danger/20">刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Card detail modal */}
            {selectedCard && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-auto" onClick={() => setSelectedCard(null)}>
                <div className="bg-surface-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-bold text-ink-white mb-4">卡片詳情</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {selectedCard.originalImageUrl && (
                      <div>
                        <p className="text-xs text-ink-dim mb-2">原始圖片</p>
                        <img src={selectedCard.originalImageUrl} className="w-full rounded-lg" alt="Original" />
                      </div>
                    )}
                    {selectedCard.generatedImageUrl && (
                      <div>
                        <p className="text-xs text-ink-dim mb-2">效果圖</p>
                        <img src={selectedCard.generatedImageUrl} className="w-full rounded-lg" alt="Generated" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    {Object.entries({
                      節日: selectedCard.festival, 風格ID: selectedCard.styleId,
                      風格類型: selectedCard.styleType, 狀態: selectedCard.status,
                      比例: selectedCard.cardRatio || 'N/A', 文字位置: selectedCard.textPosition || 'N/A',
                      色調: selectedCard.colorTone || 'N/A', 解析度: selectedCard.resolution || 'N/A',
                      祝福語: selectedCard.greetingText, 裝飾: (selectedCard.decorations || []).join(', '),
                    }).map(([k, v]) => (
                      <div key={k} className="flex gap-2"><span className="text-ink-dim">{k}:</span><span className="text-ink-white truncate">{String(v)}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeleteCard(selectedCard.id)} className="btn-secondary text-danger flex-1">🗑️ 刪除</button>
                    <button onClick={() => setSelectedCard(null)} className="btn-secondary flex-1">關閉</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
