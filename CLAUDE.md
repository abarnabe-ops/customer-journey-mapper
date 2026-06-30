# CLAUDE.md — Customer Journey Mapper

Repo-wide guardrails for any agent (Claude Code subagent, Agent SDK, or human) working in this project.

## What this is
React + Vite + TypeScript SPA with a Supabase backend, deployed to GitHub Pages.
- Production repo: abarnabe-ops/customer-journey-mapper  → https://abarnabe-ops.github.io/customer-journey-mapper/
- Staging repo:    abarnabe-ops/customer-journey-mapper-staging → https://abarnabe-ops.github.io/customer-journey-mapper-staging/
- Branch model: build on `staging` → CI gate → review on staging URL → promote by merging `staging` → `main`.

## Branch rules (READ FIRST — staging-first, always)
When asked to build or change a feature:
1. Base your work on the `staging` branch, NOT `main`. (`git checkout staging` first, then create your feature branch from it.)
2. Open your Pull Request **against `staging`** as the base branch. NEVER open a PR against `main`.
3. Never commit directly to `staging` or `main`. Always work on a feature branch and open a PR into `staging`.
4. Promotion to production (`staging` → `main`) is done by a human only. Do not merge to `main` and do not deploy to production under any circumstances.
Reason: every change must land on staging, pass the Playwright CI gate, and be reviewed on the staging URL before a human promotes it to production.

## Golden rules (do not violate)
1. Never touch production data or the prod deploy directly. Production Supabase project `fryywsftyzruirmutgwp` and the `main` branch are off-limits except via the human-approved promotion step. Schema work happens ONLY on the staging Supabase project `qbukfqdbdybqjdjcdbon`.
2. Base-path discipline. The Vite base is env-driven via `VITE_BASE` (read by both `vite.config.ts` and `playwright.config.ts`); `index.html` uses `%BASE_URL%`. E2E must build + preview + test against ONE consistent base — mismatches cause asset 404s.
3. Never hardcode the production URL. Auth redirect uses `window.location.origin + import.meta.env.BASE_URL`.
4. The Playwright gate is the gate. All e2e tests must pass in CI before staging deploys; do not skip, weaken, or `.skip` tests to go green.
5. Promotion is human-gated. Agents PR and deploy to staging. Merging `staging` → `main` (production) happens only on explicit human approval.
6. Secrets stay in CI/vault. Never inline the GitHub PAT, `ACTIONS_DEPLOY_KEY`, or Supabase keys in code, configs, or chat.

## Skills (project know-how in /skills)
- cjm-frontend — React/Vite/TS conventions, env vars, auth redirect.
- cjm-supabase — staging-only schema/RLS rules.
- cjm-e2e — Playwright patterns (the `navigator.webdriver && ?e2e=1` bypass, `window.__e2e` hooks, base alignment).
- cjm-release — semver, the 3-job CI workflow, the promote path.

## CI shape (existing)
GitHub Actions, three jobs: `build-test` (build + verify + e2e gate + staging deploy) → `deploy-production` (main only, Actions Pages) → `smoke-test` (both envs).
