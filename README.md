# Rep Trackers — Static Wellness & Habit Companion

> **A 100% static, client-side wellbeing web application built with React 19, TypeScript, Vite, and Tailwind CSS v4.**  
> Built for sustainable health habits, judgment-free body metrics, flexible nutrition planning, and an AI-powered mindful wellness coach that operates entirely in the browser with **zero backend servers, zero databases, and zero tracking**.

---

## 📋 Table of Contents

- [Core Philosophy](#-core-philosophy)
- [Validation of Cursor Changes](#-validation-of-cursor-changes)
- [100% Static Architecture](#-100-static-architecture)
- [Feature Logic Breakdown](#-feature-logic-breakdown)
  - [1. BMI Calculator](#1-bmi-calculator)
  - [2. Body Movement Mix & Silhouette Analyzer](#2-body-movement-mix--silhouette-analyzer)
  - [3. Diet Suggestion & Meal Planner](#3-diet-suggestion--meal-planner)
  - [4. Mindful Companion Chat & LLM Integration](#4-mindful-companion-chat--llm-integration)
  - [5. Community Habit Gamification & Leaderboard](#5-community-habit-gamification--leaderboard)
  - [6. Deep-Linked Article & Trust Document Reader](#6-deep-linked-article--trust-document-reader)
- [LLM Integration Guide (Static & Private)](#-llm-integration-guide-static--private)
  - [Why it Remains 100% Static](#why-it-remains-100-static)
  - [Supported LLM Providers & Presets](#supported-llm-providers--presets)
  - [Privacy & Safety Guardrails](#privacy--safety-guardrails)
- [Data Storage & Privacy Model](#-data-storage--privacy-model)
- [Local Development & Production Build](#-local-development--production-build)
- [Deploying to Static Hosts](#-deploying-to-static-hosts)

---

## 🌿 Core Philosophy

Health guidance is often filled with shame, rigid meal dogma, or invasive data collection. **Rep Trackers** is built around three foundational pillars:
1. **Care First & Judgment-Free:** Numbers (like BMI) are treated as screening prompts, not moral grades.
2. **Small Sustainable Wins:** Progress is built on 5 small, achievable daily actions rather than all-or-nothing extremes.
3. **Radical Privacy:** Everything runs on the client. Photos, habit scores, names, chat histories, and API keys never leave the browser.

---

## 🔍 Validation of Cursor Changes

During development, Cursor ran out of its session token limit mid-task while modularizing the codebase. Here is the validation summary of what was generated, what was broken or missing, and how it was resolved:

| Component / File | State Left by Cursor | Issues Found & Validated | Solution Implemented |
|---|---|---|---|
| **`src/App.tsx`** | Partially refactored monolith | Missing `StoreProvider` wrapping, incomplete button bindings, unhandled image removal, no chat suggestions | Bound all tools to `useStore()`, added photo clearance, quick prompt chips, toast banners, and wrapped root with `<StoreProvider>` |
| **`src/index.css`** | Abruptly stopped mid-file | Checkbox distorted by `.chat-settings input { width: 100% }`, missing styles for `.message-meta`, `.source-row`, `.chat-settings`, badges, toasts | Scoped inputs with `:not([type="checkbox"])`, added complete CSS suite for chips, modals, banners, and habit meter |
| **`src/lib/model.ts`** | Basic OpenAI endpoint only | Only supported OpenAI endpoint with no provider presets, no Gemini support, no connectivity test | Added multi-provider presets (Groq, Gemini, OpenRouter, OpenAI, Ollama), CORS warnings, key testing, and native Gemini fallback |
| **`src/lib/bmi.ts`** | Standalone math | Switching units reset values; no category badges or distance to healthy range | Added `metricToImperial` and `imperialToMetric` sync helpers, delta calculations, and check-in logging binding |
| **`src/lib/diet.ts`** | Static template arrays | No macro breakdown, no hydration recommendation, no copy-to-clipboard functionality | Added `MACRO_TARGETS`, hydration targets by activity level, and one-click formatted plan clipboard export |
| **`src/lib/frame.ts`** | Canvas pixel loop written | No photo reset UI, missing quick habit action logging | Added clear photo handler and connected movement result directly to habit tracker |
| **`src/lib/progress.ts`**| Basic action scores | No tiers, no backup/restore mechanism | Added `TIERS` (Starter → Master), JSON export/import utilities, and completion percentage tracker |

---

## ⚡ 100% Static Architecture

Rep Trackers is built to be deployed anywhere as a set of flat, static HTML, CSS, and JS files (e.g. GitHub Pages, Vercel, Netlify, Cloudflare Pages, or an S3 bucket).

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                       CLIENT'S BROWSER                           │
   │                                                                  │
   │   ┌───────────────┐     ┌──────────────────┐   ┌──────────────┐  │
   │   │  React 19 UI  │ ◄─► │  Zustand/Store   │ ◄─┤ localStorage │  │
   │   └───────┬───────┘     │  (useStore)      │   │  Persistence │  │
   │           │             └──────────────────┘   └──────────────┘  │
   │           ▼                                                      │
   │   ┌────────────────────────────────────────┐                     │
   │   │        Client-Side Logic Engines       │                     │
   │   │  • WHO BMI Calculator                  │                     │
   │   │  • Canvas Edge Silhouette Analyzer     │                     │
   │   │  • Deterministic Diet Plan Builder     │                     │
   │   │  • Rule-Based Offline Companion        │                     │
   │   └───────────────────┬────────────────────┘                     │
   │                       │ (Optional LLM Mode)                      │
   │                       ▼                                          │
   │             Direct Browser Fetch (HTTPS)                         │
   └───────────────────────┼──────────────────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    External LLM Provider        Local Ollama Server
    (Groq / Gemini / OpenRouter) (http://localhost:11434)
```

- **No Node.js / Python / Go backend server required.**
- **No SQL or NoSQL database.**
- **Zero user data telemetry.**
- **State persists automatically** in standard Web `localStorage`.

---

## 🛠️ Feature Logic Breakdown

### 1. BMI Calculator
- **File:** `src/lib/bmi.ts` & `BmiTool` in `src/App.tsx`
- **Logic:**
  - Evaluates standard WHO adult screening bands:
    - *Underweight:* $\text{BMI} < 18.5$
    - *Healthy Weight:* $18.5 \le \text{BMI} \le 24.9$
    - *Overweight:* $25.0 \le \text{BMI} \le 29.9$
    - *High / Obese:* $\text{BMI} \ge 30.0$
  - **Dynamic Unit Synchronization:** When switching between Metric (cm/kg) and Imperial (ft-in/lb), values are mathematically converted on the fly without loss.
  - **Delta Calculations:** Calculates distance to the healthy weight range in current units.
  - **Action Hook:** One-click button to log today's **Daily Check-in (+25 pts)** directly into the progress store.

### 2. Body Movement Mix & Silhouette Analyzer
- **File:** `src/lib/frame.ts` & `BodyTool` in `src/App.tsx`
- **Logic:**
  - **Self-Assessment Check:** 3 questions (Shoulders vs Hips, Natural Build, Weight Change response) weighted into 3 tailored movement mixes: *Ease-in*, *Balanced*, or *Strength-and-Walk*.
  - **On-Device Canvas Silhouette Analysis (`readSilhouette`):**
    - Runs entirely in the client using an offscreen HTML5 `<canvas>` element.
    - Scales image to 180px, samples corner background colors, computes Euclidean distance to isolate foreground mask.
    - Measures shoulder-to-hip width ratios to supply a low-confidence nudge without sending the image to any external server.
  - Includes image preview with **"Remove Photo"** functionality.
  - **Action Hook:** One-click button to log **Take a Walk (+40 pts)**.

### 3. Diet Suggestion & Meal Planner
- **File:** `src/lib/diet.ts` & `DietTool` in `src/App.tsx`
- **Logic:**
  - Combinatorial matrix across **3 Goals** (Steady Energy, Build Strength, Feel Lighter) $\times$ **3 Preferences** (Vegetarian, Vegan, Flexible) $\times$ **3 Activity Levels** (Light, Moderate, High).
  - Dynamic **Macronutrient Breakdown** (Carbs %, Protein %, Fat %) & tailored **Hydration Targets** (2.0L to 3.8L).
  - **Randomized Day Variant Shuffling** for daily menu variety.
  - **Clipboard Export:** Formats the entire meal plan into clean text ready for note apps or messaging.
  - **Action Hook:** One-click button to log **Drink Water (+15 pts)**.

### 4. Mindful Companion Chat & LLM Integration
- **File:** `src/lib/companion.ts`, `src/lib/model.ts`, & `ChatTool` in `src/App.tsx`
- **Logic:**
  - **Dual-Engine System:**
    1. **Offline Rule-Based Companion:** Deterministic keyword analysis matching 13 wellness categories (sleep, anxiety, mood, hydration, soreness, burnout, habits, etc.) with article links and crisis prevention.
    2. **Connected LLM Engine:** Optional direct connection to external LLMs (Groq, Gemini, OpenRouter, OpenAI, Ollama).
  - **Quick Suggestion Chips:** 5 prompt chips for instant answers without typing.
  - **Conversation Management:** Local storage persistence, conversation copy, and connection testing.

### 5. Community Habit Gamification & Leaderboard
- **File:** `src/lib/progress.ts` & `Community` in `src/App.tsx`
- **Logic:**
  - Tracks 5 daily habits: *Take a walk (+40)*, *Drink water (+15)*, *Daily check-in (+25)*, *Support someone (+30)*, *Mindful minutes (+35)*.
  - **Daily Habit Meter:** Displays completion percentage (e.g. 3 of 5 habits · 60%).
  - **Habit Tiers:** Starter (0+) $\to$ Bronze Mover (1,300+) $\to$ Silver Steady (1,500+) $\to$ Gold Builder (1,800+) $\to$ Habit Master (2,200+).
  - **Streak Engine:** Automatically evaluates consecutive active days using `todayKey` and `yesterdayKey`.
  - **Backup & Restore:** Full JSON export/import so users can transfer or back up their habit progress across devices.

### 6. Deep-Linked Article & Trust Document Reader
- **File:** `src/data/library.ts`, `Reader`, & `Sheet` in `src/App.tsx`
- **Logic:**
  - In-page modal overlay supporting hash navigation (`#article-{id}` and `#doc-{id}`).
  - Full keyboard accessibility: traps focus, locks background scrolling, and dismisses on `Escape`.

---

## 🤖 LLM Integration Guide (Static & Private)

### Why it Remains 100% Static
The LLM integration operates entirely via client-side `fetch()` calls from the user's browser. There is **no proxy server**, no cloud function, and no backend API route. 

### Supported LLM Providers & Presets

| Provider | Recommended Model | Browser CORS Support | Setup URL |
|---|---|---|---|
| **Groq (Recommended)** | `llama-3.3-70b-versatile` | ✅ Full Browser Support | [Groq Console](https://console.groq.com/keys) |
| **Google Gemini** | `gemini-2.0-flash` | ✅ Full Browser Support | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **OpenRouter** | `meta-llama/llama-3.2-3b-instruct:free` | ✅ Full Browser Support | [OpenRouter Keys](https://openrouter.ai/keys) |
| **Local Ollama** | `llama3.2` | ✅ Yes (with `OLLAMA_ORIGINS="*"`) | [Ollama Docs](https://ollama.com) |
| **OpenAI** | `gpt-4o-mini` | ⚠️ Requires CORS allowlist | [OpenAI Platform](https://platform.openai.com/api-keys) |

#### Quick Setup: Groq (Fastest & Free)
1. Get a free API key at [console.groq.com/keys](https://console.groq.com/keys).
2. In Rep Trackers, click **"Connect Your Own LLM Model"** at the bottom of the Wellness Chat.
3. Check **"Enable connected LLM"**.
4. Select **"Groq (Fastest & Free Tier)"** from the preset dropdown.
5. Paste your API key and click **"Test API Connection"**.

#### Quick Setup: Google Gemini
1. Get a free API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).
2. Select **"Google Gemini"** preset in Rep Trackers.
3. Rep Trackers uses Gemini's OpenAI-compatible endpoint:  
   `https://generativelanguage.googleapis.com/v1beta/openai`
4. Enter your key and test connection.

#### Quick Setup: Local Ollama (100% Private Offline LLM)
Run Ollama with browser origins enabled:
```bash
# macOS / Linux
OLLAMA_ORIGINS="*" ollama serve

# Windows PowerShell
$env:OLLAMA_ORIGINS="*"
ollama serve
```
Then select the **"Local Ollama"** preset (`http://localhost:11434/v1`). No API key is needed.

### Privacy & Safety Guardrails
1. **Crisis Intercept:** Messages matching self-harm or acute crisis keywords are **never sent to external LLMs**. The companion immediately displays regional crisis hotlines (India AASRA +91 98204 66726 / US 988 / IASP International).
2. **Key Sanitization:** If an HTTP error occurs, API keys are stripped from error strings before display (`••••`).
3. **Clinical Boundaries:** The system prompt instructs models never to diagnose, prescribe medication, or endorse extreme caloric deficits.
4. **Offline Fallback:** If the endpoint is blocked, rate-limited, or unreachable, the app seamlessly provides the built-in offline companion response.

---

## 🔒 Data Storage & Privacy Model

All state is persisted under clear local storage keys:

| LocalStorage Key | Purpose |
|---|---|
| `reptrackers.progress.v1` | User points, streaks, logged habits today, pledge timestamp |
| `reptrackers.chat.v2` | Up to 40 recent chat turns |
| `reptrackers.model.v2` | Selected LLM provider, custom base URL, model name, API key |

To completely wipe all on-device data:
- Click **"Reset on-device score"** on the leaderboard.
- Click **"Clear chat"** in chat settings.
- Or clear site data in your browser DevTools.

---

## 💻 Local Development & Production Build

### Prerequisites
- Node.js $\ge 18$
- `pnpm` $\ge 9$

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
pnpm run dev
```
Preview the app at `http://localhost:8443` (or the port specified by Vite).

### Production Build
```bash
pnpm run build
```
Creates an optimized static bundle in the `dist/` directory ready for deployment.

---

## 🚀 Deploying to Static Hosts

Because Rep Trackers is 100% static, it can be deployed to any host in seconds:

### GitHub Pages
1. In `vite.config.ts`, ensure `base: './'` is configured if deploying to a subpath.
2. Build the project: `pnpm run build`.
3. Deploy the `dist/` folder via GitHub Actions or the `gh-pages` branch.

### Vercel / Netlify / Cloudflare Pages
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Framework Preset:** Vite
