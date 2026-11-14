# Architecture — SurgiTrack iLog

This document describes the runtime architecture, data model, security model, and
the planned evolution of the codebase. It is the authoritative reference for
where things live and why.

## Contents

- [High-Level Overview](#high-level-overview)
- [Request & Data Flow](#request--data-flow)
- [Context Boundaries](#context-boundaries)
- [Firestore Data Model](#firestore-data-model)
- [Security Model](#security-model)
- [Server (`server.ts`)](#server-serverts)
- [Internationalization](#internationalization)
- [Planned Decomposition: `DataContext`](#planned-decomposition-datacontext)
- [Planned: `AddCaseModal` Multi-Step Wizard](#planned-addcasemodal-multi-step-wizard)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)

---

## High-Level Overview

```
┌──────────────────────── Browser ─────────────────────────┐
│  React 19 SPA (Vite)                                       │
│  ┌────────────┐   ┌────────────┐   ┌──────────────────┐   │
│  │ AuthContext│   │ DataContext│   │ ErrorBoundary     │   │
│  │ (Firebase  │   │ (Firestore │   │ + React.lazy      │   │
│  │  Auth)     │   │  state+CRUD)│   │ (per-view chunks) │   │
│  └─────┬──────┘   └─────┬──────┘   └──────────────────┘   │
│        │                │                                  │
│        │  Firebase Auth  │  Cloud Firestore (persistent    │
│        └────────────────┘   local cache, multi-tab)        │
│                                                            │
│  fetch /api/* ───────────────────────┐                     │
└──────────────────────────────────────┼─────────────────────┘
                                       │ HTTPS
┌──────────────────────────────────────▼─────────────────────┐
│  Express server (server.ts, tsx) — single trusted proxy    │
│  • Rate limiting (in-memory OR Upstash Redis)              │
│  • Security headers (CSP, XFO, nosniff, Permissions-Policy)│
│  • Gemini AI proxy  • PubMed/Journals/News proxy           │
│  • Nodemailer verification emails                           │
│  Secrets: GEMINI_API_KEY, SMTP_*, GH_TOKEN (server-only)   │
└────────────────────────────────────────────────────────────┘
```

Two hard rules:

1. **Secrets never cross to the browser.** Anything without a `VITE_` prefix is
   server-only. The browser talks to Firebase directly (using public web config)
   and to our own Express server for anything requiring a secret.
2. **Firestore is the single source of truth.** Community cases live in
   `communityCases/{caseId}` (shared feed) and are mirrored as a subcollection under
   each author's `users/{userId}/clinicalCases/{caseId}`.

## Request & Data Flow

- **Auth:** `AuthContext` subscribes to `onAuthStateChanged`. The signed-in user's
  profile is read from `users/{uid}`. Admin status is derived from a verified email
  (see [Security Model](#security-model)).
- **Data:** `DataContext` opens Firestore `onSnapshot` listeners for the signed-in
  user's subcollections (cases, supervisors, training records/sessions, skills,
  recommendations, saved articles, notifications) and the shared
  `communityCases` feed. Persistent local cache keeps data available offline and
  syncs on reconnect.
- **AI / research:** the browser POSTs to `/api/gemini/*`, `/api/pubmed`,
  `/api/news`, `/api/journals`. The server attaches the secret key, enforces
  per-IP rate limits, sanitizes inputs, and returns the result.
- **Exports:** DOCX/PDF/XLSX generation happens **client-side** (`docx`, `jspdf`,
  `xlsx`) using data already in `DataContext`. No patient data is sent to a server.

## Context Boundaries

| Context | Owns | Exposes |
|---------|------|---------|
| `AuthContext` | Firebase Auth session, user profile, admin checks | `user`, `userProfile`, auth actions, role helpers |
| `DataContext` | All Firestore state + CRUD for every domain | ~70 values/functions (see below) |
| `ErrorBoundary` | Render crash isolation | fallback UI + reset |

`DataContext` currently exposes (via `useData()`): the collections
(`cases`, `supervisors`, `trainingRecords`, `trainingSessions`, `skills`,
`recommendations`, `savedArticles`, `communityCases`, `allDoctors`,
`viewedCommunityCaseIds`, `syncStatus`, `firestoreQuotaExceeded`), community
operations (`publishCaseToCommunity`, `toggleLikeCase`, `addCommentToCase`,
`toggleFollowDoctor`, `acceptFollowRequest`, …), supervisor/record signing
(`signTrainingRecords`, `verifyRecordIntegrity`, `verifyRecordIntegrityAsync`),
session/skill/recommendation CRUD, article saving, backup/restore, and aggregate
`stats`.

## Firestore Data Model

Collection paths are centralized in `src/lib/firestorePaths.ts`. The shape:

```
users/{userId}                              UserProfile
users/{userId}/clinicalCases/{caseId}       ClinicalCase (author's copy)
users/{userId}/viewedCommunityCases/{caseId} ViewedCommunityCase
users/{userId}/supervisors/{supervisorId}   Supervisor
users/{userId}/supervisors/{supervisorId}/trainingRecords/{recordId}  TrainingRecord
users/{userId}/trainingSessions/{sessionId} TrainingSession
users/{userId}/skills/{skillId}             UserSkill
users/{userId}/recommendations/{id}         RecommendationLetter
users/{userId}/savedArticles/{articleId}    SavedArticle
users/{userId}/backups/{backupId}           Backup snapshot
users/{userId}/notifications/{id}           AppNotification (per-user)

communityCases/{caseId}                     ClinicalCase (shared feed, SOT)
communityCases/{caseId}/comments/{commentId}  CaseComment (immutable)
communityCases/{caseId}/likes/{likeId}        CaseLike (keyed per userId)

accounts/{accountId}                        Email/password registry (hashed)
deleted_users/{uid}                         Admin deletion tombstone
notifications/{notificationId}              Persistent notifications
notification_replies/{replyId}              Reply to notifications
audit_logs/{logId}                          Audit trail (super-admin read)
public/surgicalNews/{articleId}             Curated news (read-only)
system/settings                             Global settings (super-admin write)
test/connection                             Connectivity probe
```

Key invariants:

- **Anonymity:** cases use `caseReference` (`CAS-YYYY-NNN`), never patient names.
  Attachments require `consentConfirmed`.
- **Immutability of signed records:** a `TrainingRecord` with a `signature`
  (SHA-256 `contentHash`) must not be mutated. `verifyRecordIntegrity` recomputes
  the hash and compares.
- **Single source of truth for community:** `communityCases/{caseId}` is the
  canonical published document; the author's `clinicalCases` copy carries
  `isPublished` + `publishedAt`.

## Security Model

Firestore rules (`firestore.rules`) enforce owner-scoped access:

- **Owner scope:** `isOwner(uid)`, `isEmailOwner(data)` (verified email match), and
  alias-based ownership (`aliasIds`) for cross-account portfolios.
- **Guest namespace:** anonymous access is confined to documents whose id matches
  `^usr_.*`. Real (Firebase-auth) data is never reachable anonymously.
- **Community interactions** (likes/comments) require an authenticated session whose
  `auth.uid` equals the claimed `userId` — anonymous forging is blocked.
- **Admin (`isSuperAdmin`):** currently a single verified email
  (`zeadmorud2030@gmail.com`) hardcoded in rules. This is a known limitation.

### Planned: `super_admins` collection

Replace the hardcoded email with a Firestore-backed role:

1. Add a `super_admins/{uid}` collection (write-protected; seeded by the current
   admin).
2. Change `isSuperAdmin()` to check `exists(/databases/$(database)/documents/super_admins/$(request.auth.uid))`
   (with email-verified guard).
3. Migrate the current admin's uid into the collection.

This removes the single-email lock-in and supports multiple/admin transitions.

## Server (`server.ts`)

`server.ts` is an Express app run via `tsx`. Responsibilities:

- **Static serving:** in production it serves `dist/`; in dev it delegates to Vite.
- **API proxies** (all rate-limited): `/api/gemini/recommendation`,
  `/api/gemini/assistant`, `/api/news`, `/api/pubmed`, `/api/journals`,
  `/api/ai-status`, verification-email sending, case suggestions.
- **Rate limiting:** per-IP token buckets. **In-memory by default** (single
  instance). When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set,
  limits are enforced **across instances** via Upstash Redis — required for
  multi-instance Cloud Run. See `src/lib/rateLimiter.ts`.
- **Trusted proxy:** `TRUSTED_PROXY_HOPS` (default `1`) controls
  `app.set('trust proxy', …)` so `req.ip` resolves correctly behind Cloud Run's LB.
- **Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Content-Security-Policy`, `Permissions-Policy`.
- **Input safety:** whitelisted AI languages (`en/ar/de`), text length clamping,
  `APP_URL`-based verification links (no Host-header poisoning).

## Internationalization

`src/lib/i18n.ts` holds ~470 translation keys for `en`, `ar`, `de`. RTL is applied
globally when the active language is `ar` (the app sets `dir="rtl"` on the root).
All user-visible strings in components should go through `t.*`; new keys must be
added to all three languages.

## Planned Decomposition: `DataContext`

`DataContext.tsx` is ~3000 lines and exposes ~70 values/functions consumed by 31
components. A full split requires migrating every consumer, which is high-risk
without E2E coverage. The migration uses the **strangler** pattern:

**Phase 0 (done in this branch):**
- Centralize collection paths in `src/lib/firestorePaths.ts`.
- Add `ErrorBoundary` + `React.lazy` per view (resilience before refactor).

**Phase 1 (next):** extract pure helpers and Firestore path builders out of
`DataContext` into `src/lib/` modules. `DataContext` imports them; its public API
is unchanged. No consumer edits.

**Phase 2 (next):** introduce per-domain contexts — `CasesContext`,
`SupervisorsContext`, `CommunityContext`, `NotificationsContext`,
`BackupContext` — each owning its slice. `DataContext` becomes a thin facade that
composes them and re-exports the merged value, so `useData()` keeps working.

**Phase 3 (next):** migrate consumers one feature folder at a time
(`features/cases`, `features/community`, …) from `useData()` to granular hooks
(`useCases()`, `useCommunity()`). Once all consumers migrate, retire the facade.

Each phase keeps `tsc --noEmit`, tests, and the build green.

## Planned: `AddCaseModal` Multi-Step Wizard

`AddCaseModal.tsx` (~1300 lines) collects a full clinical case (history,
examination, investigations, diagnosis, management, procedure, follow-up) in a
single modal with ~40 controlled fields. Planned redesign:

- Split into a `CaseWizard` with discrete steps matching the clinical sections.
- **Autosave** draft to `localStorage` (`surgitrack_case_draft_<id>`) on every
  field change, with a "resume draft" affordance.
- Per-step validation (using the shared domain types) before enabling "Next".
- Keep the existing `onSave` contract identical so `ClinicalCasesView` is untouched.

This is deferred until E2E smoke tests cover the create-case flow, because a
modal-to-wizard rewrite is runtime-sensitive and `tsc` cannot catch interaction
regressions.

## Design Decisions & Trade-offs

- **Context over Redux/Zustand:** the app started with React Context for simplicity.
  The size of `DataContext` is the main cost; the strangler migration addresses it
  without a state-library migration.
- **Client-side exports:** DOCX/PDF/XLSX are generated in the browser so patient
  data never transits a server. The cost is larger bundle size for those libraries —
  mitigated by lazy-loading them only when an export is triggered.
- **Persistent Firestore cache:** enables offline use and faster reads, at the cost
  of more complex conflict handling. `cleanPayload` strips `undefined` to satisfy
  Firestore's `ignoreUndefinedProperties`.
- **In-memory rate limiting as default:** zero-infra to run locally; Upstash Redis
  is opt-in for production multi-instance deployments.
