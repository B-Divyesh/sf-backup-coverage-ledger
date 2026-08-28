# Handoff — Backup Coverage Ledger

## Adversarial first-read review 1 — FAIL (2026-08-28)

Completed work order `backup-coverage-ledger-review-1` without changing product code. The full evidence and 47 findings are in [.factory/review-1.md](review-1.md).

The review is blocked by five issues: the cold first screen does not name its audience, the sample action writes into real storage instead of an isolated demo namespace, `.factory/claims.json` and all `@claim:` tests are absent, `/#drill` has a serious Axe `aria-prohibited-attr` failure, and unknown URLs return the home page with status 200 instead of a designed 404.

Verification performed:

- Fresh Chromium contexts at 390×844 and 1440×900 against the live URL, including above-fold text and control geometry.
- Sample click, pre-seeded real-storage isolation probes against `/demo` and `?demo=1`, request logging, service-worker-controlled offline reload, console capture, route/back/focus checks, unknown-route response, and complete rendered-link crawl.
- Live WCAG 2 A/AA Axe scans on `/`, `/privacy`, `/terms`, and `/#drill`.
- Fresh clean clone at `99534befe6a3650c9b32fb9a303b7459c24f066e`: `npm ci` and `npm run check` passed (14 unit tests, build, 9 browser tests passed, 1 expected skip).
- Both earlier verification defects were rechecked live and in code: the mixed-criticality goal reports 100%, and impossible YAML proof dates are rejected before persistence.
- Complete landing/README sentence counts, heading/button review, claim inventory, metadata/routing review, and missed-leverage assessment.

Next step: repair every finding in review 1, add the isolated demo plus claim-tagged verification first, then deploy and rerun the entire adversarial checklist from scratch. No infrastructure, DNS, billing, or deployment state was changed during this review.

## Independent verification 2 — PASS (2026-08-28)

**PASS — candidate `c56d8af2d7b3b088e773c172bfb9e90cdc8522bc` is accepted.** A fresh detached clean checkout was installed and tested without product-code changes. The deployed URL <https://backup-coverage-ledger.sociobot.in> matches the candidate's 13 public `dist/` artifacts byte-for-byte; deployment configuration remains correctly non-public.

- `npm ci`, `npm test` (14 tests), `npm run build`, `npm run test:e2e` (10 desktop/mobile tests), and `npm run check` all passed. The build includes the available TypeScript check; no separate lint command exists.
- Fresh live checks passed: axe found 0 serious/critical (and 0 total) WCAG 2 A/AA violations on `/`, `/privacy`, `/terms`, and the dark treatment; 390px had 0px overflow; keyboard focus used a 3px visible outline; reduced motion removed transforms; no browser page/console errors occurred.
- Fresh product checks confirmed the repaired critical-only 30-day metric (one current critical plus an unproven routine record displays 100%), rejected an impossible YAML proof date before persistence, and validated local-only storage, offline cached reload, and first-party-only application requests.
- Live Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.2s/1.2s, TBT 60ms, CLS 0. Built JS/CSS are 33,044/20,224 bytes (11,276/5,311 gzip), with no webfonts and a 9,333-byte 480px AVIF.
- Live policy is HSTS + no-referrer + nosniff + restrictive Permissions-Policy + self-only CSP. HTML/service-worker revalidate at 30 seconds; hashed assets are immutable for one year.

No defects were found. The only test boundary is that a future service-worker revision is not available on the fixed production URL; its shipped update logic was inspected (`skipWaiting`, `clients.claim`, versioned cache cleanup) and the current worker controlled and served an offline reload. Full evidence is in [.factory/verification-2.md](verification-2.md).

## Release-blocker repair (2026-08-28)

This repair addresses both findings in the independent verification of candidate `3b67cd88cac7e262236258c0b654488b85cc0940`; the original report remains at [.factory/verification.md](verification.md).

- **P1 fixed:** the 30-day goal now calculates its numerator and denominator from `critical` records only. A mixed ledger with one current critical record and one unproven routine record now displays **100%**, as required by the researched success measure. When no critical assets are listed, the summary deliberately displays **“No critical assets listed”** rather than a misleading 0% target result.
- **P2 fixed:** portable CSV and YAML imports validate each non-empty `lastProofDate` as a real `YYYY-MM-DD` calendar date. Invalid formats and impossible dates (such as `2026-02-30`) reject the import with its row/record and field before anything is saved, so `Infinity days since proof` cannot be rendered from an imported date.

- Work order: `backup-coverage-ledger-repair-1`
- Completed: 2026-08-28
- Artifact: static Vite + TypeScript app, deployed from `dist/`

## What shipped

- A local-first asset ledger covering owner, criticality, backup target, recovery location, retention, extraction method, proof date, proof notes, and per-asset proof cadence.
- Computed states for coverage gap, never proven, proof expired, proof due soon, and proof current. The 30-day pilot measure is shown separately, is calculated from critical assets only, and is never inferred from a backup merely existing.
- Add/edit flows, explicit restore-proof recording, search and status filters, specific delete confirmation, and an immediate undo path.
- Portable CSV and flat YAML export/import with quoted-value support, row-level errors, criticality normalization warnings, 2MB input limit, and no network upload.
- A generated, printable restore-drill checklist derived from current ledger records.
- Empty, no-result, malformed-import, unavailable-storage, online/offline, light/dark, mobile, print, and reduced-motion states.
- Local persistence through browser storage and a versioned service worker shell for offline revisits.
- `/privacy` and `/terms` routes, MIT license, deployment security headers, navigation fallback, robots file, and sitemap.
- A product-specific “proof lattice” system documented in `.factory/design.md`. The original factory-generated PNG and prompt metadata are retained in `assets/src/`; responsive AVIF, WebP, and JPEG derivatives ship in `public/assets/`. The 480px AVIF is 9.3KB and WebP is 12.2KB.

## How to run and verify

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

The exact deployment command is `npm run build`; it produces `dist/index.html` and `dist/staticwebapp.config.json` at the required static root. `npm run check` runs unit tests, the production build, and Playwright Chromium desktop/mobile tests.

Verification completed locally from a clean `npm ci` install:

- `npm test`: **14/14** unit tests pass, including critical-only coverage, zero-critical state support, and malformed/impossible proof dates in both CSV and YAML.
- `npm run build`: TypeScript `--noEmit` and the Vite production build pass; `dist/index.html` is at the required static root.
- `npm run test:e2e`: Playwright 1.58.2 passes **9 tests** across desktop and iPhone 13 / 390px projects (one intentional desktop-only mobile assertion is skipped). It includes browser regressions for the mixed-criticality 100% goal, the no-critical state, and rejected invalid CSV dates before persistence.
- `npm run check`: passes the complete unit → production build → desktop/mobile browser gate.
- Keyboard: the existing add/proof dialog flow, Escape/focus return, and first-tab skip link remain covered; 390px horizontal overflow is ≤1px.
- Axe via Playwright: no serious or critical WCAG 2 A/AA violations across `/`, `/privacy`, and `/terms`, including the dark treatment.
- `npm audit --omit=dev --audit-level=high`: zero known production vulnerabilities.
- Build budget: 33.04KB JavaScript (11.36KB gzip) and 20.22KB CSS (5.28KB gzip), no downloaded fonts, and a 9.3KB mobile AVIF hero—within the 200KB / 50KB / 120KB / 300KB budgets.
- Production-preview response checks confirm `/`, `/privacy`, and `/sw.js` resolve from `dist/`; the deployed response policy retains its strict CSP, HSTS, `no-referrer`, `nosniff`, and restrictive Permissions-Policy. The application has no remote application calls, analytics, remote fonts, or upload path; records/imports remain in browser storage.
- A production-preview Chromium smoke test imported the P1 mixed ledger (100% critical-only result), rejected the P2 impossible CSV date before persistence, activated the service worker, then reloaded with the network disabled and rendered `Local · offline` at 390px.
- Lighthouse 12.8.2 was rerun against the production preview but Chrome’s audit target crashed before a report was written (the independent verifier recorded the same post-audit target-crash behavior). This is an environment limitation; the passing browser/a11y checks and measured asset budgets above remain the release evidence.

## Deployment evidence

- Repair commit `8ad6a3d2a342f746edf8663dd86abba440b7e67d` was pushed to `origin/main` and its already-verified `dist/` was deployed to the Azure Static Web App `sf-backup-coverage-ledger` production environment.
- Live <https://backup-coverage-ledger.sociobot.in> returned HTTP 200 after deployment. SHA-256 matched the deployed `index.html`, `assets/index-DFfLbc4t.js`, `assets/index-CrGsKeVQ.css`, and `sw.js` to the local production build.
- Live headers preserve HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, restrictive `Permissions-Policy`, and the self-only CSP. The working tree is clean after deployment; the CLI-generated local credential file was removed.

## Known gaps and honest boundaries

- The product does not execute, inspect, or cryptographically attest backups. Proof is human-entered evidence after a real extraction.
- Data is isolated to one browser origin. Teams share by exporting files; v1 has no realtime collaboration or merge/conflict UI.
- YAML import intentionally supports the app’s safe flat export format, not arbitrary YAML features such as aliases, nested objects, or block scalars. CSV handles quoted commas, quotes, and line breaks.
- Lighthouse was measured against a local production preview; deployment latency and edge caching will affect live measurements.

## Suggested next steps

1. Pilot with 10 small teams and measure the brief’s 90% owner/location/30-day-proof target.
2. Add optional signed proof attachments only if the pilot needs stronger audit evidence; keep them local or user-controlled.
3. Add merge-by-record-ID for independently edited shared files if teams report frequent coordination conflicts.
