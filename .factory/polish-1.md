# Polish round 1 finding ledger

Candidate reviewed: `c56d8af2d7b3b088e773c172bfb9e90cdc8522bc`

Review source: `.factory/review-1.md` at `2eb83c82557c864bf47c1a668e091e04bbfc2fb7`

Repair implementation: `7ac7c3c`

Evidence paths below are repository-relative. The final live column is completed after the production cold check.

| Finding | Change made | Automated or visual evidence | Live URL check |
|---|---|---|---|
| F-1-1 | Replaced the first screen with a nine-word job headline, named small IT teams, added the one-click sample action and three facts. The phone composition keeps the action above the fold. | `tests/e2e/app.spec.ts` — “first screen…” and “fits the primary action…”; `.factory/evidence/home-mobile.png` | Pending deployment |
| F-1-2 | Added `?demo=1` with five realistic records, a separate `demo:` storage key, a persistent demo banner, reset, and discard-to-real actions. | `@claim:demo-isolation`; `.factory/evidence/demo-mobile.png` | Pending deployment |
| F-1-3 | Added `.factory/claims.json` and exactly one tagged browser test for each of its 16 claims. | `tests/structure.test.ts` — claim/test bijection; all 16 `npm run test:claims -- --grep @claim:<id>` commands | Pending deployment |
| F-1-4 | Removed the prohibited ARIA attribute from the drill operator control and retained its native label. | `tests/e2e/app.spec.ts` — Axe route/dialog matrix reports zero violations | `/drill?demo=1` pending |
| F-1-5 | Added a designed, product-specific `404.html`, Azure 404 response override, and a useful home link. | `tests/structure.test.ts` — valid SWA 404 configuration; `.factory/evidence/not-found.png` | Unknown URL pending |
| F-1-6 | Route changes focus the new `h1`; a polite live region announces it; popstate restores the route and focus. | `tests/e2e/app.spec.ts` — “real routes update title, canonical, focus, announcement, and browser history” | `/drill`, `/privacy`, `/terms` pending |
| F-1-7 | Added route-specific titles, descriptions, canonicals, Open Graph/Twitter metadata, a 1200×630 preview, favicon, and touch icon. | `tests/structure.test.ts`; route metadata browser test | All routes pending |
| F-1-8 | Added one shared header/footer skeleton, Demo and Restore drill navigation, legal links, external-source label, build ID, and original-art credit. | route metadata browser test; `.factory/evidence/demo-desktop.png` | All routes pending |
| F-1-9 | Route rendering now replaces the page DOM; each route contains exactly one `h1`. | `tests/e2e/app.spec.ts` route matrix; local verifier reports one `h1` | All routes pending |
| F-1-10 | Added stable-ID compare-before-import with add/update/unchanged/conflict states, per-conflict choices, replace, repeat safety, and undo. | `@claim:merge-import`; `tests/merge.test.ts` | `/?demo=1` pending |
| F-1-11 | Added a claim and observable test for every promised ledger field and persistence after reload. | `@claim:ledger-fields` | `/?demo=1` pending |
| F-1-12 | Stated and tested that the ledger neither runs backups nor accesses systems or credentials. | `@claim:safety-boundary` | `/` and `/terms` pending |
| F-1-13 | Added a named missing-fields claim and sample assertion for owner, target, recovery location, and restore steps. | `@claim:missing-fields` | `/?demo=1` pending |
| F-1-14 | Seeded and tested current, due, unproven, expired, and gap proof states. | `@claim:proof-statuses` | `/?demo=1` pending |
| F-1-15 | Added a complete edit/export/reload request-log test proving record operations stay in-browser and same-origin. | `@claim:local-only` | `/?demo=1` pending |
| F-1-16 | Added CSV and flat-YAML import behavior tests plus explicit nested-YAML rejection. | `@claim:portable-import` | `/?demo=1` pending |
| F-1-17 | Mapped the CSV/YAML/offline/local facts in metadata to observable claim tests. | `@claim:csv-roundtrip`, `@claim:yaml-roundtrip`, `@claim:offline-reload`, `@claim:local-only` | `/` pending |
| F-1-18 | Removed vague “vendor-neutral” language and listed only tested local, free, export, and offline facts. | `.factory/copy-audit.md`; `@claim:free`, `@claim:local-only` | `/` pending |
| F-1-19 | Rewrote README promises to match the claim ledger and linked the exact demo entry point. | `tests/structure.test.ts`; `.factory/claims.json`; `README.md` | `/?demo=1` pending |
| F-1-20 | Listed each stored field in one terminology-consistent sentence and tested every field. | `@claim:ledger-fields`; `.factory/copy-audit.md` | `/?demo=1` pending |
| F-1-21 | Replaced vague assurance with the explicit, tested safety boundary. | `@claim:safety-boundary` | `/` pending |
| F-1-22 | Replaced “automatically flags” with exact proof-state behavior and tested all states. | `@claim:proof-statuses` | `/?demo=1` pending |
| F-1-23 | Replaced “never leaves your device” with precise browser-storage and request behavior; demo isolation is separate. | `@claim:local-only`, `@claim:demo-isolation` | `/privacy` pending |
| F-1-24 | Replaced generic round-trip language with exact stable-ID CSV and flat-YAML claims and tests. | `@claim:csv-roundtrip`, `@claim:yaml-roundtrip` | `/?demo=1` pending |
| F-1-25 | Added a real `/drill` route and test that produces a printable, asset-specific checklist. | `@claim:restore-drill`; `.factory/evidence/drill-mobile.png` | `/drill?demo=1` pending |
| F-1-26 | Added a service-worker-controlled, populated offline reload claim test. | `@claim:offline-reload` | `/?demo=1` pending |
| F-1-27 | Removed the unbounded browser-support statement; keyboard, phone layout, reduced motion, and themes are verified as behavior rather than marketing copy. | `tests/e2e/app.spec.ts`; `.factory/copy-audit.md`; Lighthouse report | `/` pending |
| F-1-28 | Replaced broad “no uploads” copy with the tested same-origin runtime and browser-storage statement. | `@claim:local-only`, `@claim:privacy-runtime` | `/privacy` pending |
| F-1-29 | Added a portable-schema claim covering stable IDs, enums, ISO dates, and the 1–3650-day range. | `@claim:portable-schema` | `/?demo=1` pending |
| F-1-30 | Added an exact-boundary browser test for 2,000,000 accepted bytes and 2,000,001 rejected bytes. | `@claim:import-limit` | `/?demo=1` pending |
| F-1-31 | Added a runtime privacy claim that inspects resource elements and every request for analytics, remote fonts, and third-party scripts. | `@claim:privacy-runtime` | `/privacy` pending |
| F-1-32 | Rewrote the art caption to explain the evidence distinction in direct language. | `.factory/copy-audit.md`; `.factory/evidence/home-mobile.png` | `/` pending |
| F-1-33 | Removed the decorative “Index / 01” label. | copy audit contains no `Index /`; `.factory/evidence/home-mobile.png` | `/` pending |
| F-1-34 | Replaced cryptic summary labels with “Records,” “Proof current,” “Coverage gaps,” and “Critical proof within 30 days.” | `tests/e2e/app.spec.ts`; demo screenshots | `/?demo=1` pending |
| F-1-35 | Replaced ambiguous controls with “Search records” and “Filter by proof status.” | `@claim:proof-statuses`; `.factory/evidence/demo-desktop.png` | `/?demo=1` pending |
| F-1-36 | Standardized the noun “record” throughout the interface, README, and audit terminology table. | `.factory/copy-audit.md` terminology table | All routes pending |
| F-1-37 | Rewrote the README opening to name the audience and job in two short sentences. | `README.md`; `.factory/copy-audit.md` | Repository evidence |
| F-1-38 | Named small IT teams directly on the first screen. | first-screen browser test; `.factory/evidence/home-mobile.png` | `/` pending |
| F-1-39 | Split the old provenance sentence into short, concrete local-storage and artwork statements. | `.factory/copy-audit.md`; footer route test | `/` pending |
| F-1-40 | Removed recovery jargon and used “restore” consistently. | `.factory/copy-audit.md` banned/terminology checks | All routes pending |
| F-1-41 | Replaced the opaque shared-file sentence with stable-ID comparison and conflict behavior. | `@claim:merge-import`; `README.md` | `/?demo=1` pending |
| F-1-42 | Explained offline behavior and per-record proof intervals in separate, short sentences. | `@claim:offline-reload`, `@claim:portable-schema`; `README.md` | `/` pending |
| F-1-43 | Rewrote sharing instructions as an explicit export → send → import sequence. | `README.md`; `@claim:merge-import` | Repository evidence |
| F-1-44 | Stated that YAML accepts only the app’s flat format and tested nested-data rejection. | `@claim:portable-import`; `README.md` | `/?demo=1` pending |
| F-1-45 | Replaced “Close the first proof gap” with “Start a backup coverage record.” | `tests/e2e/app.spec.ts`; `.factory/copy-audit.md` | `/` pending |
| F-1-46 | Replaced the hash drill with a real `/drill` route, deep-link reload, browser history, focus, and title. | `@claim:restore-drill`; route metadata/history test | `/drill?demo=1` pending |
| F-1-47 | Labeled the source link “Source on GitHub (external)” on every route. | route footer test; `.factory/evidence/demo-desktop.png` | All routes pending |

## Earlier accepted regressions retained

- The critical 30-day measure still excludes routine records. `tests/ledger.test.ts` retains the mixed-criticality 100% regression.
- Impossible CSV and YAML proof dates are still rejected before storage. `tests/portable.test.ts` retains both regressions.

## Local acceptance evidence

- `npm run check`: 20 unit/structure tests, production build, and 31 Playwright checks passed; 1 expected project skip.
- All 16 claim commands passed individually from a detached clean checkout.
- Axe route and dialog matrix: zero violations.
- Local verifier: correct title/lang/main, one `h1`, no missing alt text, no unlabeled buttons, no console errors.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 0.
- Production output: JavaScript 42.76 KB (13.73 KB gzip); CSS 24.42 KB (6.07 KB gzip).
