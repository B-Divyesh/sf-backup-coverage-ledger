# Handoff — polish round 3

Work order: `backup-coverage-ledger-polish-3`
Role: repair
Base reviewed: `07694187b7c7e316d3f18b20788c4c8c767012b4`
Repair commit: `807d83ecfd6bc7e6afefb85a3764580bfc8cde1f`
Live product: <https://backup-coverage-ledger.sociobot.in/?demo=1>

## Completed work

- Fixed the sole unresolved round-3 blocker, `F-1-36`, at its source. The empty-state instruction now says **asset**, and the add/edit field is labelled **Asset**. The former alternative `data set` is gone from visitor-facing product UI.
- Added a Playwright regression that starts from an empty ledger, verifies the revised sentence, opens the dialog, and verifies the `Asset` label with no `data set` fallback.
- Kept and revalidated every earlier review fix: first-screen wording and mobile action placement; one-click isolated `?demo=1` demo with reset/discard; claims manifest and observable claim tests; stable-ID merge/import; titles, metadata, legal links, real routes, focus announcements, static 404; accessibility; offline; local-first privacy; and the proof-lattice visual system.
- Bumped the displayed build identity to `v1.1.2 · polish-3` on both the application and static 404 pages.
- Updated `.factory/catalog-description.txt` to the verb-first 91-character sentence: `Track backup coverage, owners, recovery locations, and restore tests in one browser ledger.`
- Recorded every historical finding, its retained or new fix, exact test evidence, screenshot paths, and live result in `.factory/polish-3.md`.

## Verification

```sh
npm ci --include=dev
npm test
npm run build
npm audit --omit=dev --audit-level=high
npm run test:e2e
```

The repair commit was tested from detached clean clone `/tmp/bcl-polish-3-clean.w36fQM`.

- `npm test`: **21 passed**.
- `npm run build`: passed; `dist/` has root `index.html`. Initial JS is **42.80 kB raw / 13.73 kB gzip**; CSS is **24.40 kB raw / 6.07 kB gzip**.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**.
- `npm run test:e2e`: **34 passed**, including Axe WCAG 2 A/AA scans for demo, drill, privacy, terms, 404, mobile, dialog, dark treatment, keyboard focus, mobile overflow, route focus/history, import validation, privacy, and service-worker offline reload.
- Every one of the 16 commands declared by `.factory/claims.json` was also run separately from that clean clone and passed: `demo-isolation`, `ledger-fields`, `missing-fields`, `proof-statuses`, `local-only`, `csv-roundtrip`, `yaml-roundtrip`, `portable-import`, `restore-drill`, `offline-reload`, `import-limit`, `portable-schema`, `privacy-runtime`, `free`, `safety-boundary`, and `merge-import`.

## Deployment and cold production check

Published the work-order static artifact to Azure Static Web App `sf-backup-coverage-ledger` (production). Both the custom domain and <https://zealous-ground-017370c0f.7.azurestaticapps.net/> serve `assets/index-SeSxfn-G.js`.

- `/opt/fleet/lib/verify-url.sh https://backup-coverage-ledger.sociobot.in/?demo=1 .factory/evidence/polish-3-live` passed: HTTP 200; title `Demo — Backup Coverage Ledger`; `lang=en`; exactly one h1 and main; no missing image alt text; no unlabeled buttons; no console/page errors.
- Fresh-context live Axe scans reported **0 violations** on `/?demo=1`, `/drill?demo=1`, `/privacy?demo=1`, `/terms?demo=1`, and a real HTTP-404 unknown route. The browser records the normal HTTP-404 network console message for the deliberate missing-page request; no application error occurred.
- Live terminology check passed: empty state has no `data set`, dialog has exactly one `Asset` label, and no `data set` label.
- Live demo check passed: banner, five records, Reset demo, and Start for real are present. A pre-seeded real ledger remained untouched through edit/reset; leaving demo discarded the demo key and showed the real ledger.
- Live privacy check saw first-party requests only on each route.
- Live service-worker check passed: a populated demo reloaded offline with the `Local · offline` indicator.
- Live mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; LCP **1.1 s**, CLS **0**, TBT **30 ms**.

Evidence: `.factory/evidence/polish-3-live/verify.json`, `live-recheck.json`, `demo-isolation-recheck.json`, `offline-recheck.json`, `lighthouse.json`, `demo-mobile-viewport.png`, and `asset-form-mobile.png`. Local visual evidence is in `.factory/evidence/polish-3-local/`.

## Run and deploy

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

Use `/?demo=1` for the isolated sample ledger. `npm run build` creates the deployable `dist/` directory.

## Known gaps

None. All current and historical review findings, including minor items, are closed and rechecked in the deployed product.
