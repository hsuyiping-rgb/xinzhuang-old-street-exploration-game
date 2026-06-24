# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

《老街時空旅人》是以國小中高年級戶外教育為情境的**新莊老街行動闖關遊戲**。學生扮演「文化守護者」走訪廟宇、老店與歷史巷弄，完成觀察、問答與互動任務。目前是純前端原型，可在手機 / 平板瀏覽器執行。

## 常用指令

Windows 環境，使用 `npm.cmd`（PowerShell）。需 Node.js 18+，**不需安裝任何外部套件**。

```powershell
npm.cmd run dev      # 本機開發伺服器 → http://127.0.0.1:5173/（serve game/）
npm.cmd run check    # node --check 語法檢查三個 .mjs/.js + 跑一次 build（CI 用的驗證指令）
npm.cmd run build    # 將 game/ 整個複製到 dist/
npm.cmd run preview  # 預覽 dist/ → http://127.0.0.1:4173/
```

沒有測試框架、沒有 linter、沒有打包器。`check` 是唯一的自動化驗證入口——修改後請務必跑它。

## 架構

### 無框架的單檔 SPA
整個遊戲是三個檔案：`game/index.html`、`game/style.css`、`game/app.js`（約 2000 行）。沒有模組系統、沒有 import/export。

- **畫面切換**：`index.html` 內有五個 `.screen` 區塊（`screen-loading` / `screen-intro` / `screen-role-select` / `screen-game` / `screen-report`），靠切換 `.active` class 顯示。由 `showScreen(screenId)` 控制。
- **事件綁定**：HTML 透過 inline `onclick="..."` 直接呼叫 `app.js` 的**全域函式**（例如 `toggleMute()`、`submitQuest()`）。新增互動時，函式必須是 top-level 全域函式才能被 HTML 呼叫到——這是本專案最重要的慣例。
- **狀態**：單一全域 `state` 物件（隊名、角色、分數、HP、`inventory`、`unlockedStages`、`completedStages`、`badges`、`photos`、`evidenceRecords`）。無持久化，重整即重置。

### 關卡資料驅動
所有關卡內容集中在 `app.js` 頂部的四個設定物件，**以 stageId 為 key 對齊**（新增關卡時四者都要補）：
- `stagesConfig` — 標題、文史簡介、勳章名稱
- `stageMediaConfig` — 情境圖、田野證據任務類型（`photo` / `audio` / `text`）與提示
- `stageFeedback` — 答對 / 答錯的延伸文史回饋文字
- 各關互動由 `renderQuestInteraction(stageId, container)` 依 stageId 動態產生 DOM，提交由 `submitQuest(stageId)` 驗證。

流程：`tryUnlockStage` →（GPS 模擬 `simulateGps`）→ `openQuestModal` → 播語音導覽 → 互動作答 `submitQuest` → 田野證據任務 → 解鎖下一關；全部完成後 `triggerFinalChallenge` → `showFinalReport`。

### 音效系統（雙層 fallback）
`playSound(fileName, fallbackFunc)` 先嘗試播放 `game/assets/audio/` 的 mp3/wav；失敗時 fallback 到 **Web Audio API 即時合成**（`synthClick` / `synthCorrect` / `synthTigerRoar` / `synthOperaMelody` 等）。語音導覽與回饋優先用預錄 mp3，否則用 `speechSynthesis`（找 `zh-TW` voice）。新增音效務必同時提供合成 fallback。

### 田野證據任務
每關除解謎外都有一項必做的現場紀錄（拍照 / 錄音 / ≥20 字文字），由 `renderEvidenceTask` 渲染。錄音用 `MediaRecorder`（首次要麥克風權限），照片壓縮後存入 `state.photos`，最後匯入成果牆。

## 部署

push 到 `main` 觸發 `.github/workflows/deploy-pages.yml`，**直接上傳 `game/` 目錄**（不是 `dist/`）到 GitHub Pages。線上版：<https://hsuyiping-rgb.github.io/xinzhuang-old-street-exploration-game/>。

## 內容來源

`新莊老街4.pptx`（教學原始素材）、`新莊老街文史資料與遊戲擴充指南.md`、`新莊老街探索遊戲完整規劃方案.md` 是擴充關卡與文史內容的依據，不是程式碼。

## 待擴充（仍屬原型範圍外）

實地 GPS（目前為模擬）、真正的 AR 影像辨識、後端資料同步皆尚未實作。
