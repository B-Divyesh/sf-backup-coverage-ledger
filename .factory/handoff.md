# Handoff — polish round 4

Work order: `backup-coverage-ledger-polish-4`

Role: repair

Base reviewed commit: `c173e43ea0ea77ea7c5bf50326c0376190337f44`

Repair commits: `1d5d314f93bdcf934a0c1371800b3e6b33ab9bd9`, `fd287422dde2b8836450daf11dee6dbc6f19d579`
Live product: <https://backup-coverage-ledger.sociobot.in>

## Completed

- Closed every finding from reviews 1–4 and polish rounds 1–3. The full finding-to-evidence ledger is in `.factory/polish-4.md`.
- Restored one term per concept: **asset**, **ledger**, **sample**, and **restore proof**. The first-screen note now says `Opens an isolated sample ledger.`; the workflow heading is `Record restore proof in three steps`; README now says `one shared ledger`.
- Corrected the demo explanation to match the actual samples: current, due soon, never recorded, expired, and one coverage gap.
- Strengthened all five inadequately scoped claim tests. They now cover four missing fields, import privacy, printing and print CSS, complete portable-schema boundaries/round trip, and persisted proof date/notes.
- Removed the unlisted README deployment guarantee and added a regression test that keeps deployment copy instructional.
- Updated `.factory/claims.json`, `.factory/copy-audit.md`, `.factory/demo.md`, the verb-first catalog description, build IDs, and static 404 parity.
- Deployed the built `dist/` directory through `/opt/fleet/lib/deploy-static.sh backup-coverage-ledger dist`. Azure deployment ID: `67b5a29e-0b0c-46fd-9af7-a3d03766af98`.

## Verification

Clean clone: `/tmp/bcl-polish-4-clean.J12UIJ` at `1d5d314`.

```sh
npm ci --include=dev
npm audit --omit=dev
npm run check
```

- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm run check`: 23 unit/structure tests passed; build produced `dist/`; 36 Playwright desktop/mobile/browser/accessibility tests passed.
- Every command declared in `.factory/claims.json` ran separately from that clean clone and passed: `demo-isolation`, `ledger-fields`, `missing-fields`, `proof-statuses`, `local-only`, `csv-roundtrip`, `yaml-roundtrip`, `portable-import`, `restore-drill`, `offline-reload`, `import-limit`, `portable-schema`, `privacy-runtime`, `free`, `safety-boundary`, and `merge-import`.
- Production bundle: JavaScript 42.84 kB raw / 13.74 kB gzip; CSS 24.40 kB raw / 6.07 kB gzip.
- Live `verify-url.sh`: no console errors, `lang=en`, one title/h1/main, no missing image alt text, and no unnamed buttons. See `.factory/evidence/polish-4-live/verify/verify.json`.
- Live Axe WCAG 2 A/AA: zero violations on home, demo, drill, privacy, terms, and the real 404. Live route/focus/isolation/print evidence: `.factory/evidence/polish-4-live/live-recheck.json`.
- Live crawl: intended routes/assets return 200, the deliberate missing route returns 404, and CSP/referrer/nosniff headers are present. See `.factory/evidence/polish-4-live/crawl-headers.json` and `not-found.json`.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.053 s, TBT 0 ms, CLS 0. See `.factory/evidence/polish-4-live/lighthouse.json`.
- Visual evidence: `.factory/evidence/polish-4-live/home-desktop.png`, `demo-mobile.png`, and `not-found-mobile.png`. The cold 390px first screen keeps the action and all three facts above the 844px viewport with zero horizontal overflow.

## Run and deploy

```sh
npm ci
npm run dev
npm run check
```

Build with `npm run build`; deploy `dist/` as a static Azure Static Web App. The production deployment already serves build `v1.1.3 · polish-4`.

## Known gaps and next steps

None. The product remains local-first: it documents backup coverage and restore proof, but does not run backups, access backup systems, or store credentials.
