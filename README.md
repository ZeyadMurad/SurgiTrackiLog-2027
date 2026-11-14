# SurgiTrack iLog — Professional Surgical Training & Clinical Portfolio

[![CI](https://github.com/ZeyadMurad/SurgiTrackiLog-2027/actions/workflows/ci.yml/badge.svg)](https://github.com/ZeyadMurad/SurgiTrackiLog-2027/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

A professional surgical training, clinical logbook, and medical portfolio platform
for surgeons, surgical trainees, and clinical professionals. Track clinical cases,
training hours, skills competency, supervisor signatures, and build an exportable
portfolio — all in a multilingual (English / Arabic / German, RTL-aware) PWA.

> **README بالعربية** — انظر القسم [نظرة عامة بالعربية](#نظرة-عامة-بالعربية) في أسفل الملف.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Clinical Cases** — Full structured case model (history, examination, investigations,
  diagnosis, management, surgical procedure, follow-up) with strict patient anonymity
  (`CAS-YYYY-NNN` references, no PHI).
- **Supervisors & Digital Signatures** — Link supervisors, sign training records with
  SHA-256 content hashes; signed records become immutable.
- **Training Logbook** — Sessions and records with auto-calculated net training hours,
  participation levels, and supervision levels.
- **Skills Matrix** — Competency tracking (Observed → Mastered) per skill, specialty, and
  supervisor, with exposure-level history.
- **Surgical Community** — Publish anonymized cases to a shared feed with likes,
  comments, follow requests, and surgeon discovery directory.
- **Recommendation Letters** — AI-assisted (Gemini) multilingual recommendation letter
  generation, finalized by supervisors.
- **Accreditation & Portfolio Export** — DOCX / PDF / XLSX exports, including a
  German-portfolio view compliant with German surgical training reporting.
- **Learning Curve Analytics** — Visualize progression per skill and procedure.
- **Medical Research** — PubMed search, medical journals (Europe PMC / Crossref /
  Cochrane proxy), and surgical news aggregation.
- **PWA** — Installable, offline-capable via Firestore persistent local cache and a
  service worker.
- **i18n** — English, Arabic (RTL), German.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19, TypeScript, Vite 8, Tailwind CSS 4, lucide-react, Motion |
| State | React Context (`AuthContext`, `DataContext`) — *splitting in progress* |
| Backend | Express (custom `server.ts`) via `tsx`, server-side Gemini proxy |
| Auth & DB | Firebase Auth, Cloud Firestore (persistent local cache) |
| AI | Google Gemini (`@google/genai`), proxied server-side with rate limiting |
| Email | Nodemailer (verification emails) |
| Exports | `docx`, `jspdf` + `jspdf-autotable`, `jszip`, `xlsx` |
| Testing | Vitest |
| Quality | ESLint, Prettier, Husky pre-commit |

## Prerequisites

- Node.js ≥ 20 (or [Bun](https://bun.sh) ≥ 1.1 — recommended, `bun.lock` included)
- A Firebase project with Auth (Email/Password) and Firestore enabled
- A Google Gemini API key (server-side only)

## Quick Start

```bash
# 1. Install dependencies (Bun recommended)
bun install
#   or: npm install

# 2. Configure environment
cp .env.example .env
#   then edit .env and fill in your Firebase + Gemini values

# 3. Start the dev server (Express + Vite middleware)
bun run dev
#   or: npm run dev

# 4. Open http://localhost:3000
```

The dev server (`server.ts`) serves the Vite app and proxies all API routes
(`/api/gemini/*`, `/api/news`, `/api/pubmed`, `/api/journals`, etc.) server-side so
no secret keys ever reach the browser.

## Environment Variables

All configuration lives in `.env` (git-ignored; see `.env.example`). **Never commit
real credentials.** Two groups:

**Server-side only** (no `VITE_` prefix → never bundled to the browser):

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `APP_URL` | Canonical public URL (used for verification links, self-references) |
| `GH_TOKEN` | Optional GitHub token for server-side automation |
| `SMTP_*` | Optional SMTP for verification emails |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional: distributed rate limiting (see [Security](#security)) |
| `TRUSTED_PROXY_HOPS` | Number of trusted reverse-proxy tiers (default `1`, Cloud Run) |

**Client-side** (`VITE_` prefix → injected into the browser bundle):

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | Firestore database ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `VITE_FIREBASE_OAUTH_CLIENT_ID` | OAuth client ID |
| `VITE_FIREBASE_RECAPTCHA_SITE_KEY` | reCAPTCHA site key (optional) |

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server (`tsx server.ts`) on port 3000 |
| `bun run build` | Production build (`vite build`) → `dist/` |
| `bun run start` | Run server in production mode (serves `dist/`) |
| `bun run preview` | Preview the production build |
| `bun run lint` | Type-check (`tsc --noEmit`) |
| `bun run eslint` | Lint with ESLint |
| `bun run format` | Format with Prettier |
| `bun run test` | Run unit tests with Vitest |
| `bun run test:run` | Run tests once (CI mode) |
| `bun run clean` | Remove `dist/` |

## Project Structure

```
.
├── server.ts                  # Express server: API proxy + static serving
├── firestore.rules            # Firestore security rules (strict, owner-scoped)
├── firebase.json              # Firebase deploy config (rules + indexes)
├── firestore.indexes.json     # Composite indexes
├── Dockerfile                 # Production container image
├── .github/workflows/ci.yml   # CI: type-check + lint + test + build
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── assets/                # Static assets
└── src/
    ├── main.tsx               # App entry
    ├── App.tsx                # App shell + view routing
    ├── index.css              # Tailwind directives + globals
    ├── components/            # 31 view/modal components
    ├── context/
    │   ├── AuthContext.tsx    # Firebase auth state
    │   └── DataContext.tsx    # Firestore data + CRUD (*planned split*)
    ├── lib/
    │   ├── firebase.ts        # Firebase init (env-driven)
    │   ├── firestorePaths.ts  # Centralized collection path constants
    │   ├── exports.ts         # DOCX/PDF/XLSX portfolio exports
    │   ├── backup.ts          # Backup/restore logic
    │   ├── i18n.ts            # en/ar/de translations
    │   ├── medicalDefaults.ts # Specialty/procedure defaults
    │   └── doctorUtils.ts     # Doctor case-matching helpers
    ├── types/index.ts         # Shared TypeScript domain types
    └── test/                  # Vitest unit tests
```

## Architecture

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full data model, context
boundaries, Firestore security model, and the planned `DataContext` decomposition.

In short:

- **`AuthContext`** wraps Firebase Auth and exposes the signed-in user, profile, and
  admin role checks.
- **`DataContext`** owns all Firestore state and CRUD for cases, supervisors, training
  records/sessions, skills, recommendations, community cases, notifications, and
  backups. *It is being decomposed into per-domain contexts; the current monolith
  remains as a backward-compatible facade during the migration.*
- **`server.ts`** is the only place secrets live. It proxies Gemini AI, email
  verification, news, PubMed, and journal APIs behind per-IP rate limits.
- **`ErrorBoundary`** wraps the app so a single view crash does not blank the screen.

## Security

This project has been through a security hardening pass (see git history). Highlights:

- **No secrets in the client.** Firebase config is env-driven (`VITE_FIREBASE_*`);
  Gemini/SMTP/GitHub tokens stay server-side only.
- **Strict Firestore rules.** Owner-scoped access; anonymous access confined to a
  guest `usr_*` namespace; community likes/comments require an authenticated session
  bound to the claimed `userId`.
- **Per-IP rate limiting** on every sensitive endpoint (verification email, Gemini,
  news, PubMed, journals, case suggestions). In-memory by default; **distributed via
  Upstash Redis when `UPSTASH_REDIS_REST_URL` is set** (required for multi-instance
  Cloud Run).
- **Security headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Content-Security-Policy`, `Permissions-Policy`.
- **Link-poisoning prevention:** verification URLs are built from `APP_URL` (env), not
  raw `Host` headers.
- **Admin role** is currently bound to a single verified email in Firestore rules —
  see [ARCHITECTURE.md](ARCHITECTURE.md) § Security for the planned `super_admins`
  collection migration.

> ⚠️ **If you previously shared a GitHub PAT or Firebase keys in any channel, revoke
> them immediately and rotate.** This README and the `.env.example` are the only
> places credential names should appear — never real values.

## Testing

Unit tests run with [Vitest](https://vitest.dev):

```bash
bun run test          # watch mode
bun run test:run      # single run (CI)
```

Tests currently cover pure utilities (`doctorUtils`, `firestorePaths`). Expanding to
Firestore rules unit tests (`@firebase/rules-unit-testing`) and Playwright E2E smoke
tests is on the roadmap — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Deployment

### Docker

```bash
docker build -t surgitrack-ilog .
docker run -p 3000:3000 --env-file .env surgitrack-ilog
```

### Cloud Run / AI Studio

The app is designed for a single trusted reverse-proxy tier (Cloud Run LB). Set
`TRUSTED_PROXY_HOPS=1` (default) and provide all env vars. For multi-instance
deployments, configure Upstash Redis for distributed rate limiting.

### Firebase

```bash
# Deploy Firestore rules + indexes
firebase deploy --only firestore
```

`firebase.json` and `firestore.indexes.json` are checked in so rules and indexes are
version-controlled and reproducible.

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)**. The pre-commit hook (Husky) runs
`eslint` + `tsc --noEmit`; CI additionally runs tests and a production build.

## License

Licensed under the [Apache License 2.0](LICENSE).

---

## نظرة عامة بالعربية

**SurgiTrack iLog** منصة احترافية لتتبّع التدريب الجراحي والمحفظة السريرية، موجّهة
للجراحين والمتدرّبين والعاملين في المجال الطبي. تدعم اللغات العربية (مع اتجاه RTL
الكامل) والإنجليزية والألمانية.

أبرز الميزات: سجل الحالات السريرية (مع إخفاء تام لهوية المرضى)، المشرفون والتوقيعات
الرقمية (SHA-256)، سجل ساعات التدريب، مصفوفة المهارات والكفاءات، مجتمع جراحي تفاعلي،
خطابات توصية بمساعدة الذكاء الاصطناعي (Gemini)، تصدير المحفظة بصيغ DOCX/PDF/XLSX بما
في ذلك نسخة ألمانية متوافقة مع متطلبات التدريب الجراحي، وأدوات بحث طبي (PubMed
والمجلات والأخبار).

للبدء: `bun install` ثم `cp .env.example .env` واملأ القيم، ثم `bun run dev`. كل
بيانات الاعتماد تُحفظ في `.env` (مستثنى من Git) ولا تصل مفاتيح الخادم السرية إلى
المتصفح أبداً. راجع الأقسام أعلاه للتفاصيل الكاملة.
