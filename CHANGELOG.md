# Changelog

All notable changes to SurgiTrack iLog are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-11-14

First structured release. Engineering hardening pass across documentation,
security, tooling, CI/CD, performance, and tests.

### Added
- **Documentation:** README.md (features, quick start, env vars, scripts,
  structure, security, deployment + Arabic summary), LICENSE (Apache-2.0),
  CONTRIBUTING.md (branch/PR workflow, pre-commit, code style), ARCHITECTURE.md
  (data model, context boundaries, Firestore security model, planned DataContext
  decomposition & AddCaseModal wizard).
- **CI/CD:** GitHub Actions workflow (`.github/workflows/ci.yml`) running
  `tsc` + `eslint` + `vitest` + `build` on every PR/push, with concurrency
  cancellation and a build artifact upload.
- **Deployment:** `Dockerfile` (multi-stage, bun runtime), `docker-compose.yml`
  (app + redis for local dev), `.dockerignore`.
- **Firebase:** `firebase.json` + `firestore.indexes.json` (version-controlled
  rules & indexes).
- **Tooling:** ESLint flat config, Prettier, Husky pre-commit hook (`tsc` +
  `eslint`), EditorConfig.
- **Testing:** Vitest config + 23 unit tests (`firestorePaths`, `doctorUtils`).
- **Architecture:** `src/lib/firestorePaths.ts` (centralized collection path
  constants), `src/lib/offlineQueue.ts` (pure offline-queue types + helpers —
  Phase 1 of the DataContext decomposition), `ErrorBoundary` component.
- **Security:** distributed rate limiting via Upstash Redis
  (`src/lib/rateLimiter.ts`) with in-memory fallback; Content-Security-Policy,
  Permissions-Policy, COOP, CORP headers; `TRUSTED_PROXY_HOPS` env var.
- **Design tokens:** CSS custom properties + Tailwind `@theme` palette mapping
  in `src/index.css`.

### Changed
- `server.ts`: rate limiting extracted to `src/lib/rateLimiter.ts` (pluggable
  backend, fail-open); trust proxy driven by `TRUSTED_PROXY_HOPS`;
  `/api/health` reports the active rate-limit backend; expanded security headers.
- `src/App.tsx`: heavy views and modals load via `React.lazy` + `<Suspense>`,
  wrapped in `<ErrorBoundary>`.
- `firestore.rules`: `isSuperAdmin()` now also checks a `super_admins/{uid}`
  collection (uid-based role registry), with the original verified-email check
  kept as a backward-compatible fallback; added a `super_admins/{uid}` match
  block (super-admin-only read/write).
- `package.json`: name → `surgitrack-ilog`; new scripts (`eslint`, `format`,
  `test`, `test:run`, `prepare`); TypeScript pinned to `~5.9.0` (typescript-eslint
  does not yet support TS 7; the esbuild production build is unaffected).
- `.env.example`: documented `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
  `TRUSTED_PROXY_HOPS`, `CSP_REPORT_ONLY`.

### Fixed
- `AddCaseModal`: a `useState` declared after an early `return` in the component
  body is now declared before the return (`react-hooks/rules-of-hooks`). This was
  a latent hooks-ordering violation.

### Performance
- Initial client bundle reduced from **2,672 KB → 1,146 KB** (gzip 770 KB →
  335 KB, **−57%**) via per-view code-splitting. Export libraries (`xlsx`,
  `jspdf`, `html2canvas`) now load only when an export is triggered.

### Security
- No credentials are committed. All secrets live in `.env` (git-ignored);
  `.env.example` contains only placeholder names. Server-only vars have no
  `VITE_` prefix; client-injected vars use the `VITE_` prefix.

### Deferred (documented in ARCHITECTURE.md)
- Full `DataContext` decomposition into per-domain contexts (Phase 2–3: requires
  migrating 31 consumer components — high runtime risk without E2E coverage).
- `AddCaseModal` multi-step wizard with autosave (runtime-sensitive rewrite;
  deferred until E2E smoke tests cover the create-case flow).
