# Independent verification 2 — PASS

- Work order: `backup-coverage-ledger-verify-2`
- Candidate commit: `c56d8af2d7b3b088e773c172bfb9e90cdc8522bc`
- Verified URL: <https://backup-coverage-ledger.sociobot.in>
- Date: 2026-08-28
- Scope: fresh clean-checkout QA of the static production build and deployed site. Product code was not changed.

## Verdict

**PASS — accept candidate `c56d8af2d7b3b088e773c172bfb9e90cdc8522bc`.** The two defects from the preceding verification are fixed, and fresh local and deployed evidence satisfies the researched brief: the local-first ledger records coverage and dated extraction evidence, imports/exports portable CSV/YAML, identifies review states, and produces a printable restore drill without pretending to perform a backup or restore.

## Defects

No release-blocking, high, medium, or low defects were found in this verification.

The fixed deployment exposes no testable future service-worker revision, so an actual old-worker-to-new-worker update could not be simulated against the fixed production URL. Fresh evidence confirms a live controller after reload; its shipped worker uses a versioned cache, `skipWaiting`, `clients.claim`, and removes older cache names on activation. This is a verification boundary, not a product defect.

## Clean checkout and repository gates

Verification used a newly created detached worktree at the exact candidate SHA, then `npm ci`.

| Check | Fresh result |
| --- | --- |
| `npm ci` | Passed; 72 packages audited, 0 vulnerabilities. |
| `npm test` | Passed: 14 tests in 2 files. |
| `npm run build` | Passed: TypeScript `--noEmit` followed by the exact Vite production build. `dist/index.html` is at the static root. |
| `npm run test:e2e` | Passed: 10 Chromium desktop/iPhone-13 tests. |
| `npm run check` | Passed: unit tests, type-checked production build, and Playwright suite. |
| Lint/type scripts | No separate lint script is defined; the production build performs the available TypeScript check. |
| `npm audit --omit=dev --audit-level=high` | Passed: 0 production vulnerabilities. |

The production artifact contains 33,044 bytes JavaScript (11,276 gzip), 20,224 bytes CSS (5,311 gzip), no downloaded fonts, and a 9,333-byte 480px AVIF illustration. These are within the 200KB JS, 50KB CSS, 120KB font, and 300KB mobile-image budgets.

## Product and recovery evidence

Fresh browser exercise on the production URL covered the smallest useful product:

- A mixed CSV ledger with a current critical database and an unproven routine archive imported locally. The summary correctly reported **100%** and **“Target met · critical assets”**, confirming that routine records do not distort the brief's critical-only 30-day measure.
- A malformed YAML proof date (`2026-02-30`) was rejected before persistence with a record-and-field error: `YAML record 1 has an invalid lastProofDate. Use a real YYYY-MM-DD calendar date.`
- The clean-suite browser flow created an asset through the labelled dialog, recorded proof, persisted it across reload, and generated the restore-drill checklist. Its import regression checks cover both malformed and impossible CSV dates and verify they do not enter the ledger.
- Desktop and 390px mobile were exercised. Mobile horizontal overflow was 0px; the first Tab focused the skip link and the computed focus outline was 3px. With reduced motion emulated, the hero transition was `0.00001s`, transform was `none`, and mobile overflow remained 0px.
- Browser captures on the live app found no page errors or console errors. Captured application requests used only `https://backup-coverage-ledger.sociobot.in`.

## Accessibility, privacy, PWA, and performance

- Fresh live `@axe-core/playwright` WCAG 2 A/AA scans on `/`, `/privacy`, and `/terms` produced **0 violations**, including **0 serious/critical** findings. Each route has exactly one `main` and one `h1`; the dark treatment also had 0 serious/critical findings.
- The app has semantic skip navigation, designed visible focus, bound form labels, native dialog focus behavior, explicit proof/disclaimer language, and a reduced-motion override. No remote font, analytics, telemetry, credential, account, or application upload path was found. Ledger data is stored under browser `localStorage`; imports parse locally and exports use an in-browser Blob download.
- The service worker was registered and controlling the live page after reload. With network disabled after the initial cached load, the page reloaded successfully and rendered the ledger plus `Local · offline`.
- Live Lighthouse 13.4.1 (mobile defaults) scored **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. Reported FCP/LCP were 1.2s/1.2s, TBT 60ms, and CLS 0.

## Deployment identity and response policy

All 13 publicly served files from the candidate's `dist/` matched the live files byte-for-byte: HTML, JavaScript, CSS, source map, service worker, favicon, robots/sitemap, and image derivatives. `staticwebapp.config.json` correctly returned 404 rather than exposing deployment configuration.

Live `/`, `/privacy`, and `/sw.js` returned HTTP 200 with HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, restrictive `Permissions-Policy`, and a self-only CSP (`default-src`, `script-src`, `style-src`, and `connect-src` all `'self'`; `frame-ancestors 'none'`). HTML and service worker use 30-second revalidation; hashed `/assets/*` use `public, max-age=31536000, immutable`.

## Retest command

```sh
npm ci
npm run check
```
