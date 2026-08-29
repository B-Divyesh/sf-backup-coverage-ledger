# Polish round 3 finding ledger

Reviewed candidate: `07694187b7c7e316d3f18b20788c4c8c767012b4`
Repair commit: `807d83ecfd6bc7e6afefb85a3764580bfc8cde1f`

Every row below passed its named clean-clone test and cold live check. Clean clone: `/tmp/bcl-polish-3-clean.w36fQM`; `npm ci --include=dev`, 21 unit/structure tests, production build, audit, 34 browser tests, and each of the 16 claim commands passed. Screenshot evidence: `.factory/evidence/polish-3-local/` and `.factory/evidence/polish-3-live/`. Live route/Axe/privacy evidence: `live-recheck.json`; demo isolation: `demo-isolation-recheck.json`; offline: `offline-recheck.json`; basic verifier: `verify.json`; mobile Lighthouse: `lighthouse.json`.

| Finding | Change made or retained | Evidence | Live check |
|---|---|---|---|
| F-1-1 | Above-fold job, audience, sample action, result note, and facts remain. | mobile first-screen test; `demo-mobile-viewport.png` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-2 | Isolated `?demo=1`, five records, banner, reset, and discard remain. | `@claim:demo-isolation` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-3 | 16-entry claims manifest and one-test-per-claim mapping remain. | `structure.test.ts`; all 16 commands | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-4 | Semantic drill controls and route/dialog Axe matrix remain. | `app.spec.ts` Axe matrix | [PASS](https://backup-coverage-ledger.sociobot.in/drill?demo=1) |
| F-1-5 | Static SWA 404 override and product-specific 404 remain. | `structure.test.ts`; `not-found-mobile.png` | [PASS](https://backup-coverage-ledger.sociobot.in/polish-3-missing) |
| F-1-6 | History focus and polite route announcement remain. | `app.spec.ts` navigation/back test | [PASS](https://backup-coverage-ledger.sociobot.in/privacy) |
| F-1-7 | Route titles, descriptions, canonicals, OG/Twitter metadata, and icons remain. | route metadata test; `live-recheck.json` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-8 | Shared chrome, legal links, build ID, source, price, limits, and steps remain. | `structure.test.ts`; `home-desktop.png` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-9 | One clean, non-concatenated h1 per route remains. | route/Axe matrix | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-10 | Stable-ID compare, conflict choices, replace, and undo remain. | `@claim:merge-import`; `merge.test.ts` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-11 | All promised asset fields persist in demo storage. | `@claim:ledger-fields` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-12 | Explicit no-backup/no-credentials boundary remains exercised. | `@claim:safety-boundary` | [PASS](https://backup-coverage-ledger.sociobot.in/terms) |
| F-1-13 | Named owner, target, location, and restore-step gaps remain. | `@claim:missing-fields` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-14 | Current, due, unproven, expired, and gap statuses remain. | `@claim:proof-statuses` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-15 | Same-origin, demo-only edit/export/reload behavior remains. | `@claim:local-only` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-16 | CSV/YAML import and invalid nested-YAML recovery remain. | `@claim:portable-import` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-17 | Outcome-specific storage, export, and offline claims remain mapped. | local/CSV/YAML/offline claim tests | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-18 | Plain tested price/browser-storage facts remain; provider jargon stays removed. | copy audit; `@claim:free` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-19 | README retains direct job and sample action. | `README.md`; `structure.test.ts` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-20 | Complete terminology-consistent field list remains. | `@claim:ledger-fields`; README | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-21 | Exact safety boundary remains in copy and terms. | `@claim:safety-boundary` | [PASS](https://backup-coverage-ledger.sociobot.in/terms) |
| F-1-22 | Exact proof and coverage state names remain. | `@claim:proof-statuses` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-23 | Separate real/demo keys and same-origin behavior remain. | demo/local claim tests | [PASS](https://backup-coverage-ledger.sociobot.in/privacy?demo=1) |
| F-1-24 | Stable-ID CSV and flat-YAML round trips remain duplicate-free. | CSV/YAML roundtrip claims | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-25 | Printable asset-specific `/drill` remains real routed output. | `@claim:restore-drill` | [PASS](https://backup-coverage-ledger.sociobot.in/drill?demo=1) |
| F-1-26 | Populated service-worker offline reload remains. | `@claim:offline-reload`; `offline-recheck.json` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-27 | Keyboard, 390px, theme, motion, and Axe behavior remains tested. | mobile/Axe/dialog tests | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-28 | Precise storage and request-isolation language remains. | demo/local claim tests | [PASS](https://backup-coverage-ledger.sociobot.in/privacy?demo=1) |
| F-1-29 | IDs, enum, ISO dates, and interval validation remain. | `@claim:portable-schema`; `portable.test.ts` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-30 | Exact 2,000,000-byte import boundary remains. | `@claim:import-limit` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-31 | Runtime audit still excludes analytics, ads, remote fonts, accounts, and third parties. | `@claim:privacy-runtime`; `live-recheck.json` | [PASS](https://backup-coverage-ledger.sociobot.in/privacy?demo=1) |
| F-1-32 | Plain restore-proof caption remains. | copy audit; `home-desktop.png` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-33 | Concrete `Asset ledger` heading remains. | copy audit; `home-desktop.png` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-34 | Self-contained summaries and critical-only calculation remain. | critical-goal test | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-35 | Result-naming action, filter, and export controls remain. | proof/drill claims | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-36 | Replaced empty-state `data set` with `asset`; relabelled form `Asset`; updated audit/build IDs. | new terminology regression; `asset-form-mobile.png` | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-37 | Short README opening remains. | README; copy audit | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-38 | Named small-IT audience remains. | mobile first-screen test | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-39 | Concise provenance and product copy remain. | design/copy audit | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-40 | Plain restore language remains; old jargon stays removed. | copy audit | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-41 | Direct add/update/skip/conflict shared-file wording remains. | `@claim:merge-import` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-42 | Plain offline and proof-interval explanations remain separate. | offline/schema claims | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-43 | Explicit export/share/import instructions remain. | README; merge claim | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-44 | Narrow flat-YAML support and nested-YAML rejection remain. | `@claim:portable-import`; README | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-1-45 | Informative empty-state heading and direct action remain. | asset-creation flow | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| F-1-46 | Real `/drill` route, metadata, history, and focus remain. | drill claim; navigation test | [PASS](https://backup-coverage-ledger.sociobot.in/drill?demo=1) |
| F-1-47 | Labelled external source link remains on app and static 404. | `structure.test.ts`; 404 screenshot | [PASS](https://backup-coverage-ledger.sociobot.in/polish-3-missing) |
| F-2-1 | Exercised free/safety tests remain behavior tests, not copy checks. | `@claim:free`; `@claim:safety-boundary` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-2-2 | Manifest wording still covers accounts, subscriptions, and advertising. | free/privacy claims | [PASS](https://backup-coverage-ledger.sociobot.in/privacy?demo=1) |
| F-2-3 | `Replace ledger` remains the explicit destructive action. | `@claim:merge-import` | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| F-2-4 | README retains `asset` and `Try it with sample data`. | README; copy audit | [PASS](https://backup-coverage-ledger.sociobot.in/) |
| P1 | Critical-only 30-day metric and no-critical state remain. | `ledger.test.ts`; critical-goal test | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |
| P2 | CSV/YAML invalid calendar dates remain rejected before storage. | `portable.test.ts`; invalid-date test | [PASS](https://backup-coverage-ledger.sociobot.in/?demo=1) |

## Round-3 outcome

No current or historical finding remains unresolved. The catalog description is verb-first, 91 characters, and states only testable behavior:

> Track backup coverage, owners, recovery locations, and restore tests in one browser ledger.
