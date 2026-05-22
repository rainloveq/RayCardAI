# 主頁重新設計

**日期：** 2026-05-17

---

## Hero 區

- 全屏高度（`min-h-screen`），深黑底色 + 動態粒子背景
- 左上漂浮光暈（electric blue）、右下漂浮光暈（plasma purple）
- 大標題：「AI 個人化賀卡，一分鐘搞定」（font-serif, 4xl, bold, text-ink-white）
- 副標：「上傳照片 → AI 生成 → 分享祝福」（text-ink-gray, text-lg）
- **Google 一鍵登入按鈕**（大顆 48px 高、漸變 electric→plasma、發光 shadow-glow-lg、Google SVG icon + 「使用 Google 免費開始」）
- 下方小字：「註冊送 20 點 · 無需信用卡」
- 向下箭頭動畫提示滾動

## 功能展示區

3 卡片橫排（手機堆疊）：

| 📸 上傳照片 | 🤖 AI 生成 | 📤 一鍵分享 |
|-------------|-----------|------------|
| 簡單拖放上傳，支援 JPG/PNG | 20+ 背景主題，保留真人樣貌 | 社群分享圖，一鍵下載 |

每張卡：glass 背景、border-white/[0.05]、icon 3xl、標題、簡述

## 底部畫廊預覽

- 「探索社群作品」標題
- 橫向 auto-scroll 展示 6-8 張公開 Gallery 卡片
- 使用 CSS animation marquee-like scroll
- 每張卡 hover 放大

## 底部 CTA

- 「準備好創作了嗎？」
- Google 登入大按鈕
- 或「瀏覽作品牆 →」連結到 /gallery

## 導航欄

- 左：RayCardAI Logo + ✨
- 右（未登入）：「探索」連結 + 「登入」btn-ghost + Google 登入按鈕
- 右（已登入）：頭像 + 點數 + 「製作賀卡」btn-primary
- sticky top, glass background

## 改動範圍

| 檔案 | 變更 |
|------|------|
| `src/app/page.tsx` | 完全重寫 |
| `src/components/Header.tsx` | 微調未登入狀態 |

## 動畫

- 背景粒子：純 CSS 浮動光點（pseudo-elements + animation）
- Hero 文字 fadeIn + slideUp
- 功能卡片 scroll-triggered fadeIn（Intersection Observer）
- 底部畫廊 auto-scroll marquee
- 向下箭頭 bounce animation
