# Contributing to SurgiTrack iLog

Thanks for your interest in contributing! This document covers the workflow,
code standards, and review expectations.

## Quick Reference

```bash
bun install            # install deps
cp .env.example .env   # configure (fill in real values)
bun run dev            # start dev server on :3000
bun run lint           # tsc --noEmit  (must pass)
bun run eslint         # eslint        (must pass)
bun run test:run       # vitest        (must pass)
bun run build          # production build (must pass)
```

## Branching & Pull Requests

1. Branch from `main` using a descriptive name:
   - `feat/<short-description>` — new feature
   - `fix/<short-description>` — bug fix
   - `chore/<short-description>` — tooling, deps, docs
   - `security/<short-description>` — security hardening
2. Keep PRs focused — one logical change per PR. Large refactors should be
   broken into reviewable steps.
3. Ensure **all** of these pass before requesting review:
   - `bun run lint` (0 TypeScript errors)
   - `bun run eslint` (0 lint errors; warnings acceptable only with justification)
   - `bun run test:run` (tests green)
   - `bun run build` (production build succeeds)
4. CI (`.github/workflows/ci.yml`) runs the same checks on every PR; a red CI
   blocks merge.

## Pre-commit Hook

[Husky](https://typicode.github.io/husky/) runs `eslint` and `tsc --noEmit` on
staged changes via `.husky/pre-commit`. If the hook blocks your commit, fix the
reported issues rather than bypassing it. To bypass in an exceptional case (e.g.
WIP commit), use `--no-verify` — but CI will still enforce the checks.

## Code Style

- **TypeScript everywhere.** No `any` in new code — use the shared domain types in
  `src/types/index.ts`. If a type is missing, add it there.
- **Formatting:** Prettier (`.prettierrc`). Run `bun run format` before committing.
- **Linting:** ESLint flat config (`eslint.config.js`). New warnings should be
  resolved, not silenced, unless justified in the PR description.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for
  components/types/interfaces, `UPPER_SNAKE_CASE` for constants.
- **Firestore paths:** use the centralized constants in `src/lib/firestorePaths.ts`
  — never hardcode collection path strings.
- **No secrets in code.** All keys/tokens go in `.env` (git-ignored). Server-only
  vars have no `VITE_` prefix; client-injected vars use the `VITE_` prefix.
- **Comments:** explain *why*, not *what*. Keep the existing comment density of the
  surrounding code.

## Architecture Notes

- **State:** `AuthContext` (auth/profile) and `DataContext` (all Firestore data +
  CRUD). `DataContext` is large and being decomposed into per-domain contexts —
  see [ARCHITECTURE.md](ARCHITECTURE.md). When adding new domain logic, prefer
  colocating it and exposing it through the existing `useData()` API to avoid
  breaking the 31 consumer components.
- **Server secrets:** only `server.ts` may touch `GEMINI_API_KEY`, `SMTP_*`,
  `GH_TOKEN`. The browser never imports these.
- **Security rules:** any change to Firestore data shape **must** be accompanied by
  a matching update to `firestore.rules` and, where applicable,
  `firestore.indexes.json`.

## Testing

- **Unit tests** (Vitest) live in `src/test/` and cover pure utilities. When you
  add or change a pure function in `src/lib/`, add or update its test.
- **Firestore rules tests** (`@firebase/rules-unit-testing`) are planned for the
  complex authorization functions (`isCommunityCaseOwner`, `isUserOrAliasOwner`).
- **E2E smoke tests** (Playwright) are planned for the critical flows:
  login → create case → publish to community → supervisor signature.

Until E2E is in place, manually verify the critical flow after any change to
`AuthContext`, `DataContext`, or `App.tsx`.

## Security Disclosures

If you find a security issue, **do not open a public issue**. The admin role and
credential handling are sensitive — contact the maintainer privately and rotate any
exposed tokens immediately.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add learning-curve forecast model
fix(security): confine anonymous access to guest namespace
chore(deps): bump firebase to 13.2
docs: expand ARCHITECTURE context boundaries
```

## License

By contributing, you agree your contributions are licensed under the
[Apache License 2.0](LICENSE).
