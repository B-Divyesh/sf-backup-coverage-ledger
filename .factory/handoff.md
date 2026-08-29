# Handoff — Backup Coverage Ledger polish round 1

Work order: `backup-coverage-ledger-polish-1`

Artifact: static Vite + TypeScript site (`dist/`)

Review source: `.factory/review-1.md`
Repair commits: `7ac7c3c`, `1a6d6b4`, and `0aedffd`

## What changed

- Rewrote the first screen around the job and audience, with a phone-visible “Try it with sample data” action and three tested facts.
- Added an isolated `?demo=1` ledger with five realistic proof states, a persistent banner, reset, and discard-to-real behavior. Demo records use only `demo:backup-coverage-ledger:v1`; real records use `backup-coverage-ledger:v1`.
- Added `.factory/claims.json` with 16 observable claims and exactly one `@claim:<id>` Playwright test for each claim.
- Added stable-ID import comparison for additions, updates, unchanged records, and conflicts. Users choose conflict outcomes, can replace the ledger, and can undo imports.
- Added real history routes, route-specific title/metadata/canonical values, heading focus and live announcement, consistent chrome, `/drill`, `/privacy`, `/terms`, and a designed true 404 response.
- Rewrote landing, interface, legal, metadata, and README copy in plain words. `.factory/copy-audit.md` records sentence counts and terminology.
- Preserved the proof-lattice visual identity while improving the 390 px composition, touch targets, dialog semantics, and mobile record visibility.
- Added a resilient versioned offline shell and original 1200×630 social image plus touch icon.

Every review ID is mapped to its change and evidence in `.factory/polish-1.md`.

## Run and verify

```sh
npm ci
npm run check
npm run test:claims
npm run build
```

The built site is in `dist/`. Preview it with `npm run preview -- --host 127.0.0.1`.

## Local evidence

- `npm run check`: 20 unit/structure tests passed, TypeScript and Vite build passed, 31 Chromium desktop/mobile browser checks passed, and 1 expected project skip remained.
- Every one of the 16 commands listed in `.factory/claims.json` passed individually from a detached clean checkout.
- The browser Axe matrix covered `/`, `/?demo=1`, `/drill?demo=1`, `/privacy`, `/terms`, the unknown route, an open dialog, and dark mode: zero violations.
- `/opt/fleet/lib/verify-url.sh`: title, `lang`, one `h1`, `main`, alt text, button labels, and console checks passed. Evidence is in `.factory/evidence/verify-local/`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 0. Report: `.factory/evidence/lighthouse-home.json`.
- Build size: JavaScript 42.76 KB (13.73 KB gzip); CSS 24.40 KB (6.07 KB gzip). There are no webfonts or third-party runtime scripts.
- `npm audit --audit-level=high`: zero vulnerabilities.

## Deployment and cold live verification

- Final deployed commit: `0aedffd` at <https://backup-coverage-ledger.sociobot.in>.
- Known routes `/`, `/?demo=1`, `/drill`, `/privacy`, and `/terms` return HTTP 200. `/definitely-not-a-real-page` returns the designed 404 page with HTTP 404.
- Route-specific browser titles, canonical URLs, heading focus, live announcements, and back navigation passed in a cold context.
- At 390×844, the first-screen action ends at 512 px, the first sample record begins at 674 px, and horizontal overflow is 0 px. Live screenshots are in `.factory/evidence/live-home-mobile.png`, `.factory/evidence/live-demo-mobile.png`, and `.factory/evidence/live-404.png`.
- A live isolation probe pre-seeded the real key, edited and reset the demo, then left demo mode. Real data remained untouched and the demo key was discarded.
- Live Axe WCAG 2 A/AA checks report zero violations across every route, the open edit dialog, dark mode, and the 404 page.
- Known live pages produced zero console, page, or failed-request errors. Every observed application request was same-origin.
- A populated demo reloaded offline under service-worker control.
- The live URL verifier reports no errors, one `h1`, one `main`, and no missing alt text or button names. Evidence is in `.factory/evidence/verify-live/`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 40 ms, CLS 0. Report: `.factory/evidence/lighthouse-live.json`.
- SHA-256 matches production for `index.html`, `assets/index-DgzB0cg7.js`, `assets/index-CxiHi_fd.css`, and `sw.js`.

## Known boundaries

- The ledger records human-entered restore evidence. It does not execute backups, access backup systems, store credentials, or cryptographically attest a restore.
- Data belongs to one browser origin. Teams exchange files rather than synchronize through a server.
- YAML import accepts the app’s flat exported format, not nested YAML, aliases, or block scalars.

No review finding is deferred. No AI feature was added because the record, compare, and restore-drill jobs are deterministic and work fully offline without one.
