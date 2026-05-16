# RayCardAI v2 新功能設計文件

**日期：** 2026-05-16  
**版本：** v2.0  
**模式：** 方案 A — 三個功能獨立開發，同一版本發布

---

## 功能 1：社群分享框

### 概述

生成賀卡後，用戶點擊「分享圖」按鈕，前端 Canvas 自動合成帶品牌浮水印和 QR code 的分享版本。不影響原圖下載。

### 流程

```
生成完成 → 點「📤 分享圖」
  → Canvas 合成：
    1. 原圖縮放至 1080px 寬
    2. 底部疊加品牌 bar（40px 高，深色底 + 「✨ RayCardAI · 製作你的專屬賀卡」）
    3. 右下角疊加 QR code（80x80px，指向 https://raycardai.vercel.app）
    4. 可選：節日主題外框（6px 邊框，聖誕=紅綠、新年=金、情人節=粉、通用=白）
  → 下載合成圖（PNG, raycardai-share-{timestamp}.png）
```

### 技術

- 純前端 Canvas 2D
- QR code 預生成 SVG 內嵌（或用 `qrcode` npm 套件在客戶端生成）
- 品牌 bar 用 Canvas fillRect + fillText
- 外框用 Canvas strokeRect

### 改動範圍

| 檔案 | 變更 |
|------|------|
| `src/app/create/page.tsx` | 新增 `generateShareImage()` + UI 按鈕 + 節日外框顏色對應表 |

### 節日外框顏色

| 節日 | 邊框色 |
|------|--------|
| 生日 | `#FFB347` 橙金 |
| 聖誕 | `#C41E3A` 聖誕紅 |
| 農曆新年 | `#DC143C` 大紅 |
| 新一年 | `#FFD700` 金 |
| 情人節 | `#FF69B4` 粉紅 |
| 通用 | `#FFFFFF` 白 |

---

## 功能 2：公開作品牆

### 概述

註冊用戶可將作品設為公開，出現在 `/gallery` 頁面。其他用戶可瀏覽和按讚。

### 資料模型

**GalleryCard（關聯現有 Card）**
```
cardId: String (FK → Card.id, unique)
userId: String (FK → User.id)
isPublic: Boolean (default false)
publishedAt: DateTime
```

**Like**
```
userId: String (FK → User.id)
galleryCardId: String (FK → GalleryCard.cardId)
createdAt: DateTime
@@unique([userId, galleryCardId])
```

用關聯表而非直接改 Card schema，保持現有 Card 表不變，未來擴展更靈活。

### API 路由

| 方法 | 路徑 | 用途 |
|------|------|------|
| GET | `/api/gallery` | 分頁查詢公開作品（`?page=1&limit=20`），回傳 Card + User.displayName + likes count |
| POST | `/api/gallery/[cardId]/like` | 按讚/取消讚 toggle（已讚則取消） |
| POST | `/api/cards/[id]/publish` | 設為公開（驗證 card.userId === session.user.id） |
| POST | `/api/cards/[id]/unpublish` | 取消公開 |

### 頁面

`/gallery` — 網格展示：
- 頂部導航欄加「🖼️ 探索」入口
- 2 欄（手機）/ 4 欄（桌面）網格
- 每張卡：圖片、作者名、❤️ 讚數、節日標籤
- 點擊放大預覽 → 可下載
- 空狀態：「還沒有人分享作品，成為第一個！」

### 權限

| 操作 | 權限 |
|------|------|
| 瀏覽作品牆 | 需登入 |
| 設為公開 | 卡片擁有者 |
| 取消公開 | 卡片擁有者 |
| 按讚 | 需登入，不可讚自己的作品 |
| 查看讚數 | 需登入 |

### 改動範圍

| 檔案 | 變更 |
|------|------|
| `prisma/schema.prisma` | 新增 GalleryCard + Like models |
| `src/app/api/gallery/route.ts` | 新增 — GET 分頁查詢 |
| `src/app/api/gallery/[cardId]/like/route.ts` | 新增 — POST 按讚 toggle |
| `src/app/api/cards/[id]/publish/route.ts` | 新增 — POST 設為公開 |
| `src/app/api/cards/[id]/unpublish/route.ts` | 新增 — POST 取消公開 |
| `src/app/gallery/page.tsx` | 新增 — 作品牆頁面 |
| `src/components/Header.tsx` | 新增「探索」導航 |
| `src/app/create/page.tsx` | 結果頁新增「設為公開」按鈕 |
| `src/app/history/page.tsx` | 歷史頁新增「公開/取消」開關 |

---

## 功能 3：動態賀卡

### 概述

生成靜態賀卡後，前端 Canvas 疊加粒子特效，可輸出為動態 GIF 或 MP4。

### 特效類型

| 特效 | 適用場景 | 預設節日 |
|------|---------|---------|
| ❄️ 雪花飄落 | 聖誕、冬天 | christmas |
| 🎆 煙花綻放 | 新年、慶祝 | newyear, lunarnewyear |
| 🌸 花瓣飄落 | 情人節、春天 | valentine |
| ✨ 星光閃爍 | 通用 | 其他 |
| 🍂 落葉 | 秋天 | 通用 |
| 💰 金幣掉落 | 恭喜發財 | lunarnewyear |

根據用戶選擇的節日自動推薦預設特效，用戶可切換。

### 操作流程

```
生成完成 → 點「🎬 動態版」
  → 選擇特效（預設根據節日推薦）
  → 預覽 3 秒動畫（Canvas 即時渲染）
  → 點「輸出 GIF」或「輸出 MP4」
  → 瀏覽器端生成，下載
```

### 技術

- **Canvas 2D** + `requestAnimationFrame` 循環渲染
- **GIF 輸出**：`gif.js` 或 `modern-gif`（瀏覽器端編碼，3 秒 = ~45 幀 @ 15fps）
- **MP4 輸出**：Canvas.captureStream() + MediaRecorder（WebM 格式，瀏覽器原生支援）
- 粒子系統：獨立模組 `src/lib/animation.ts`

### 粒子引擎設計

```typescript
interface Particle {
  x, y: number;        // 位置
  vx, vy: number;      // 速度
  size: number;        // 大小
  opacity: number;     // 透明度
  life: number;        // 剩餘生命
  color?: string;      // 顏色（可選）
}

interface EffectConfig {
  particleCount: number;
  spawnRate: number;     // 每秒新生粒子數
  duration: number;       // 動畫總時長（秒）
  fps: number;            // 輸出幀率
  init: () => Particle;
  update: (p: Particle, dt: number) => void;
  draw: (p: Particle, ctx: CanvasRenderingContext2D) => void;
}
```

### 效能考量

- GIF 輸出限制：480px 寬，降低檔案大小
- MP4 輸出：720px 寬
- 粒子數量上限：100 顆同時在畫面
- 生成時間預估：GIF ~5 秒、MP4 ~3 秒（3 秒動畫）

### 改動範圍

| 檔案 | 變更 |
|------|------|
| `src/lib/animation.ts` | 新增 — 粒子引擎 + 6 種特效定義 |
| `src/app/create/page.tsx` | 新增動畫預覽 UI + 輸出按鈕 |
| `package.json` | 新增 `modern-gif` 依賴 |

---

## 不納入範圍

- AI 多幀生成（混合方案中的可選項 — 第一期不做，未來評估 KIE API 支援後再加）
- 社群平台 API 直接發布
- 公開作品牆的留言功能
- AI 自動寫祝福語

---

## 驗證方式

1. `npx next build` 無錯誤
2. 手動測試：生成賀卡 → 點分享圖 → 檢查下載圖片有品牌 bar + QR code
3. 手動測試：設為公開 → 另一個帳號在 /gallery 看到 → 按讚 → 讚數+1
4. 手動測試：生成賀卡 → 動態版 → 選特效 → 預覽 → 輸出 GIF
5. 部署到 Vercel Production
