# RayCardAI UX 優化設計

**日期：** 2026-05-17

---

## 功能 1：AI 助手（優先，零 API 成本）

### 概述
用戶輸入自然語言（如「媽媽的母親節卡」），系統匹配關鍵字自動填入所有選項。

### 實現：關鍵字匹配引擎

```typescript
// src/lib/aiAssistant.ts
function matchOptions(input: string): {
  festival: string | null;
  styleId: string | null;
  styleType: 'background' | 'character' | 'illustration';
  colorTone: string | null;
  greetingText: string | null;
  decorations: string[];
}

// 匹配邏輯：
// - 節日關鍵字：「生日」→ birthday, 「聖誕」→ christmas, 「新年」→ lunarnewyear
// - 人物關係：「媽媽」→ 公主童話 + 柔和色調 + 「媽媽我愛你」
// - 色調關鍵字：「粉色」→ pastel, 「金色」→ golden, 「黑白」→ monochrome
// - 風格關鍵字：「卡通」→ character, 「真人」→ background, 「插畫」→ illustration
// - 角色關鍵字：「馬里奧」→ mario, 「公主」→ princess
```

### UI
- 在 `/create` 頁面 Step 1 上方放一個搜尋框
- 佔位文字：「例如：媽媽的生日卡、聖誕派對邀請…」
- 輸入後 0.5 秒顯示匹配結果（本地運算，無網路請求）
- 點擊「✨ 幫我填好」→ 自動填入所有選項，用戶可再手動微調

### 關鍵字對照表（節錄）

| 輸入 | 匹配 |
|------|------|
| 媽媽、母親、媽咪 | festival=other(母親節), style=princess, tone=pastel, greeting=「媽媽我愛你 ❤️」 |
| 爸爸、父親 | style=superhero, tone=warm, greeting=「爸爸辛苦了 🙏」 |
| 女朋友、女友、老婆 | festival=valentine, style=princess, tone=pastel, greeting=「我愛你 💕」 |
| 兄弟、朋友 | style=mario, tone=bright, greeting=「兄弟萬歲 🍻」 |
| 粉色、粉紅 | tone=pastel |
| 金色、高貴 | tone=golden |
| 黑白、簡約 | tone=monochrome |
| 搞笑、有趣 | style=shin-chan |

---

## 功能 2：即時預覽

### 概述
側欄預覽區即時反應選項變更，無需等待 AI 生成。

### 實現
- 色調變更 → 覆蓋半透明 `rgba` overlay（如溫暖=`rgba(255,180,50,0.2)`）
- 比例變更 → CSS `aspect-ratio` 調整預覽框
- 文字位置變更 → 定位 div 顯示祝福語文字在 top/bottom
- 預覽區加標註：「✨ AI 生成僅供參考，實際效果更精緻」

### 改動
- 修改 `src/app/create/page.tsx` 側欄預覽區
- 純 CSS + 定位 div，無 Canvas 重繪

---

## 功能 3：極速模式（背景快取）

### 概述
Top 10 熱門背景主題每 24h 預生成 3-5 張純背景圖，快取在 DB。

### 實現
- 新增 `CachedBackground` 模型：`{ id, styleId, imageUrl, createdAt }`
- Cron job（Vercel Cron）每天凌晨 3 點觸發 `POST /api/admin/cache-backgrounds`
- 用戶生成時：查詢快取 → 有快取則秒出（直接 composite 人物），無快取則正常 KIE 流程
- 快取命中顯示「⚡ 極速模式」，未命中正常等待

### 成本
- KIE 每天 10 風格 × 3 張 = 30 次 API 呼叫，每天約 $0.24

---

## 功能 4：首次引導動畫

### 概述
首次進入 `/create` 時，3 步驟引導，`localStorage` 記錄。

### 步驟
1. 📸 上傳照片 → 高亮拖放區
2. 🎨 選擇背景 → 高亮 Tab 區
3. ✨ 點擊生成 → 高亮按鈕

### 實現
- 半透明遮罩 + 高亮框（CSS `box-shadow: 0 0 0 9999px rgba(0,0,0,0.5)`）
- 3 步驟自動輪播，也可手動點擊跳過
- `localStorage.setItem('onboarding-done', 'true')`

---

## 改動範圍

| 檔案 | 功能 |
|------|------|
| `src/lib/aiAssistant.ts` | 新增 — 關鍵字匹配引擎 |
| `src/app/create/page.tsx` | 修改 — AI 助手輸入框 + 即時預覽 + 引導動畫 |
| `prisma/schema.prisma` | 新增 CachedBackground 模型 |
| `src/app/api/admin/cache-backgrounds/route.ts` | 新增 — 背景快取 cron |
| `vercel.json` | 新增 cron 設定 |
