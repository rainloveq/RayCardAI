'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast, { useToast } from '@/components/Toast';
import {
  CARD_TYPES, CHARACTER_STYLES, ILLUSTRATION_STYLES, BACKGROUND_STYLES,
  FESTIVAL_DECORATIONS, POINTS_PER_CARD,
  CARD_RATIOS, TEXT_POSITIONS, COLOR_TONES,
  GREETING_SUGGESTIONS,
} from '@/lib/constants';

/** Compress image to max dimension 800px, returns a smaller File/Blob */
async function compressImage(file: File, maxDim = 800, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('壓縮圖片失敗')); return; }
        const newFile = new File([blob], file.name, { type: 'image/jpeg' });
        resolve(newFile);
      }, 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('讀取圖片失敗')); };
    img.src = url;
  });
}

/** Safely parse a fetch response as JSON; on failure return the raw text for debugging */
async function safeJson(res: Response): Promise<{ ok: boolean; data: any; raw?: string }> {
  const text = await res.text();
  try {
    return { ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { ok: false, data: null, raw: text.slice(0, 500) };
  }
}

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast, showToast, clearToast } = useToast();

  const [points, setPoints] = useState<number>(0);
  const [step, setStep] = useState<'form' | 'generating' | 'timedOut' | 'result'>('form');
  const currentCardIdRef = useRef<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('');

  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [festival, setFestival] = useState('');
  const [customFestival, setCustomFestival] = useState('');
  const [styleType, setStyleType] = useState<'background' | 'character' | 'illustration'>('background');
  const [styleId, setStyleId] = useState('');
  const [customStyleDesc, setCustomStyleDesc] = useState('');
  const [decorations, setDecorations] = useState<string[]>([]);
  const [greetingText, setGreetingText] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [cardRatio, setCardRatio] = useState('3:4');
  const [textPosition, setTextPosition] = useState('bottom');
  const [colorTone, setColorTone] = useState('');
  const [fastMode, setFastMode] = useState(false);

  // Result
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollCountRef = useRef(0);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/points')
        .then((r) => r.text())
        .then((t) => { try { const d = JSON.parse(t); setPoints(d.points); } catch {} })
        .catch(() => {});
    }
  }, [session]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      showToast({ message: '圖片超過 8MB 限制', type: 'error' });
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast({ message: '只接受 JPG/PNG 格式', type: 'error' });
      return;
    }
    // Compress to 800px to keep base64 / request size small
    showToast({ message: '正在壓縮圖片…', type: 'info' });
    const compressed = await compressImage(file, 800, 0.8).catch(() => file);
    setImageFile(compressed);
    setImagePreview(URL.createObjectURL(compressed));
    clearToast();
  }, [showToast, clearToast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const toggleDecoration = (d: string) => {
    setDecorations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const getAvailableDecorations = () => {
    const key = festival === 'other' ? 'other' : festival;
    return FESTIVAL_DECORATIONS[key] || FESTIVAL_DECORATIONS.other;
  };

  const pollCardStatus = useCallback(async (cardId: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}`);
      const { ok, data } = await safeJson(res);
      if (!ok) return null;
      return data.card;
    } catch {
      return null;
    }
  }, []);

  const handleGenerate = async () => {
    if (!imagePreview || !festival || !styleId || !greetingText) {
      showToast({ message: '請填寫所有必填欄位', type: 'error' });
      return;
    }

    // Validate custom style has description
    if (styleId.startsWith('custom-') && !customStyleDesc.trim()) {
      showToast({ message: '請輸入自訂風格描述', type: 'error' });
      return;
    }

    if (points < POINTS_PER_CARD) {
      showToast({ message: '點數不足，請先購買點數', type: 'error' });
      return;
    }

    setStep('generating');
    setProgressMsg('正在上傳圖片…');
    setPollCount(0);
    pollCountRef.current = 0;

    try {
      // Upload image
      let uploadedUrl = imageUrl;
      if (imageFile && !uploadedUrl) {
        setProgressMsg('正在上傳圖片…');
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const { ok: uploadOk, data: uploadData, raw: uploadRaw } = await safeJson(uploadRes);
        if (!uploadOk) throw new Error(uploadData?.error || uploadRaw || '上傳失敗');
        uploadedUrl = uploadData.url;
        setImageUrl(uploadedUrl);
      }

      setProgressMsg('AI 正在製作你的賀咭（已提交）');

      const festivalName = festival === 'other' ? customFestival :
        CARD_TYPES.find((c) => c.id === festival)?.label || festival;

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImageUrl: uploadedUrl,
          festival: festivalName,
          styleId,
          styleType,
          decorations,
          greetingText,
          extraInstructions: extraInstructions || undefined,
          customPrompt: styleId.startsWith('custom-') ? customStyleDesc : undefined,
          cardRatio,
          textPosition,
          colorTone: colorTone || undefined,
          resolution: fastMode ? '1K' : '2K',
        }),
      });

      const { ok, data, raw } = await safeJson(res);
      if (!ok) {
        throw new Error(data?.error || raw || '生成失敗');
      }

      const cardId = data.card?.id;
      if (!cardId) throw new Error('無法取得卡片 ID');
      currentCardIdRef.current = cardId;

      // Start polling for completion
      setProgressMsg('AI 正在繪製你的賀咭，請耐心等候…');

      const stopPolling = () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        pollIntervalRef.current = null;
        pollTimeoutRef.current = null;
      };

      const MAX_POLL_ATTEMPTS = 100; // 100 × 3s = 300s (5 min)
      pollCountRef.current = 0;

      const poll = async () => {
        pollCountRef.current += 1;
        setPollCount(pollCountRef.current);

        if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
          stopPolling();
          setStep('timedOut');
          return;
        }

        const card = await pollCardStatus(cardId);
        if (!card) return;

        if (card.status === 'completed') {
          stopPolling();
          setGeneratedCard(card);
          setStep('result');
          showToast({ message: '賀咭生成成功！', type: 'success' });
          setPoints((prev) => Math.max(0, prev - POINTS_PER_CARD));
        } else if (card.status === 'failed') {
          stopPolling();
          showToast({ message: '生成失敗，點數已退回', type: 'error' });
          setStep('form');
        }
      };

      // Initial poll after a short delay, then poll every 3s
      pollTimeoutRef.current = setTimeout(() => {
        poll();
        pollIntervalRef.current = setInterval(poll, 3000);
      }, 2000);
    } catch (err: any) {
      showToast({ message: err.message || '生成失敗，點數已退回', type: 'error' });
      setStep('form');
    }
  };

  const handleContinueWaiting = () => {
    const cardId = currentCardIdRef.current;
    if (!cardId) {
      setStep('form');
      return;
    }
    setStep('generating');
    pollCountRef.current = 0;
    setPollCount(0);

    const poll = async () => {
      pollCountRef.current += 1;
      setPollCount(pollCountRef.current);

      if (pollCountRef.current >= 100) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setStep('timedOut');
        return;
      }

      const card = await pollCardStatus(cardId);
      if (!card) return;

      if (card.status === 'completed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setGeneratedCard(card);
        setStep('result');
        showToast({ message: '賀咭生成成功！', type: 'success' });
        setPoints((prev) => Math.max(0, prev - POINTS_PER_CARD));
      } else if (card.status === 'failed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        showToast({ message: '生成失敗，點數已退回', type: 'error' });
        setStep('form');
      }
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 3000);
  };

  const handleCancelGeneration = async () => {
    const cardId = currentCardIdRef.current;
    if (!cardId) {
      setStep('form');
      return;
    }
    showToast({ message: '正在取消…', type: 'info' });
    try {
      const res = await fetch(`/api/cards/${cardId}/cancel`, { method: 'POST' });
      const { ok, data } = await safeJson(res);
      if (ok && data.success) {
        showToast({ message: '已取消，點數已退回', type: 'info' });
      } else {
        showToast({ message: data?.error || '取消失敗' , type: 'error' });
      }
    } catch {
      showToast({ message: '取消失敗，請稍後再試', type: 'error' });
    }
    setStep('form');
    currentCardIdRef.current = null;
  };

  const handleDownload = async () => {
    if (!generatedCard?.generatedImageUrl) return;
    try {
      const res = await fetch(generatedCard.generatedImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raycardai-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(generatedCard.generatedImageUrl, '_blank');
    }
  };

  const resetForm = () => {
    setStep('form');
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
    setFestival('');
    setCustomFestival('');
    setStyleId('');
    setCustomStyleDesc('');
    setDecorations([]);
    setGreetingText('');
    setExtraInstructions('');
    setCardRatio('3:4');
    setTextPosition('bottom');
    setColorTone('');
    setFastMode(false);
    setGeneratedCard(null);
    currentCardIdRef.current = null;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentDecos = getAvailableDecorations();
  const selectedStyleDef = [...BACKGROUND_STYLES, ...CHARACTER_STYLES, ...ILLUSTRATION_STYLES].find((s) => s.id === styleId);

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold text-brown-600">
              製作賀咭
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/buy-points"
                className="flex items-center gap-1.5 bg-amber-50 text-amber-400 font-medium px-3.5 py-1.5 rounded-full border border-amber-200/50 hover:bg-amber-100 transition-colors"
              >
                <span>🪙</span>
                <span>{points} 點</span>
              </Link>
              <span className="text-brown-300 text-xs">每次消耗 {POINTS_PER_CARD} 點</span>
            </div>
          </div>

          {step === 'generating' && (
            <div className="card-elevated text-center py-16 animate-fade-in max-w-lg mx-auto">
              {/* Animated magic wand */}
              <div className="relative mb-6 inline-block">
                <div className="text-6xl animate-bounce">🪄</div>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: '3s' }}>✨</div>
                <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">💫</div>
              </div>

              <p className="text-brown-600 font-serif font-bold text-xl mb-2">
                AI 正在為你繪製賀卡
              </p>
              <p className="text-brown-400 text-sm mb-6">
                {progressMsg}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-cream-200 rounded-full h-3 mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-linear animate-pulse"
                  style={{ width: `${Math.min(pollCount * 2.5, 90)}%` }}
                />
              </div>

              {/* Animated waiting dots */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>

              {pollCount > 0 && (
                <p className="text-brown-400 text-sm font-medium">
                  ⏱️ {Math.floor(pollCount * 3)} 秒
                  {pollCount > 10 && pollCount <= 20 && ' · 還在努力中…'}
                  {pollCount > 20 && pollCount <= 40 && ' · 快完成了，請稍候…'}
                  {pollCount > 40 && ' · AI 仍在精心繪製…'}
                </p>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brown-300">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>失敗自動退回點數</span>
                <span className="mx-1">·</span>
                <span>{fastMode ? '⚡ 快速模式' : '🎨 高品質模式'}</span>
              </div>
            </div>
          )}

          {step === 'timedOut' && (
            <div className="card-elevated text-center py-16 animate-fade-in max-w-lg mx-auto">
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-brown-600 font-medium text-lg mb-2">AI 繪製時間較長</p>
              <p className="text-brown-400 text-sm mb-2">
                已等待超過 5 分鐘，賀卡可能仍在生成中
              </p>
              <p className="text-brown-300 text-xs mb-8">
                你可以選擇繼續等待，或取消並退回點數
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleContinueWaiting}
                  className="btn-primary !px-6 !py-3"
                >
                  🔄 繼續等待
                </button>
                <button
                  onClick={handleCancelGeneration}
                  className="btn-secondary !px-6 !py-3"
                >
                  ↩️ 取消並退回點數
                </button>
              </div>
            </div>
          )}

          {step === 'result' && generatedCard && (
            <div className="animate-fade-in max-w-lg mx-auto">
              {/* Celebration header */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <h2 className="text-2xl font-serif font-bold text-brown-600">
                  賀卡生成完成！
                </h2>
                <p className="text-brown-400 text-sm mt-1">
                  你的個人化賀卡已準備好
                </p>
              </div>

              <div className="card-elevated mb-6 overflow-hidden rounded-xl">
                <div
                  className="bg-cream-100 relative"
                  style={{ aspectRatio: cardRatio.replace(':', '/') || '3/4' }}
                >
                  {generatedCard.generatedImageUrl ? (
                    <img
                      src={generatedCard.generatedImageUrl}
                      alt="生成的賀卡"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-300">
                      圖片載入中…
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={handleDownload} className="btn-primary !px-8 !py-3">
                  📥 下載圖片
                </button>
                <button onClick={resetForm} className="btn-secondary">
                  再製作一張
                </button>
                <button
                  onClick={() => {
                    if (navigator.share && generatedCard.generatedImageUrl) {
                      navigator.share({
                        title: 'RayCardAI 賀咭',
                        text: greetingText,
                        url: generatedCard.generatedImageUrl,
                      }).catch(() => {});
                    }
                  }}
                  className="btn-secondary"
                >
                  📤 分享
                </button>
              </div>

              <p className="text-xs text-brown-300 text-center mt-4">
                長按圖片 → 「加入相片」儲存至相簿
              </p>
            </div>
          )}

          {step === 'form' && (
            <div className="grid md:grid-cols-5 gap-6 animate-fade-in">
              {/* Main form (3/5) */}
              <div className="md:col-span-3 space-y-5">
                {/* Step 1: Upload photo */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-medium">1</span>
                    <label className="font-medium text-brown-600 text-sm">上傳相片</label>
                    <span className="text-xs text-brown-300 font-normal">（必填）</span>
                  </div>
                  <p className="text-xs text-brown-400 mb-3">
                    💡 建議選用臉部清晰、人頭佔畫面較大的照片，效果更佳
                  </p>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-brown-200 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer bg-cream-50/50"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/jpeg,image/png';
                      input.onchange = (e: any) => {
                        if (e.target.files[0]) handleImageUpload(e.target.files[0]);
                      };
                      input.click();
                    }}
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="預覽"
                          className="w-36 h-36 object-cover rounded-xl"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                            setImageUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-brown-600 text-white w-6 h-6 rounded-full text-xs hover:bg-brown-700"
                        >
                          ✕
                        </button>
                        <p className="text-xs text-success mt-2 font-medium">✅ 已上傳</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">📸</span>
                        </div>
                        <p className="text-brown-600 font-medium">點擊或拖放照片至此</p>
                        <p className="text-brown-400 text-sm mt-1">支援 JPG / PNG，最大 8MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Festival */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
                    <label className="font-medium text-brown-600 text-sm">選擇節日 / 重要時刻</label>
                    <span className="text-xs text-brown-300 font-normal">（必填）</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {CARD_TYPES.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => {
                          setFestival(ct.id);
                          if (ct.id !== 'other') setCustomFestival('');
                          setDecorations([]);
                        }}
                        className={`p-2.5 rounded-xl text-sm border text-center transition-all ${
                          festival === ct.id
                            ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                            : 'border-brown-100 text-brown-400 hover:border-brown-200 hover:bg-brown-50'
                        }`}
                      >
                        <div className="text-xl mb-0.5">{ct.icon}</div>
                        <div className="text-xs">{ct.label}</div>
                      </button>
                    ))}
                  </div>
                  {festival === 'other' && (
                    <input
                      type="text"
                      value={customFestival}
                      onChange={(e) => setCustomFestival(e.target.value)}
                      placeholder="請輸入節日或重要時刻"
                      className="w-full mt-3"
                    />
                  )}
                </div>

                {/* Step 3: Style */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
                    <label className="font-medium text-brown-600 text-sm">選擇風格</label>
                    <span className="text-xs text-brown-300 font-normal">（必填）</span>
                  </div>
                  <p className="text-xs text-brown-400 mb-4">
                    💡 真人換背景：只換場景，人物100%不變｜全卡通：變身角色，保留樣貌｜藝術畫風：整圖轉換風格
                  </p>

                  {/* Style type tabs */}
                  <div className="flex gap-1.5 mb-4 bg-brown-50 rounded-xl p-1">
                    <button
                      onClick={() => { setStyleType('background'); setStyleId(''); setCustomStyleDesc(''); }}
                      className={`flex-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        styleType === 'background'
                          ? 'bg-white text-brown-600 shadow-sm'
                          : 'text-brown-400 hover:text-brown-500'
                      }`}
                    >
                      🖼️ 真人換背景
                    </button>
                    <button
                      onClick={() => { setStyleType('character'); setStyleId(''); setCustomStyleDesc(''); }}
                      className={`flex-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        styleType === 'character'
                          ? 'bg-white text-brown-600 shadow-sm'
                          : 'text-brown-400 hover:text-brown-500'
                      }`}
                    >
                      🦸 全卡通角色
                    </button>
                    <button
                      onClick={() => { setStyleType('illustration'); setStyleId(''); setCustomStyleDesc(''); }}
                      className={`flex-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        styleType === 'illustration'
                          ? 'bg-white text-brown-600 shadow-sm'
                          : 'text-brown-400 hover:text-brown-500'
                      }`}
                    >
                      🎨 藝術畫風
                    </button>
                  </div>

                  {/* Styles grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {(styleType === 'background' ? BACKGROUND_STYLES : styleType === 'character' ? CHARACTER_STYLES : ILLUSTRATION_STYLES).map(
                      (s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyleId(s.id)}
                          className={`p-3 rounded-xl text-sm border text-center transition-all ${
                            styleId === s.id
                              ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                              : 'border-brown-100 text-brown-400 hover:border-brown-200 hover:bg-brown-50'
                          }`}
                        >
                          <div className="font-medium">{s.label}</div>
                        </button>
                      )
                    )}
                  </div>

                  {/* Custom style input */}
                  {styleId === 'custom-background' && (
                    <textarea
                      value={customStyleDesc}
                      onChange={(e) => setCustomStyleDesc(e.target.value)}
                      placeholder="例：海灘日落背景、星空宇宙背景、森林花園…"
                      className="w-full mt-3 h-20"
                    />
                  )}
                  {styleId === 'custom-character' && (
                    <textarea
                      value={customStyleDesc}
                      onChange={(e) => setCustomStyleDesc(e.target.value)}
                      placeholder="例：小丑造型、海盜船長造型、太空人造型…"
                      className="w-full mt-3 h-20"
                    />
                  )}
                  {styleId === 'custom-illustration' && (
                    <textarea
                      value={customStyleDesc}
                      onChange={(e) => setCustomStyleDesc(e.target.value)}
                      placeholder="例：想要手繪插畫風格，溫暖柔和色調…"
                      className="w-full mt-3 h-20"
                    />
                  )}
                </div>

                {/* Step 4: Decorations */}
                {festival && festival !== 'other' && (
                  <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-amber-50 text-amber-400 text-xs rounded-full flex items-center justify-center font-medium border border-amber-200">4</span>
                      <label className="font-medium text-brown-600 text-sm">選擇裝飾</label>
                      <span className="text-xs text-brown-300 font-normal">（可多選，選填）</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-amber-400 font-medium">🎯 推薦裝飾</p>
                      <div className="flex flex-wrap gap-2">
                        {currentDecos.map((d) => (
                          <button
                            key={d}
                            onClick={() => toggleDecoration(d)}
                            className={`px-3.5 py-2 rounded-xl text-sm border transition-all ${
                              decorations.includes(d)
                                ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                                : 'border-brown-100 text-brown-400 hover:border-brown-200'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Greeting text */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-medium">5</span>
                    <label className="font-medium text-brown-600 text-sm">祝福語</label>
                    <span className="text-xs text-brown-300 font-normal">（必填）</span>
                  </div>
                  <textarea
                    value={greetingText}
                    onChange={(e) => setGreetingText(e.target.value)}
                    placeholder="輸入你想對收卡人說的話…"
                    className="w-full h-24 resize-none"
                    maxLength={500}
                  />
                  {/* Greeting suggestions */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {GREETING_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setGreetingText(s)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                          greetingText === s
                            ? 'border-amber-400 bg-amber-50 text-amber-400'
                            : 'border-brown-100 text-brown-400 hover:border-brown-200 hover:bg-brown-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-brown-300">（不選則由 AI 自行決定文字風格）</span>
                    <span className="text-xs text-brown-300">{greetingText.length}/500</span>
                  </div>
                </div>

                {/* Step 6: Card Ratio */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-50 text-amber-400 text-xs rounded-full flex items-center justify-center font-medium border border-amber-200">6</span>
                    <label className="font-medium text-brown-600 text-sm">卡片比例</label>
                    <span className="text-xs text-brown-300 font-normal">（選填）</span>
                  </div>
                  <div className="flex gap-2">
                    {CARD_RATIOS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setCardRatio(r.id)}
                        className={`flex-1 p-3 rounded-xl text-sm border text-center transition-all ${
                          cardRatio === r.id
                            ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                            : 'border-brown-100 text-brown-400 hover:border-brown-200'
                        }`}
                      >
                        <div className="text-lg">{r.icon}</div>
                        <div className="font-medium mt-0.5">{r.label}</div>
                        <div className="text-xs text-brown-300 mt-0.5">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 7: Text Position */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-50 text-amber-400 text-xs rounded-full flex items-center justify-center font-medium border border-amber-200">7</span>
                    <label className="font-medium text-brown-600 text-sm">文字位置</label>
                    <span className="text-xs text-brown-300 font-normal">（選填）</span>
                  </div>
                  <div className="flex gap-2">
                    {TEXT_POSITIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTextPosition(p.id)}
                        className={`flex-1 p-3 rounded-xl text-sm border text-center transition-all ${
                          textPosition === p.id
                            ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                            : 'border-brown-100 text-brown-400 hover:border-brown-200'
                        }`}
                      >
                        <div className="text-lg">{p.icon}</div>
                        <div className="font-medium mt-0.5">{p.label}</div>
                        <div className="text-xs text-brown-300 mt-0.5">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 8: Color Tone */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-amber-50 text-amber-400 text-xs rounded-full flex items-center justify-center font-medium border border-amber-200">8</span>
                    <label className="font-medium text-brown-600 text-sm">色調風格</label>
                    <span className="text-xs text-brown-300 font-normal">（選填）</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setColorTone(t.id === colorTone ? '' : t.id)}
                        className={`p-2.5 rounded-xl text-xs border text-center transition-all ${
                          colorTone === t.id
                            ? 'border-amber-400 bg-amber-50 text-amber-400 ring-1 ring-amber-400/20'
                            : 'border-brown-100 text-brown-400 hover:border-brown-200'
                        }`}
                      >
                        <div className="text-base mb-1">{t.icon}</div>
                        <div className="text-lg mb-0.5 tracking-wider">{t.preview}</div>
                        <div className="font-medium">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra instructions */}
                <div className="card">
                  <label className="input-label">構圖提示（選填）</label>
                  <textarea
                    value={extraInstructions}
                    onChange={(e) => setExtraInstructions(e.target.value)}
                    placeholder="例如：我希望背景是粉紅色、字體要大一點…"
                    className="w-full h-20 resize-none"
                  />
                </div>
              </div>

              {/* Sidebar Preview (2/5) */}
              <div className="md:col-span-2">
                <div className="card sticky top-24">
                  <h3 className="font-medium text-brown-600 mb-4 flex items-center gap-2">
                    <span>👁️</span> 預覽
                  </h3>
                  <div
                    className="bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl flex items-center justify-center mb-5 overflow-hidden"
                    style={{ aspectRatio: cardRatio.replace(':', '/') || '3/4' }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="預覽"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-brown-300 p-6">
                        <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">🖼️</span>
                        </div>
                        <p className="text-sm">上傳相片後顯示預覽</p>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-2.5 text-sm border-t border-brown-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-brown-400">節日</span>
                      <span className="text-brown-600 font-medium">
                        {festival
                          ? festival === 'other'
                            ? customFestival || '—'
                            : CARD_TYPES.find((c) => c.id === festival)?.label
                          : '未選擇'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brown-400">風格</span>
                      <span className="text-brown-600 font-medium">
                        {selectedStyleDef?.label || '未選擇'}
                      </span>
                    </div>
                    {decorations.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-brown-400">裝飾</span>
                        <span className="text-brown-600 text-right max-w-[160px] truncate">
                          {decorations.join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-brown-400">比例</span>
                      <span className="text-brown-600 font-medium">
                        {CARD_RATIOS.find((r) => r.id === cardRatio)?.label || '3:4'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brown-400">文字位置</span>
                      <span className="text-brown-600 font-medium">
                        {TEXT_POSITIONS.find((p) => p.id === textPosition)?.label || '底部'}
                      </span>
                    </div>
                    {colorTone && (
                      <div className="flex justify-between">
                        <span className="text-brown-400">色調</span>
                        <span className="text-brown-600 font-medium">
                          {COLOR_TONES.find((t) => t.id === colorTone)?.label || colorTone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fast mode toggle */}
                  <label className="flex items-center gap-3 mt-4 p-3 bg-cream-50 rounded-xl cursor-pointer hover:bg-cream-100 transition-colors">
                    <div className={`relative w-10 h-6 rounded-full transition-colors ${fastMode ? 'bg-success' : 'bg-brown-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${fastMode ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-brown-600">⚡ 快速模式</span>
                      <span className="text-xs text-brown-300 ml-2">較快完成 · 畫質略低</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={fastMode}
                      onChange={(e) => setFastMode(e.target.checked)}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleGenerate}
                    disabled={!imagePreview || !festival || !styleId || !greetingText}
                    className="btn-primary w-full !py-3.5 mt-4 text-base"
                  >
                    ✨ 立即製作（消耗 {POINTS_PER_CARD} 點）
                  </button>
                  <p className="text-xs text-brown-300 text-center mt-2">
                    {fastMode ? '⚡ 快速模式約 60–90 秒' : '🎨 高品質約 2–3 分鐘'} · 失敗自動退款
                  </p>

                  {points < POINTS_PER_CARD && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl text-center">
                      <p className="text-xs text-amber-400">點數不足</p>
                      <Link href="/buy-points" className="text-xs text-amber-500 font-medium underline">
                        點此購買點數 →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {toast && <Toast {...toast} onClose={clearToast} />}
    </>
  );
}
