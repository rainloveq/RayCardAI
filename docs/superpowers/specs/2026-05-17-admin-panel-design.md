# 後臺管理面板設計

**日期：** 2026-05-17

---

## 認證

- 環境變數 `ADMIN_PASSWORD` 設定密碼
- 訪問 `/admin` → 未登入顯示密碼輸入框
- 正確後設 cookie `admin_token`（SHA256 hash），24h 有效
- 每個 `/api/admin/*` 呼叫驗證 cookie
- middleware 層級驗證，不走 NextAuth

## 資料模型變更

**User 新增：** `isBanned Boolean @default(false)`

## Tab 1：📊 總覽

- 總用戶數、總收入(HKD)、今日生成數、總卡片數
- 熱門節日 Top 5（groupBy festival count）
- 熱門風格 Top 5（groupBy styleId count）
- API: `GET /api/admin/stats`

## Tab 2：👥 用戶

- 搜尋（email / displayName）、列表（ID/Email/名稱/點數/isBanned/註冊時間）
- 點數調整：+/- 數值 + 原因，寫入 PointTransaction
- 封鎖/解封 toggle
- 點擊用戶查看其所有卡片
- API: `GET /api/admin/users`, `POST /api/admin/users/[id]/points`, `POST /api/admin/users/[id]/ban`

## Tab 3：💰 訂單

- 列表（ID/Email/方案/金額/點數/Stripe Session/狀態/時間）
- 篩選：狀態、日期範圍
- API: `GET /api/admin/orders`

## Tab 4：🎴 卡片

- 列表（ID/Email/節日/風格/狀態/時間）
- 點擊展開：原圖 + 效果圖 + 所有選項詳情
- 刪除（含關聯 GalleryCard + Like）
- API: `GET /api/admin/cards`, `DELETE /api/admin/cards/[id]`

## 路由

| 路徑 | 用途 |
|------|------|
| `/admin` | 後臺頁面（含密碼驗證） |
| `/api/admin/login` | 驗證密碼，設 cookie |
| `/api/admin/logout` | 清除 cookie |
| `/api/admin/stats` | 總覽數據 |
| `/api/admin/users` | 用戶列表 |
| `/api/admin/users/[id]/points` | 點數調整 |
| `/api/admin/users/[id]/ban` | 封鎖/解封 |
| `/api/admin/orders` | 訂單列表 |
| `/api/admin/cards` | 卡片列表 |
| `/api/admin/cards/[id]` | 卡片刪除 |
| `src/lib/adminAuth.ts` | cookie 驗證工具 |
| `src/middleware.ts` | 擴展：admin cookie 檢查 |
