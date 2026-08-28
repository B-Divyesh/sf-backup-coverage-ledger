# Independent verification — FAIL

- Work order: `backup-coverage-ledger-verify-1`
- Verified candidate: `3b67cd88cac7e262236258c0b654488b85cc0940`
- Verified URL: <https://backup-coverage-ledger.sociobot.in>
- Date: 2026-08-28
- Scope: clean-install independent QA of the static production build and the live deployment. Product code was not changed.

## Verdict

**FAIL — do not accept this candidate.** The app is otherwise substantially functional, but its displayed 30-day pilot target calculates the wrong population. The researched acceptance contract says this target is the percentage of **critical** assets with owner, recovery location, and a restore proof within 30 days. The candidate instead uses every asset, including routine and important items, as both numerator and denominator. That can report a team as missing its critical-asset target even when every critical asset meets it, and is therefore acceptance-blocking for the product's stated job.

## Defects

### P1 — acceptance-blocking correctness: the “30-day goal” is not restricted to critical assets

- Contract: the researched brief's success measure is “90% of listed **critical assets** have an owner, recovery location, and a recorded restore proof within 30 days.”
- Evidence: `successCoverage` filters only for owner/location/date and divides by `records.length`; it does not check `record.criticality` ([src/ledger.ts](../src/ledger.ts#L76-L81)). The UI labels this value `30-day goal`.
- Reproduction on the production build: import two complete records: one `critical` with a proof dated yesterday, and one `routine` with no proof. The summary displays `30-day goal 50% / Target: 90%`; the contractually correct critical-only result is 100%.
- Impact: routine or important inventory changes the reported pilot outcome and can drive a false remediation decision.
- Required fix: calculate both the numerator and denominator from critical records only (and define/display the no-critical-assets state explicitly), then add a regression test and browser assertion.

### P2 — invalid portable proof dates are imported as data and rendered as “Infinity days since proof”

- Contract/docs: portable dates use `YYYY-MM-DD`; import validation is a required recovery path.
- Evidence: CSV and YAML import pass `lastProofDate` directly to `createRecord` without validating it ([src/portable.ts](../src/portable.ts#L47-L60), [src/portable.ts](../src/portable.ts#L97-L105)). `daysSince` deliberately returns infinity for an invalid value, which the record UI formats as a day count.
- Reproduction on the production build: import a CSV row with all required fields, `lastProofDate=not-a-date`, and proof notes. The app announces `Imported 1 record.`, persists the invalid string, marks the record `Proof expired`, and displays `Infinity days since proof` instead of identifying the row/field and allowing recovery.
- Impact: malformed shared files produce misleading coverage data and an operator-facing impossible value.
- Required fix: validate non-empty imported dates as real ISO calendar dates and reject the file/row with a row-and-field error (or normalize it to an explicit missing-proof state with a warning); cover CSV and YAML.

## Quality gates and functional evidence

All commands were run from a clean checkout at the tested commit after `npm ci`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 72 packages audited, 0 vulnerabilities. |
| `npm test` | Passed: 2 files, 10 tests. |
| `npm run build` | Passed: TypeScript `--noEmit` and Vite production build. |
| `npm run test:e2e` | Passed: 5 Chromium tests passed, 1 desktop-only mobile test skipped as designed. |
| `npm run check` | Passed the repository's combined unit, build, and Playwright gate. |
| `npm audit --omit=dev --audit-level=high` | Passed: 0 vulnerabilities. |
| Exact production build | `dist/` produced successfully with `index.html` at its root. |

Independent end-to-end checks against the built preview exercised:

- Empty state; keyboard Tab/Enter opened Add asset, native dialog focus began at Asset, Escape closed it and returned focus to the invoking button.
- Invalid required form submission (five invalid required fields), then valid record creation with boundary proof cadence `1`.
- Invalid proof submission without evidence notes, followed by valid proof recording.
- CSV export header and download; delete confirmation and immediate Undo; local-storage persistence after reload; printable Restore drill generation.
- Invalid CSV missing `backupTarget` produced a user-facing error and recovery; a 2,000,001-byte file produced the stated 2 MB limit error.
- Invalid imported date case above exposed P2.

No page errors or console errors occurred in the representative normal, invalid, recovery, offline, desktop, or 390px mobile flows.

## Accessibility, responsive, and performance evidence

- Independent Axe (`wcag2a`, `wcag2aa`) checks on `/`, `/privacy`, and `/terms` found **0 serious or critical** violations on both the local production build and the live deployment.
- Each checked route has one `h1` and one `main`; HTML language/title and image alternative text are present.
- At 390px wide, horizontal overflow was 0px. Keyboard focus visibly rendered as a 3px cobalt outline; the skip link focused first. The reduced-motion media query removed the hero transform. Desktop keyboard use and dialog return focus also passed.
- Local production mobile Lighthouse 12.8.2: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.8s, LCP 2.3s, TBT 0ms, CLS 0. Lighthouse emitted a post-audit Chrome target-crash warning while collecting the full-page screenshot, but wrote these completed audit results; the Playwright/browser checks above had no errors.
- Built budgets: JS 32,416 bytes (11,130 gzip), CSS 20,224 bytes (5,280 gzip); no webfonts. Mobile AVIF is 9,333 bytes and mobile WebP 12,150 bytes. These are within the stated budgets.

## Privacy, network, offline, and deployment evidence

- Browser request capture on local preview and live deployment observed only the respective first-party origin. Source inspection found no analytics, remote scripts, remote fonts, or application data upload; ledger data uses browser `localStorage` and imports/exports stay local.
- Live `/` response: HTTP 200 with `Strict-Transport-Security`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, restrictive `Permissions-Policy`, and CSP limiting default/script/style/connect to `'self'`, images to `'self' data:`, and framing to none. Hashed JS/CSS have `public, max-age=31536000, immutable`; HTML uses 30-second revalidation.
- Service worker installed and controlled after reload (`bcl-shell-v1`); with the network disabled, both local preview and live deployment reloaded and rendered the shell and `Local · offline` indicator without errors. The worker has standard `skipWaiting`/`clients.claim` update behavior; a real future deployed worker revision was not available to test end-to-end.
- Deployment identity: SHA-256 comparisons matched every publicly served `dist/` artifact (HTML, JS, CSS, service worker, favicon, robots/sitemap, and image derivatives) to the live URL. `staticwebapp.config.json` correctly returns deployment-host 404 rather than being public.

## Retest criteria

1. Correct the metric population and add unit/e2e coverage for mixed criticality and the zero-critical-assets state.
2. Validate imported non-empty proof dates for CSV and YAML; add regression coverage for malformed and impossible dates.
3. Rebuild, deploy, and rerun the P1/P2 reproductions plus `npm run check` before changing the verdict.
