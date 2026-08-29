# Polish round 2 finding ledger

Reviewed candidate: `14417f2a179edbd0f1f9ea14f657eec599f3de46`  
Repair commits: `2c3d656b6dc281cb4624ae9e62470865204502e4`, `c4d30c83c1d54535760e026bcc74def5c6a016bb`

Local evidence for this repair is a fresh clone at `/tmp/bcl-polish-2-final2-clean.*`: all 16 manifest commands passed separately, followed by `npm run check` (21 unit/structure tests, production build, 32 Playwright checks). The production-style browser verifier passed at `.factory/evidence/polish-2-local-final/verify.json`; its current desktop and 390px captures are `screenshot-desktop.png` and `screenshot-mobile.png` in that directory.

| Finding | Change made | Evidence | Live URL check |
|---|---|---|---|
| F-1-1 | Named small IT teams, put the sample action and result above the fold, and retained the three plain facts. | `tests/e2e/app.spec.ts` mobile test; `polish-2-local-final/screenshot-mobile.png` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-2 | Kept the isolated five-record `?demo=1` ledger, persistent banner, reset, and discard-to-real actions. | `@claim:demo-isolation` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-3 | Kept the manifest/test bijection and ran every declared command separately from the fresh clone. | `tests/structure.test.ts`; all 16 manifest commands | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-4 | Retained native drill controls and the route/dialog Axe matrix. | `tests/e2e/app.spec.ts` Axe matrix | https://backup-coverage-ledger.sociobot.in/drill?demo=1 |
| F-1-5 | Retained the SWA response override and designed 404. | `tests/structure.test.ts` 404 test | https://backup-coverage-ledger.sociobot.in/polish-2-missing |
| F-1-6 | Retained route focus and polite announcement on navigation and Back. | route navigation Playwright test | https://backup-coverage-ledger.sociobot.in/privacy |
| F-1-7 | Retained per-route titles, metadata, canonical URLs, preview, and icons. | route metadata Playwright test | https://backup-coverage-ledger.sociobot.in/ |
| F-1-8 | Made static 404 match the application’s four-link primary nav and complete footer; bumped both build IDs. | `static 404 chrome` structure test | https://backup-coverage-ledger.sociobot.in/polish-2-missing |
| F-1-9 | Retained one clean page h1 per route. | route/Axe matrix; verifier JSON | https://backup-coverage-ledger.sociobot.in/ |
| F-1-10 | Retained stable-ID comparison, conflict choice, replace, and undo. | `@claim:merge-import` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-11 | Retained all promised asset fields and demo persistence. | `@claim:ledger-fields` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-12 | Strengthened the boundary test to exercise flows and inspect credential controls and requests. | `@claim:safety-boundary` | https://backup-coverage-ledger.sociobot.in/terms |
| F-1-13 | Retained named missing-field states. | `@claim:missing-fields` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-14 | Retained all calculated proof states. | `@claim:proof-statuses` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-15 | Retained demo-only storage and same-origin edit/export/reload checks. | `@claim:local-only` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-16 | Retained CSV/YAML imports and invalid nested-YAML handling. | `@claim:portable-import` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-17 | Retained outcome-specific export/storage metadata. | `@claim:local-only`, CSV/YAML round trips | https://backup-coverage-ledger.sociobot.in/ |
| F-1-18 | Retained concrete tested price/storage facts and removed provider jargon. | copy audit; `@claim:free` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-19 | README now opens with the product job and exact demo action. | README; copy audit | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-20 | Retained the complete field list and field test. | `@claim:ledger-fields` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-21 | Retained explicit restore/credential limitation and tested behavior. | `@claim:safety-boundary` | https://backup-coverage-ledger.sociobot.in/terms |
| F-1-22 | Retained exact named coverage/proof states. | `@claim:proof-statuses` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-23 | Retained precise browser-storage/request behavior. | `@claim:local-only` | https://backup-coverage-ledger.sociobot.in/privacy |
| F-1-24 | Retained separate CSV and YAML round trips. | `@claim:csv-roundtrip`, `@claim:yaml-roundtrip` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-25 | Retained the printable, asset-specific `/drill` output. | `@claim:restore-drill` | https://backup-coverage-ledger.sociobot.in/drill?demo=1 |
| F-1-26 | Retained populated demo reload under offline service-worker control. | `@claim:offline-reload` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-27 | Retained keyboard, 390px, reduced-motion, theme, and Axe coverage as behavior tests. | `tests/e2e/app.spec.ts` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-28 | Retained exact demo/real namespace and request isolation. | `@claim:demo-isolation`, `@claim:local-only` | https://backup-coverage-ledger.sociobot.in/privacy |
| F-1-29 | Retained IDs, enum, ISO-date, and interval validation. | `@claim:portable-schema` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-30 | Retained exact two-megabyte boundary behavior. | `@claim:import-limit` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-31 | Expanded the privacy claim to name advertising and accounts; runtime test now checks both. | `@claim:privacy-runtime` | https://backup-coverage-ledger.sociobot.in/privacy |
| F-1-32 | Retained the direct proof-lattice caption. | `.factory/copy-audit.md` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-33 | Retained the concrete Asset ledger heading. | `.factory/copy-audit.md` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-34 | Retained self-explanatory summary labels. | critical-goal Playwright test | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-35 | Retained verb/result control labels; added an explicit asset name to restore-proof control. | verifier JSON has `buttonsUnlabeled: 0` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-36 | Retained the terminology table; README now uses `asset`. | README; copy audit | https://backup-coverage-ledger.sociobot.in/ |
| F-1-37 | Retained short README opening. | README; copy audit | https://backup-coverage-ledger.sociobot.in/ |
| F-1-38 | Retained named audience on the first screen. | mobile Playwright test | https://backup-coverage-ledger.sociobot.in/ |
| F-1-39 | Retained concise provenance and product copy. | `.factory/design.md`; copy audit | https://backup-coverage-ledger.sociobot.in/ |
| F-1-40 | Retained plain language instead of provider/storage jargon. | `.factory/copy-audit.md` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-41 | Retained concrete shared-file compare wording. | `@claim:merge-import` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-42 | Retained plain offline and proof-interval wording. | `@claim:offline-reload`, `@claim:portable-schema` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-43 | Retained concrete export/share/import instructions. | README; `@claim:merge-import` | https://backup-coverage-ledger.sociobot.in/ |
| F-1-44 | Retained narrow flat-YAML support and rejection. | `@claim:portable-import` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-1-45 | Retained a section-naming empty state. | asset creation Playwright test | https://backup-coverage-ledger.sociobot.in/ |
| F-1-46 | Retained real `/drill` routing and metadata. | `@claim:restore-drill` | https://backup-coverage-ledger.sociobot.in/drill?demo=1 |
| F-1-47 | Retained an explicit external-source label on app and static 404 footers. | static 404 chrome structure test | https://backup-coverage-ledger.sociobot.in/polish-2-missing |
| F-2-1 | Replaced copy-only free/boundary tests with exercised workflows, no gate/credential-control assertions, and request inspection. | `@claim:free`, `@claim:safety-boundary` | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-2-2 | Made manifest wording cover accounts, subscriptions, and advertising exactly. | `@claim:free`, `@claim:privacy-runtime` | https://backup-coverage-ledger.sociobot.in/privacy |
| F-2-3 | Renamed destructive import action and help from `Replace all` to `Replace ledger`. | `@claim:merge-import`; copy audit | https://backup-coverage-ledger.sociobot.in/?demo=1 |
| F-2-4 | Changed README `data set` to `asset` and its link to `Try it with sample data`. | README; copy audit | https://backup-coverage-ledger.sociobot.in/?demo=1 |

The final live recheck is recorded in the handoff after the pushed static build becomes active.
