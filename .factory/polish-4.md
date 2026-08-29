# Polish round 4 finding ledger

Reviewed candidate: `c173e43ea0ea77ea7c5bf50326c0376190337f44`  
Repair commits: `1d5d314f93bdcf934a0c1371800b3e6b33ab9bd9`, `fd287422dde2b8836450daf11dee6dbc6f19d579`  
Runtime build deployed: `v1.1.3 · polish-4` at <https://backup-coverage-ledger.sociobot.in>

## Evidence key

- **Clean clone:** `/tmp/bcl-polish-4-clean.J12UIJ`, commit `1d5d314`; `npm ci --include=dev`, `npm audit --omit=dev`, `npm run check`, and all 16 manifest commands completed with exit 0.
- **Local:** `.factory/evidence/polish-4-local/`; `verify/verify.json` has no console errors and one `h1`/`main`; `lighthouse.json` is 100/100/100/100.
- **Live:** `.factory/evidence/polish-4-live/live-recheck.json` records cold 390px/1440px, isolation, print, route, focus, and live Axe checks. `verify/verify.json`, `crawl-headers.json`, `lighthouse.json`, `not-found.json`, and the adjacent screenshots are the live artifacts.
- Every live URL below was opened in a fresh browser context after the static deployment completed. The six-route live Axe matrix returned no WCAG 2 A/AA violations.

| Finding | Change made or confirmation | Evidence and live check |
| --- | --- | --- |
| F-1-1 | Kept the above-fold job, audience, sample action, result note, and facts; renamed the note to the consistent **sample ledger**. | Mobile bounds and screenshot `polish-4-live/demo-mobile.png`; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-2 | Kept `?demo=1`, five realistic assets, a persistent banner, reset, discard, and separate `demo:` key. | `@claim:demo-isolation`; live isolation in `live-recheck.json`; [demo](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-3 | Retained the 16-entry claims manifest and one-tag-per-claim structure; expanded the five under-scoped tagged tests below. | `structure.test.ts`; all 16 clean-clone commands |
| F-1-4 | Kept semantic drill controls and expanded Axe coverage through every route/state. | `app.spec.ts` live Axe matrix; [drill](https://backup-coverage-ledger.sociobot.in/drill?demo=1) |
| F-1-5 | Kept the SWA 404 override and product-specific static 404. | `not-found.json`; [404 probe](https://backup-coverage-ledger.sociobot.in/polish-4-missing) returns 404 |
| F-1-6 | Kept History API focus and polite route announcement after navigation and Back. | Live `focus` result in `live-recheck.json`; [Privacy](https://backup-coverage-ledger.sociobot.in/privacy) |
| F-1-7 | Kept route-specific titles, descriptions, canonicals, OG/Twitter data, favicon, touch icon, and social preview. | `app.spec.ts` route metadata test; live route table |
| F-1-8 | Kept the complete landing order and parity between app/static-404 chrome. | `structure.test.ts` static chrome parity; `not-found-mobile.png` |
| F-1-9 | Kept one clean home h1 with normal word spacing. | `app.spec.ts` route/Axe coverage; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-10 | Kept stable-ID compare, add/update/skip/conflict/replace, repeat safety, and undo. | `@claim:merge-import`; [demo](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-11 | Expanded proof-field persistence assertion so it now proves dated proof and notes as well as the other fields. | `@claim:ledger-fields`; [demo](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-12 | Kept explicit no-backup/no-credential boundary and exercised it in UI flows. | `@claim:safety-boundary`; [terms](https://backup-coverage-ledger.sociobot.in/terms) |
| F-1-13 | Expanded missing-field coverage to four otherwise-valid imports, one per required field. | `@claim:missing-fields`; [demo](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-14 | Kept current, due-soon, never-proven, expired, and coverage-gap states. | `@claim:proof-statuses`; live demo screenshot |
| F-1-15 | Expanded local-only flow to import as well as edit, export, reload, storage, and request checks. | `@claim:local-only`; live same-origin result |
| F-1-16 | Kept CSV/flat-YAML import and nested-YAML rejection. | `@claim:portable-import`; [demo](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-17 | Kept specific local/export/offline claim wording. | claims manifest and all clean-clone claim commands |
| F-1-18 | Kept concrete first-screen price/storage language. | copy audit; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-19 | Kept a direct README opening and exact sample-data action. | `README.md`; `structure.test.ts` |
| F-1-20 | Kept complete, terminology-consistent asset fields. | `@claim:ledger-fields`; README |
| F-1-21 | Kept the explicit restore/credentials limitation. | `@claim:safety-boundary`; [terms](https://backup-coverage-ledger.sociobot.in/terms) |
| F-1-22 | Kept exact UI status names and aligned demo explanation to them. | `@claim:proof-statuses`; `live-recheck.json` |
| F-1-23 | Kept browser-only storage and same-origin requests. | `@claim:local-only`; live header/request evidence |
| F-1-24 | Kept CSV/YAML stable-ID round trips without duplicates. | `@claim:csv-roundtrip`, `@claim:yaml-roundtrip` |
| F-1-25 | Expanded printable drill coverage to call `window.print`, inspect print CSS, and retain five checklists. | `@claim:restore-drill`; live `print` result |
| F-1-26 | Kept populated demo offline reload after service-worker install. | `@claim:offline-reload` in the clean clone |
| F-1-27 | Kept keyboard, 390px, theme, reduced-motion, and Axe coverage. | `app.spec.ts`; live mobile overflow 0 and Axe matrix |
| F-1-28 | Kept exact demo/real namespace and request isolation. | `@claim:demo-isolation`, `@claim:local-only`; live isolation |
| F-1-29 | Expanded portable-schema coverage to test all enum values, valid interval boundaries, invalid boundaries/date, and ID reimport. | `@claim:portable-schema` |
| F-1-30 | Kept exact 2,000,000-byte accept / 2,000,001-byte reject behavior. | `@claim:import-limit` |
| F-1-31 | Kept no-analytics/no-ads/no-remote-fonts/no-accounts/no-third-party runtime check. | `@claim:privacy-runtime`; live same-origin requests |
| F-1-32 | Kept the plain restore-proof artwork caption. | `home-desktop.png`; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-33 | Kept the concrete `Asset ledger` heading. | `home-desktop.png` |
| F-1-34 | Kept self-contained coverage summary labels. | `app.spec.ts` critical-goal test; live demo |
| F-1-35 | Kept result-naming controls, including `Replace ledger` and `Record restore proof`. | `@claim:merge-import`; live demo |
| F-1-36 | Closed the reopened terminology regression: `Record restore proof`, `sample ledger`, and `shared ledger` now replace alternate concepts. | `structure.test.ts` terminology regression; copy audit; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-37 | Kept the short README opening. | README; copy audit |
| F-1-38 | Kept the named small-IT audience on the first screen. | live mobile bounds; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-39 | Kept concise artwork provenance. | `.factory/design.md`; footer in live screenshot |
| F-1-40 | Kept concrete browser-storage and free language. | copy audit; [home](https://backup-coverage-ledger.sociobot.in/) |
| F-1-41 | Kept direct shared-file comparison wording. | `@claim:merge-import` |
| F-1-42 | Kept separate plain offline and proof-interval language. | `@claim:offline-reload`, `@claim:portable-schema` |
| F-1-43 | Kept export/edit/import instructions. | README; CSV/YAML round-trip claims |
| F-1-44 | Kept narrow flat-YAML support and rejection of nested YAML. | `@claim:portable-import`; README |
| F-1-45 | Kept an actionable `No backup records yet` empty state. | `app.spec.ts` asset-creation flow; `home-desktop.png` |
| F-1-46 | Kept a real `/drill` route with metadata, history, and focus. | `@claim:restore-drill`; [drill](https://backup-coverage-ledger.sociobot.in/drill?demo=1) |
| F-1-47 | Kept the explicitly labelled external source link in app and static 404 footers. | `structure.test.ts`; `not-found.json` |
| F-2-1 | Kept exercised free and safety behavior tests instead of copy-only checks. | `@claim:free`, `@claim:safety-boundary` |
| F-2-2 | Kept accounts, subscriptions, and advertising in manifest/runtime checks. | `@claim:free`, `@claim:privacy-runtime` |
| F-2-3 | Kept `Replace ledger` for the destructive import branch. | `@claim:merge-import` |
| F-2-4 | Kept `asset` and `Try it with sample data` in README/product copy. | README; `structure.test.ts` |
| P1 | Kept critical-only 30-day coverage and the no-critical state. | `app.spec.ts` critical-goal test |
| P2 | Kept rejection of malformed and impossible portable dates. | `portable.test.ts`; `app.spec.ts`; `@claim:portable-schema` |
| F-4-1 | Replaced the two-field DNS-only assertion with four imports that visibly name owner, backup target, recovery location, and restore-step gaps. | `@claim:missing-fields` from clean clone |
| F-4-2 | Made the privacy request log import a CSV, merge it, and assert its value stays only in demo storage. | `@claim:local-only` from clean clone |
| F-4-3 | Made the drill claim invoke the button, stub/observe `window.print`, emulate print, verify hidden chrome and five non-overflowing checklists. | `@claim:restore-drill`; live `print` check |
| F-4-4 | Made the portable-schema claim import/export/reimport stable IDs, all criticalities, ISO dates, intervals 1/3650, and reject 0/3651/impossible dates. | `@claim:portable-schema` from clean clone |
| F-4-5 | Made the ledger-fields claim assert `lastProofDate` and `proofNotes` in storage and the edit sheet after reload. | `@claim:ledger-fields` from clean clone |
| F-4-6 | Corrected the demo explanation to distinguish four proof conditions from one coverage gap. | `app.spec.ts` sample-state test; live `demoIntro` result |
| F-4-7 | Removed the unlisted deployment guarantee and added a regression check that deployment text remains an instruction only. | `structure.test.ts` deployment-copy test; README |

## Outcome

All prior and round-4 findings are closed. The catalog description is verb-first and 62 characters:

> Track backup coverage and restore proof in one browser ledger.
