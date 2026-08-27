# Handoff — Backup Coverage Ledger v1

- Work order: `backup-coverage-ledger-build-1`
- Completed: 2026-08-27
- Artifact: static Vite + TypeScript app, deployed from `dist/`

## What shipped

- A local-first asset ledger covering owner, criticality, backup target, recovery location, retention, extraction method, proof date, proof notes, and per-asset proof cadence.
- Computed states for coverage gap, never proven, proof expired, proof due soon, and proof current. The 30-day pilot measure is shown separately and never inferred from a backup merely existing.
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

Verification completed locally:

- `npm test`: 10/10 unit tests pass (status/expiry/goal rules and CSV/YAML parsing/round trips).
- Playwright 1.58.2: desktop and mobile end-to-end add → persist → proof → drill workflow passes; 390px overflow and keyboard skip-link checks pass.
- Axe via Playwright: no serious or critical WCAG 2 A/AA violations across `/`, `/privacy`, and `/terms`, including the dark treatment.
- Factory `verify-url.sh`: HTTP 200; title, `lang`, single `h1`, `main`, alt text, and labeled button checks pass; zero page/console errors.
- `npm audit`: zero known vulnerabilities.
- Build budget: 32.42KB JavaScript and 20.20KB CSS uncompressed; no downloaded fonts; 9.3KB mobile AVIF hero. All are below the 200KB / 50KB / 120KB / 300KB budgets.
- Lighthouse 12.8.2 mobile on the local production preview: Performance 99, Accessibility 100, Best Practices 100, SEO 92; FCP 1.0s, LCP 1.4s, total blocking time 140ms, CLS 0. The lab run does not emit INP; total blocking time is below the 200ms interaction proxy budget.
- Offline smoke test: after service-worker activation, Chromium reloaded the product with the network disabled and rendered the ledger shell with `Local · offline` status.

## Known gaps and honest boundaries

- The product does not execute, inspect, or cryptographically attest backups. Proof is human-entered evidence after a real extraction.
- Data is isolated to one browser origin. Teams share by exporting files; v1 has no realtime collaboration or merge/conflict UI.
- YAML import intentionally supports the app’s safe flat export format, not arbitrary YAML features such as aliases, nested objects, or block scalars. CSV handles quoted commas, quotes, and line breaks.
- Lighthouse was measured against a local production preview; deployment latency and edge caching will affect live measurements.

## Suggested next steps

1. Pilot with 10 small teams and measure the brief’s 90% owner/location/30-day-proof target.
2. Add optional signed proof attachments only if the pilot needs stronger audit evidence; keep them local or user-controlled.
3. Add merge-by-record-ID for independently edited shared files if teams report frequent coordination conflicts.
