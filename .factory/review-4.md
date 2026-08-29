# Adversarial first-read review 4 — Backup Coverage Ledger

- Date: 2026-08-29
- Work order: `backup-coverage-ledger-review-4`
- Reviewed commit: `c173e43ea0ea77ea7c5bf50326c0376190337f44`
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Viewports: 390×844 and 1440×900, fresh Chromium contexts
- Verdict: **FAIL**

## Verdict

**FAIL — eight findings remain: six blocking and two major.** The product is clear on first read, the one-click demo is useful and isolated, all 16 declared commands exit successfully, and the live route/accessibility/privacy checks pass. Acceptance still fails because five tagged tests do not prove all outcomes stated by their claims, the earlier terminology finding F-1-36 has regressed, and the demo introduction inaccurately describes its coverage-gap sample. One README deployment claim is also absent from the claims ledger.

## Findings

### Blocking

#### F-1-36 — Reopened: one concept still has multiple visitor-facing names

- Exact locations/quotes: landing heading `Keep restore evidence in three steps`; first-screen note `Opens an isolated example ledger.`; README audience sentence `one shared coverage record`.
- Conflict: the product and its terminology ledger establish `restore proof`, `sample`, and `ledger`. The README says that `record` means one saved asset entry, yet uses `coverage record` for the entire ledger.
- Why this fails: a first-time reader must decide whether evidence differs from proof, whether an example differs from the sample demo, and whether a coverage record is the ledger or one asset entry. Review 1 required these concepts to use one term, so this is a half-fixed historical finding and remains blocking under the same ID.
- Concrete fix: use `Record restore proof in three steps`, `Opens an isolated sample ledger.`, and `For small IT, platform, and operations teams that use several backup tools but lack one shared ledger.` Add a visitor-copy regression covering these exact terms.

#### F-4-1 — The missing-fields claim test covers only two of four promised fields

- Exact claim: `.factory/claims.json`, `The ledger flags missing owners, backup targets, recovery locations, and restore steps.`
- Exact test: `tests/e2e/claims.spec.ts:67-72` checks only `Missing owner, recovery location` on the DNS sample.
- Why this fails: removing detection for a missing backup target or missing restore steps would leave `@claim:missing-fields` green. The command passed, but the test does not prove the complete listed outcome.
- Concrete fix: import or create four otherwise-valid records, each missing one named field, and assert the visible gap names for owner, backup target, recovery location, and restore steps in the single tagged test.

#### F-4-2 — The local-only claim test never imports a file

- Exact claim: `.factory/claims.json`, `Ledger edits, imports, and exports run in the browser without sending record data elsewhere.`
- Exact test: `tests/e2e/claims.spec.ts:79-90` records requests while opening the demo, recording proof, exporting CSV, and reloading; it never imports.
- Why this fails: an import regression that uploads file contents could pass the declared privacy test. A separate import-function test has no request log and does not prove the privacy outcome.
- Concrete fix: while the `@claim:local-only` request log is active, import a sample CSV or YAML file, complete the merge, and assert the imported value stays in the demo key and every request remains same-origin.

#### F-4-3 — The printable-checklist claim test never invokes printing

- Exact claim: `.factory/claims.json`, `Builds a printable, asset-specific restore drill checklist.`
- Exact test: `tests/e2e/claims.spec.ts:122-127` checks the drill route, five articles, and one asset's restore steps. It does not select `Print checklist`, observe `window.print`, or verify print media output.
- Why this fails: a disconnected print button or broken print stylesheet would leave `@claim:restore-drill` green.
- Concrete fix: stub and assert `window.print`, select `Print checklist`, emulate print media, and verify that navigation/actions are hidden while all five asset checklists remain visible without horizontal overflow.

#### F-4-4 — The portable-schema claim test does not test the full stated boundaries

- Exact claim: `.factory/claims.json`, `Portable records use stable IDs, three criticality values, ISO dates, and proof intervals from 1 to 3650 days.`
- Exact test: `tests/e2e/claims.spec.ts:153-165` inspects option text and input `min`/`max`, matches one date-shaped export, and rejects only `3651`.
- Why this fails: the tagged command does not prove that intervals `1` and `3650` import, that `0` rejects, that impossible ISO-shaped dates reject, or that an ID remains stable through an import/export cycle. Untagged unit and browser tests are not run by the manifest command.
- Concrete fix: make the single tagged test accept both interval boundaries, reject `0` and `3651`, reject an impossible date such as `2026-02-30`, and round-trip a known ID unchanged.

#### F-4-5 — The ledger-fields claim test does not assert the promised restore proof

- Exact claim: `.factory/claims.json`, `The ledger records each asset, owner, backup target, recovery location, restore steps, retention, interval, and proof.`
- Exact test: `tests/e2e/claims.spec.ts:53-65` checks five visible fields, then checks only `id`, `retention`, and `proofCadenceDays` in storage. It does not assert `lastProofDate` or `proofNotes` before or after reload.
- Why this fails: losing the dated proof or its notes could leave `@claim:ledger-fields` green even though proof is the product's central record.
- Concrete fix: assert the seeded proof date and notes in demo storage, open the asset after reload, and confirm both proof fields retain their values.

### Major

#### F-4-6 — The first demo screen mislabels its fifth sample state

- Exact quote: demo introduction, `Five sample assets show current, due, unproven, expired, and missing restore proof.`
- Observed state: the fifth record, `DNS zone records`, has a dated proof but is labelled `Coverage gap` because owner and recovery location are missing. `Never proven` already describes the record with no restore proof.
- Why this fails: the sentence makes `unproven` and `missing restore proof` sound like separate states and hides what the coverage-gap sample actually demonstrates.
- Concrete fix: `Five sample assets show proof that is current, due soon, never recorded, or expired, plus one coverage gap.` Keep the exact UI state terms aligned with `@claim:proof-statuses`.

#### F-4-7 — The README makes an unlisted deployment claim

- Exact quote/location: README, Deploy: `It provides route fallback, a true 404 response, security headers, and asset caching.`
- Evidence: no `.factory/claims.json` entry lists this four-part behavior. `tests/structure.test.ts` inspects some configuration and the live review observed the 404 and headers, but neither is the declared sandbox test required by the claims contract; asset caching is not asserted there.
- Why this fails: readers can rely on deployment behavior that the claims ledger does not enumerate or fully test.
- Concrete fix: either remove the sentence and keep a deployment instruction such as `Deploy the dist/ directory to Azure Static Web Apps`, or add one manifest entry whose tagged test verifies all four outcomes against the built deployment behavior.

## Thirty-second cold read

### 390×844 before scrolling

- What it does: tracks backup coverage and restore tests in one ledger.
- For whom: small IT teams responsible for critical assets.
- What to click first: **Try it with sample data**; the adjacent note says it opens an isolated example ledger.
- Evidence: the h1, 19-word audience sentence, primary action, result note, and all three facts are visible by y=644. There is no horizontal overflow or console error.
- Result: pass.

### 1440×900 before scrolling

- What it does: tracks which critical assets have backups, owners, and recent restore tests.
- For whom: small IT teams.
- What to click first: **Try it with sample data**.
- Evidence: the same job, audience, action, result note, three facts, and product-specific proof-lattice artwork are visible without scrolling.
- Result: pass.

The exact first-screen copy is `Track backup coverage and restore tests`; `For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test.`; `Try it with sample data`; and `Opens an isolated example ledger.`

## Copy audit

Counting method: whitespace-delimited word tokens; hyphenated terms, paths, and version numbers count as one word. The landing audit covers the initial empty page and its dialog/import guidance. Dynamic asset values are excluded. No sentence exceeds 22 words and no banned word appears.

### Landing page sentences

| ID | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 6 | Track backup coverage and restore tests. | — |
| L2 | 19 | For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test. | — |
| L3 | 5 | Opens an isolated example ledger. | F-1-36 |
| L4 | 1 | Free. | listed `free` claim |
| L5 | 6 | Works offline after the first visit. | listed `offline-reload` claim |
| L6 | 4 | Stored in this browser. | listed `local-only` claim |
| L7 | 7 | A listed backup is not restore proof. | listed safety boundary |
| L8 | 9 | Record proof after someone restores and opens representative data. | — |
| L9 | 12 | The ledger flags missing owners, backup targets, recovery locations, and restore steps. | F-4-1 |
| L10 | 9 | It marks proof expired after each asset’s chosen interval. | listed `proof-statuses` claim |
| L11 | 3 | Keep secrets out. | — |
| L12 | 5 | Records stay in this browser. | listed `local-only` claim |
| L13 | 6 | Imports and exports run here too. | F-4-2 |
| L14 | 8 | Add the critical asset you would miss first. | — |
| L15 | 10 | You can also import a CSV or flat YAML file. | listed `portable-import` claim |
| L16 | 8 | Add its owner, backup target, and recovery location. | — |
| L17 | 7 | Restore representative data in an isolated place. | — |
| L18 | 8 | Add the date and what your team opened. | — |
| L19 | 12 | The ledger does not run backups, open backup systems, or store credentials. | listed `safety-boundary` claim |
| L20 | 8 | Your team performs and checks every restore test. | — |
| L21 | 5 | Records use this browser’s storage. | listed `local-only` claim |
| L22 | 13 | Export a file when your team needs to share or archive the ledger. | listed export/merge claims |
| L23 | 8 | There is no account, subscription, or paid tier. | listed `free` claim |
| L24 | 7 | Track backup owners, locations, and restore proof. | — |
| L25 | 4 | Required fields are marked *. | — |
| L26 | 4 | Describe paths, not credentials. | — |
| L27 | 6 | Proof expires after this many days. | listed schema/status claims |
| L28 | 10 | Only record this after someone restores and opens representative data. | — |
| L29 | 7 | A ledger entry alone is not proof. | listed safety boundary |
| L30 | 13 | The file contains 0 new, 0 newer, 0 unchanged, and 0 conflicting assets. | listed `merge-import` claim |
| L31 | 5 | No conflicts need a choice. | — |
| L32 | 11 | Merge adds new assets, updates newer assets, and skips unchanged assets. | listed `merge-import` claim |
| L33 | 7 | Replace ledger removes the current ledger first. | listed `merge-import` claim |
| L34 | 6 | You can undo either action immediately. | listed `merge-import` claim |
| L35 | 10 | Type the asset name to remove it from this browser. | — |

The demo adds one explanatory sentence: `Five sample assets show current, due, unproven, expired, and missing restore proof.` — 12 words, flagged as F-4-6.

### README sentences

| ID | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 18 | Backup Coverage Ledger helps small IT teams track each critical asset, its backup, and the latest restore test. | listed `ledger-fields` claim |
| R2 | 10 | Try it with sample data or open the live product. | — |
| R3 | 1 | Free. | listed `free` claim |
| R4 | 5 | No account or paid tier. | listed `free` claim |
| R5 | 18 | For small IT, platform, and operations teams that use several backup tools but lack one shared coverage record. | F-1-36 |
| R6 | 17 | Records each asset, owner, backup target, recovery location, restore steps, retention, proof interval, and dated restore proof. | F-4-5 |
| R7 | 11 | Shows gaps, unproven assets, due-soon proof, expired proof, and current proof. | listed `proof-statuses` claim |
| R8 | 9 | Stores real and demo ledgers under separate browser keys. | listed `demo-isolation` claim |
| R9 | 11 | Imports and exports CSV and flat YAML records with stable IDs. | listed import/round-trip claims |
| R10 | 11 | Compares shared files before adding, updating, skipping, replacing, or resolving conflicts. | listed `merge-import` claim |
| R11 | 7 | Builds a printable, asset-specific restore drill checklist. | F-4-3 |
| R12 | 6 | Works offline after the first visit. | listed `offline-reload` claim |
| R13 | 17 | It does not perform backups, access backup systems, handle credentials, or treat documentation as a successful restore. | listed `safety-boundary` claim |
| R14 | 11 | Every statement above maps to an observable browser test in .factory/claims.json. | contradicted by F-4-1–F-4-5 |
| R15 | 13 | Open /?demo=1 or select Try it with sample data on the first screen. | — |
| R16 | 15 | The demo contains five realistic assets and never reads or writes the real ledger key. | listed `demo-isolation` claim |
| R17 | 5 | Reset demo restores the sample. | listed `demo-isolation` claim |
| R18 | 5 | Start for real discards it. | listed `demo-isolation` claim |
| R19 | 8 | See .factory/demo.md for the storage and reset contract. | — |
| R20 | 5 | Use Node.js 20 or newer. | repository instruction |
| R21 | 5 | Vite prints the local URL. | repository instruction |
| R22 | 5 | Data uses that origin’s localStorage. | listed `local-only` claim |
| R23 | 5 | Playwright is pinned to 1.58.2. | repository fact |
| R24 | 9 | Run npx playwright install chromium if Chromium is missing. | repository instruction |
| R25 | 7 | The deploy command is npm run build. | verified build instruction |
| R26 | 6 | The static deploy root is dist/. | verified build instruction |
| R27 | 14 | Export CSV or YAML to get a file you can edit and import again. | listed CSV/YAML claims |
| R28 | 3 | CSV headers are: | — |
| R29 | 6 | Criticality accepts critical, important, or routine. | listed `portable-schema` claim |
| R30 | 3 | Dates use YYYY-MM-DD. | F-4-4 |
| R31 | 6 | The proof interval accepts 1–3650 days. | F-4-4 |
| R32 | 7 | Imports accept files up to 2,000,000 bytes. | listed `import-limit` claim |
| R33 | 6 | They are parsed in the browser. | F-4-2 |
| R34 | 7 | YAML supports flat records from this app. | listed `portable-import` claim |
| R35 | 9 | Nested YAML, aliases, and block scalars are not supported. | listed `portable-import` claim |
| R36 | 13 | Keep passwords, keys, tokens, recovery codes, and other secrets out of ledger files. | — |
| R37 | 11 | The app has no analytics, remote fonts, accounts, or third-party scripts. | listed `privacy-runtime` claim |
| R38 | 7 | Read the in-product privacy and terms pages. | — |
| R39 | 6 | The researched scope is in .factory/brief.json. | repository pointer |
| R40 | 9 | The visual system and artwork provenance are in .factory/design.md. | repository pointer |
| R41 | 5 | Release evidence is in .factory/handoff.md. | repository pointer |
| R42 | 6 | Azure Static Web Apps uses dist/staticwebapp.config.json. | deployment instruction |
| R43 | 13 | It provides route fallback, a true 404 response, security headers, and asset caching. | F-4-7 |
| R44 | 1 | MIT. | verified by LICENSE |
| R45 | 2 | See LICENSE. | — |

### Headings, controls, and terminology

- The h1 and the section headings `Asset ledger`, `No backup records yet`, `A record is not a successful restore`, `Your ledger stays local`, and `Use every feature for free` name their content. `Keep restore evidence in three steps` is the F-1-36 terminology regression.
- Buttons and action links name results: `Try it with sample data`, `Add asset`, `Import file`, `Export CSV`, `Export YAML`, `Add first asset`, `Record restore proof`, `Reset demo`, `Start for real`, `Replace ledger`, `Merge file`, and `Print checklist`.
- Intended terms are `ledger`, `asset`, `backup target`, `restore proof`, `proof interval`, and `restore steps`. Current exceptions are `restore evidence`, `example ledger`, and `coverage record` in F-1-36.

## Demo and sandbox behavior

- One click from the first screen opens `/?demo=1` with `Demo — sample data, nothing is saved to your ledger`, **Reset demo**, and **Start for real**.
- At 390×844 the summary and the beginning of `Customer database` are visible in the first viewport. Five records cover current, due-soon, never-proven, expired, and coverage-gap states.
- A fresh context was pre-seeded with `Private payroll database` under `backup-coverage-ledger:v1`. Editing sample proof changed only `demo:backup-coverage-ledger:v1`. Reset restored five original records. Start for real deleted the demo key and displayed the untouched private record.
- The live demo request log contained only same-origin GET requests. No console or page errors occurred.
- After the first online visit, the populated five-record demo reloaded offline and displayed `Local · offline`.
- Result: sandbox behavior passes. The inaccurate demo-introduction sentence is F-4-6.

## Claims run

Every manifest command was run separately after `npm ci --include=dev` in clean clone `/tmp/bcl-review4-clean.zlqcSi`.

| Claim | Command | Review result |
| --- | --- | --- |
| `demo-isolation` | PASS | adequate |
| `ledger-fields` | PASS | **inadequate — F-4-5** |
| `missing-fields` | PASS | **inadequate — F-4-1** |
| `proof-statuses` | PASS | adequate |
| `local-only` | PASS | **inadequate — F-4-2** |
| `csv-roundtrip` | PASS | adequate |
| `yaml-roundtrip` | PASS | adequate |
| `portable-import` | PASS | adequate |
| `restore-drill` | PASS | **inadequate — F-4-3** |
| `offline-reload` | PASS | adequate; live offline reload also passed |
| `import-limit` | PASS | adequate |
| `portable-schema` | PASS | **inadequate — F-4-4** |
| `privacy-runtime` | PASS | adequate; live request log agrees |
| `free` | PASS | adequate |
| `safety-boundary` | PASS | adequate |
| `merge-import` | PASS | adequate |

The commands have no process failure. The claims gate still fails because five commands cannot detect regressions in part of their own stated outcome, and README R43 is unlisted.

## History verification

Every finding in reviews 1–3 and every repair claim in polish rounds 1–3 and the prior handoff was checked against the deployed site plus current source/tests. `Fixed` means observed or exercised, not copied from the repair ledger.

| Earlier ID | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Both cold viewports show job, audience, first action, result note, and three facts. | Fixed |
| F-1-2 | Five-record demo, banner, separate key, reset, discard, and real-key preservation work. | Fixed |
| F-1-3 | The 16-entry manifest and one-tag-per-entry structure exist; new adequacy defects are F-4-1–F-4-5. | Fixed as scoped |
| F-1-4 | Live drill Axe scan has zero violations; prohibited ARIA is absent. | Fixed |
| F-1-5 | Unknown live URL returns designed content with HTTP 404. | Fixed |
| F-1-6 | Privacy navigation and Back focus and announce the destination h1. | Fixed |
| F-1-7 | Per-route titles, descriptions, canonicals, OG/Twitter data, favicon, and touch icon exist. | Fixed |
| F-1-8 | Static 404 matches the four-link header and complete footer. | Fixed |
| F-1-9 | Home has one clean h1 with no concatenation. | Fixed |
| F-1-10 | Stable-ID compare, conflicts, replace, repeat safety, and undo pass. | Fixed |
| F-1-11 | All field behavior exists in code/live; its listed regression test is incomplete under F-4-5. | Fixed behavior |
| F-1-12 | The no-backup/no-credential boundary is explicit and exercised. | Fixed |
| F-1-13 | Code detects every required field; its listed browser test is incomplete under F-4-1. | Fixed behavior |
| F-1-14 | Current, due, never-proven, expired, and gap states render. | Fixed |
| F-1-15 | Demo storage and same-origin edit/export/reload pass; import privacy coverage is incomplete under F-4-2. | Fixed behavior |
| F-1-16 | CSV/YAML import and nested-YAML rejection pass. | Fixed |
| F-1-17 | Metadata names concrete storage/export outcomes. | Fixed |
| F-1-18 | Provider jargon is absent from the first screen. | Fixed |
| F-1-19 | README opens with the job and correct sample-data link. | Fixed |
| F-1-20 | Field list contains all promised fields. | Fixed |
| F-1-21 | Safety boundary remains explicit and exercised. | Fixed |
| F-1-22 | Exact status behaviors are present; demo wording defect is F-4-6. | Fixed behavior |
| F-1-23 | Browser storage and separate demo namespace were observed. | Fixed |
| F-1-24 | CSV and YAML round trips preserve IDs without duplicates. | Fixed |
| F-1-25 | Asset-specific drill content exists; print invocation remains untested under F-4-3. | Fixed behavior |
| F-1-26 | Populated demo reloads offline after first visit. | Fixed |
| F-1-27 | Keyboard, 390px, themes, reduced motion, and Axe coverage remain. | Fixed |
| F-1-28 | Real/demo keys and same-origin behavior were rechecked. | Fixed |
| F-1-29 | Code and unit tests validate schema; the manifest command is incomplete under F-4-4. | Fixed behavior |
| F-1-30 | 2,000,000 bytes accepts and 2,000,001 rejects. | Fixed |
| F-1-31 | Runtime test and live log exclude analytics, ads, remote fonts, accounts, and third parties. | Fixed |
| F-1-32 | Caption directly distinguishes a listed backup from restore proof. | Fixed |
| F-1-33 | Decorative numbered register label is absent. | Fixed |
| F-1-34 | Summary labels name their measure and condition. | Fixed |
| F-1-35 | Sample, export, filter, import, and proof actions name their results. | Fixed |
| F-1-36 | `restore evidence`, `example ledger`, and `coverage record` reintroduce alternate terms. | **Reopened — blocking** |
| F-1-37 | README opening is 18 words. | Fixed |
| F-1-38 | Audience sentence names the teams in 18 words. | Fixed |
| F-1-39 | Provenance copy is short and documented. | Fixed |
| F-1-40 | First-screen storage and price language is concrete. | Fixed |
| F-1-41 | Shared-file comparison names add/update/skip/replace/conflict behavior. | Fixed |
| F-1-42 | Offline and proof-interval language is direct. | Fixed |
| F-1-43 | README gives concrete export/edit/import instructions. | Fixed |
| F-1-44 | Flat-YAML limits are explicit and tested. | Fixed |
| F-1-45 | Empty state is named `No backup records yet`. | Fixed |
| F-1-46 | Restore drill uses `/drill` with deep-link, history, focus, and sitemap support. | Fixed |
| F-1-47 | Source link is labelled external on app and static 404. | Fixed |
| F-2-1 | Free and safety tests exercise workflows rather than copy alone. | Fixed |
| F-2-2 | Account, subscription, and advertising wording is covered by manifest tests. | Fixed |
| F-2-3 | Destructive import action is `Replace ledger`. | Fixed |
| F-2-4 | README uses `asset` and `Try it with sample data`. | Fixed |
| P1 | Critical-only 30-day calculation and no-critical state remain tested. | Fixed |
| P2 | CSV/YAML impossible calendar dates remain rejected in unit and browser tests. | Fixed |

## Structure, routes, accessibility, and crawl

- `/`, `/?demo=1`, `/drill?demo=1`, `/privacy?demo=1`, and `/terms?demo=1` return 200. `/review-4-missing` returns 404 with the designed page.
- Every route has `lang=en`, one h1, one main, route-specific title/description/canonical data, OG/Twitter metadata, SVG favicon, and 180×180 touch icon. The social image is 1200×630.
- The titles are `Backup Coverage Ledger — track restore tests`, `Demo — Backup Coverage Ledger`, `Restore drill — Backup Coverage Ledger`, `Privacy — Backup Coverage Ledger`, `Terms — Backup Coverage Ledger`, and `Page not found — Backup Coverage Ledger`.
- The internal crawl returned 200 for every intentional route link; `mailto:` links were excluded and the labelled GitHub link returned 200. The deliberate unknown-route probe alone returned 404.
- Live WCAG 2 A/AA Axe scans report zero violations on all six tested routes. There is no 390px horizontal overflow and no normal-route console/page error.
- Browser Back from demo Privacy restores `/?demo=1`, focuses `Review a sample backup ledger`, and announces `Review a sample backup ledger page loaded`.
- Response headers include a self-only CSP with `frame-ancestors 'none'`, `nosniff`, and `no-referrer`. Live demo traffic was first-party only.
- The paper/grid surface, serif/monospace pairing, proof-ring marks, and original proof-lattice artwork are specific to the product rather than a generic SaaS template.

## Missed leverage

No additional feature finding. The brief's obvious shared-workflow needs are covered by stable-ID CSV/YAML import/export, comparison, conflicts, replacement, undo, and a restore-drill checklist. Remote sync would change the stated local-first boundary. AI would not improve this deterministic ledger workflow, and no decorative AI or provider key is present.

## Local quality gates

Clean clone `/tmp/bcl-review4-clean.zlqcSi`:

- `npm test`: **PASS** — 21 tests.
- `npm run build`: **PASS** — `dist/` produced; initial JavaScript 42.80 kB raw / 13.73 kB gzip, CSS 24.40 kB raw / 6.07 kB gzip.
- `npm run test:e2e`: **PASS** — 33 passed, 1 project-conditional skip.
- All 16 manifest commands exited successfully; five fail review adequacy as listed above.

## What would make this perfect

Use one term for each concept, correct the demo's fifth-state sentence, expand the five incomplete claim tests so each proves its full manifest wording, and list or remove the deployment claim. Then rerun every claim command from a clean clone plus the full live mobile/desktop, isolation, offline, route, Axe, focus, and crawl checks. A subsequent review can pass only if that rerun finds zero remaining issues.
