# Adversarial first-read review 3 — Backup Coverage Ledger

- Date: 2026-08-29
- Work order: `backup-coverage-ledger-review-3`
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Reviewed repository commit: `07694187b7c7e316d3f18b20788c4c8c767012b4`
- Live bundle: `assets/index-Bk_EctYg.js` (the post-polish-2 bundle)
- Viewports: fresh Chromium contexts at 390×844 and 1440×900
- Verdict: **FAIL**

## Verdict

**FAIL — one blocking finding remains.** The product is clear and tryable, all 16 declared claim commands passed independently, and the demo, routing, accessibility, and privacy checks passed. However, the earlier terminology finding is not fully fixed: the empty state calls the tracked item a `data set` while the UI, README, and terminology table establish `asset`. Under the history rule, this half-fixed earlier finding is blocking again. A PASS requires zero findings.

## Thirty-second cold read

### 390×844 before scrolling

- What it does: track backup coverage and restore tests.
- For whom: small IT teams that need one record for each critical asset.
- What to click first: **Try it with sample data**; the adjacent explanation says `Opens an isolated example ledger.`

Evidence: the h1 was visible from y=198.7–341.8, audience sentence from y=361.8–439.9, and primary action from y=463.9–511.9. The three facts all ended above y=645. There was no horizontal overflow and no console/page error.

### 1440×900 before scrolling

- What it does: track backup coverage and restore tests.
- For whom: small IT teams.
- What to click first: **Try it with sample data**, which opens an isolated example ledger.

The same headline, audience, action, and facts were visible before scrolling; the action ended at y=666.0. The proof-lattice artwork is product-specific rather than a generic SaaS hero.

## Findings

### Blocking

#### F-1-36 — Reopened: the tracked item still has two names

- Exact location/quote: live empty ledger, `Add the critical data set you would miss first.` (`src/main.ts:164`). The add/edit form also labels the same field `Asset or data set` (`src/main.ts:181`).
- Contradiction: the page calls the collection `Asset ledger`; the primary action is `Add asset`; README calls it `asset`; and `.factory/copy-audit.md` declares `asset` as the one term for a tracked critical data set.
- Why this fails: a first-time operator has to decide whether an asset and data set are separate things. This is the same terminology inconsistency identified in F-1-36 of review 1, so the history rule makes the remaining half-fix blocking.
- Concrete fix: change the empty-state sentence to `Add the critical asset you would miss first.` Change the label to `Asset` (or define `asset` once in helper text, not as an alternate field name). Update the copy audit and add a regression assertion that the UI uses `asset` for the tracked item.

## Copy audit

Counting method: word tokens containing letters or digits; hyphenated compounds count as one word. The landing list covers the default empty landing state, its informational sections, and static dialog/import guidance. Dynamic record values are not sentences authored for the landing page. No sentence exceeds 22 words and no banned marketing adjective appears. The one terminology flag is F-1-36 above.

### Landing page

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 6 | Track backup coverage and restore tests. | — |
| L2 | 19 | For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test. | — |
| L3 | 5 | Opens an isolated example ledger. | — |
| L4 | 1 | Free. | listed `free` claim |
| L5 | 6 | Works offline after the first visit. | listed `offline-reload` claim |
| L6 | 4 | Stored in this browser. | listed `local-only` claim |
| L7 | 7 | A listed backup is not restore proof. | — |
| L8 | 9 | Record proof after someone restores and opens representative data. | — |
| L9 | 12 | The ledger flags missing owners, backup targets, recovery locations, and restore steps. | listed `missing-fields` claim |
| L10 | 9 | It marks proof expired after each asset’s chosen interval. | listed `proof-statuses` claim |
| L11 | 3 | Keep secrets out. | — |
| L12 | 5 | Records stay in this browser. | listed `local-only` claim |
| L13 | 6 | Imports and exports run here too. | listed `local-only` claim |
| L14 | 9 | Add the critical data set you would miss first. | **F-1-36** |
| L15 | 10 | You can also import a CSV or flat YAML file. | listed `portable-import` claim |
| L16 | 8 | Add its owner, backup target, and recovery location. | — |
| L17 | 7 | Restore representative data in an isolated place. | — |
| L18 | 8 | Add the date and what your team opened. | — |
| L19 | 12 | The ledger does not run backups, open backup systems, or store credentials. | listed `safety-boundary` claim |
| L20 | 8 | Your team performs and checks every restore test. | — |
| L21 | 5 | Records use this browser’s storage. | listed `local-only` claim |
| L22 | 13 | Export a file when your team needs to share or archive the ledger. | listed export/merge claims |
| L23 | 8 | There is no account, subscription, or paid tier. | listed `free` claim |
| L24 | 4 | Required fields are marked. | — |
| L25 | 4 | Describe paths, not credentials. | — |
| L26 | 6 | Proof expires after this many days. | listed `portable-schema`/`proof-statuses` claims |
| L27 | 10 | Only record this after someone restores and opens representative data. | — |
| L28 | 7 | A ledger entry alone is not proof. | — |
| L29 | 13 | The file contains 0 new, 0 newer, 0 unchanged, and 0 conflicting assets. | listed `merge-import` claim |
| L30 | 5 | No conflicts need a choice. | — |
| L31 | 11 | Merge adds new assets, updates newer assets, and skips unchanged assets. | listed `merge-import` claim |
| L32 | 7 | Replace ledger removes the current ledger first. | listed `merge-import` claim |
| L33 | 6 | You can undo either action immediately. | listed `merge-import` claim |
| L34 | 10 | Type the asset name to remove it from this browser. | — |

Headings are literal and understandable out of context: `Asset ledger`, `No backup records yet`, `Keep restore evidence in three steps`, `A record is not a successful restore`, and `Use every feature for free`. Controls name their outcomes, including `Try it with sample data`, `Export CSV`, `Replace ledger`, and `Record restore proof`. The navigation nouns are appropriate links, not action buttons.

### README

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 18 | Backup Coverage Ledger helps small IT teams track each critical asset, its backup, and the latest restore test. | listed `ledger-fields` claim |
| R2 | 10 | Try it with sample data or open the live product. | — |
| R3 | 1 | Free. | listed `free` claim |
| R4 | 5 | No account or paid tier. | listed `free` claim |
| R5 | 18 | For small IT, platform, and operations teams that use several backup tools but lack one shared coverage record. | — |
| R6 | 17 | Records each asset, owner, backup target, recovery location, restore steps, retention, proof interval, and dated restore proof. | listed `ledger-fields` claim |
| R7 | 11 | Shows gaps, unproven assets, due-soon proof, expired proof, and current proof. | listed `proof-statuses` claim |
| R8 | 9 | Stores real and demo ledgers under separate browser keys. | listed `demo-isolation` claim |
| R9 | 11 | Imports and exports CSV and flat YAML records with stable IDs. | listed import/round-trip claims |
| R10 | 11 | Compares shared files before adding, updating, skipping, replacing, or resolving conflicts. | listed `merge-import` claim |
| R11 | 7 | Builds a printable, asset-specific restore drill checklist. | listed `restore-drill` claim |
| R12 | 6 | Works offline after the first visit. | listed `offline-reload` claim |
| R13 | 17 | It does not perform backups, access backup systems, handle credentials, or treat documentation as a successful restore. | listed `safety-boundary` claim |
| R14 | 13 | Every statement above maps to an observable browser test in .factory/claims.json. | confirmed below |
| R15 | 14 | Open /?demo=1 or select Try it with sample data on the first screen. | — |
| R16 | 15 | The demo contains five realistic assets and never reads or writes the real ledger key. | listed `demo-isolation` claim |
| R17 | 5 | Reset demo restores the sample. | listed `demo-isolation` claim |
| R18 | 5 | Start for real discards it. | listed `demo-isolation` claim |
| R19 | 10 | See .factory/demo.md for the storage and reset contract. | — |
| R20 | 6 | Use Node.js 20 or newer. | — |
| R21 | 5 | Vite prints the local URL. | — |
| R22 | 5 | Data uses that origin’s localStorage. | listed `local-only` claim |
| R23 | 7 | Playwright is pinned to 1.58.2. | repository fact |
| R24 | 9 | Run npx playwright install chromium if Chromium is missing. | — |
| R25 | 7 | The deploy command is npm run build. | repository instruction |
| R26 | 6 | The static deploy root is dist/. | repository instruction |
| R27 | 14 | Export CSV or YAML to get a file you can edit and import again. | listed CSV/YAML claims |
| R28 | 3 | CSV headers are: | — |
| R29 | 6 | Criticality accepts critical, important, or routine. | listed `portable-schema` claim |
| R30 | 3 | Dates use YYYY-MM-DD. | listed `portable-schema` claim |
| R31 | 7 | The proof interval accepts 1–3650 days. | listed `portable-schema` claim |
| R32 | 9 | Imports accept files up to 2,000,000 bytes. | listed `import-limit` claim |
| R33 | 6 | They are parsed in the browser. | listed `local-only` claim |
| R34 | 7 | YAML supports flat records from this app. | listed `portable-import` claim |
| R35 | 9 | Nested YAML, aliases, and block scalars are not supported. | listed `portable-import` claim |
| R36 | 13 | Keep passwords, keys, tokens, recovery codes, and other secrets out of ledger files. | — |
| R37 | 11 | The app has no analytics, remote fonts, accounts, or third-party scripts. | listed `privacy-runtime` claim |
| R38 | 7 | Read the in-product privacy and terms pages. | — |
| R39 | 8 | The researched scope is in .factory/brief.json. | — |
| R40 | 11 | The visual system and artwork provenance are in .factory/design.md. | — |
| R41 | 7 | Release evidence is in .factory/handoff.md. | — |
| R42 | 9 | Azure Static Web Apps uses dist/staticwebapp.config.json. | repository instruction |
| R43 | 13 | It provides route fallback, a true 404 response, security headers, and asset caching. | confirmed by build/live response check |
| R44 | 1 | MIT. | confirmed by `LICENSE` |
| R45 | 2 | See LICENSE. | — |

No other jargon, marketing adjective, mood heading, non-result naming button, or unlisted visitor-facing product claim was found. `data set` in L14 is the sole terminology exception.

## Demo, sandbox, privacy, and claims

- One click on the first-screen action opened `/?demo=1`. The persistent banner read `Demo — sample data, nothing is saved to your ledger` and exposed **Reset demo** and **Start for real**.
- The first sample screen showed the product in use: five realistic records, all five proof states, and summary counts. At 390px, the first record began at y=673.7, so its status and owner were visible in the first viewport.
- A fresh context pre-seeded `backup-coverage-ledger:v1` with `Private payroll ledger`. Editing sample data changed only `demo:backup-coverage-ledger:v1`; Reset restored `Customer database` and removed the edit; Start for real deleted the demo key and showed the untouched private record.
- The manual live request log contained only same-origin GETs. There were no normal-route console, page, or failed-request errors. The expected HTTP-404 navigation reports the browser's network-status console message for its own 404 response; it is not an application-script error.
- The live demo showed a service-worker-controlled shell and the clean-clone `offline-reload` claim passed with offline reload after first visit.

Every command declared by `.factory/claims.json` was executed separately from fresh clone `/tmp/bcl-review3-clean.VVo8mQ` after `npm ci --include=dev` (the environment's initial `npm ci` omitted dev dependencies). Each ran one tagged observable browser test and passed:

| Claim | Result |
| --- | --- |
| demo-isolation | PASS |
| ledger-fields | PASS |
| missing-fields | PASS |
| proof-statuses | PASS |
| local-only | PASS |
| csv-roundtrip | PASS |
| yaml-roundtrip | PASS |
| portable-import | PASS |
| restore-drill | PASS |
| offline-reload | PASS |
| import-limit | PASS |
| portable-schema | PASS |
| privacy-runtime | PASS |
| free | PASS |
| safety-boundary | PASS |
| merge-import | PASS |

`@claim:free` now exercises add, proof, export, import, drill, back, and reset while rejecting account/billing controls and requests. `@claim:safety-boundary` exercises add/import/proof/drill and rejects credential controls and backup-system requests. This closes review-2's former copy-only test issue.

## History verification

The table records direct live and source/test checks rather than relying on prior status labels.

| Earlier finding | Current check | Result |
| --- | --- | --- |
| F-1-1 | Both cold viewports name job, audience, first action, result, and three facts above the fold. | Fixed |
| F-1-2 | Isolated five-record demo, persistent banner, reset, discard, and real-key preservation were exercised. | Fixed |
| F-1-3 | Manifest has 16 entries, each maps to exactly one tag, and all commands passed. | Fixed |
| F-1-4 | Live Axe on `/drill?demo=1` has no violations; prohibited ARIA is absent. | Fixed |
| F-1-5 | Unknown live URL returns designed page with HTTP 404. | Fixed |
| F-1-6 | Privacy navigation and browser Back focused the destination h1 and updated the polite announcement. | Fixed |
| F-1-7 | Route title/description/canonical/OG/Twitter/favicon/touch metadata is present per route. | Fixed |
| F-1-8 | Static 404 has the four primary links and footer one-liner, legal links, source label, build, and art credit. | Fixed |
| F-1-9 | Home h1 text is `Track backup coverage and restore tests`; no concatenation. | Fixed |
| F-1-10 | Stable-ID comparison, conflict choice, replace, and undo passed. | Fixed |
| F-1-11 | All named fields render and persist in demo storage. | Fixed |
| F-1-12 | Limitation is explicit and the exercised boundary test passes. | Fixed |
| F-1-13 | DNS sample names missing owner and recovery location. | Fixed |
| F-1-14 | Current, due, unproven, expired, and gap states all render and test. | Fixed |
| F-1-15 | Edit/export/reload stayed same-origin and demo-only. | Fixed |
| F-1-16 | CSV/flat YAML import and nested-YAML rejection passed. | Fixed |
| F-1-17 | Specific local/export/offline claims map to tests. | Fixed |
| F-1-18 | First screen contains concrete facts, not vendor/local-first jargon. | Fixed |
| F-1-19 | README opens with the correct job and exact sample-action wording. | Fixed |
| F-1-20 | README field list and field test cover all promised fields. | Fixed |
| F-1-21 | Explicit safety boundary remains and is exercised. | Fixed |
| F-1-22 | Exact status terms render and are tested. | Fixed |
| F-1-23 | Browser storage, demo namespace, and request behavior were observed. | Fixed |
| F-1-24 | CSV and YAML round trips preserve stable IDs without duplicates. | Fixed |
| F-1-25 | `/drill?demo=1` renders all five asset-specific checklists. | Fixed |
| F-1-26 | Populated demo reload works offline after first visit. | Fixed |
| F-1-27 | Keyboard/mobile/reduced-motion/theme behavior is test-covered; no broad support claim remains. | Fixed |
| F-1-28 | Real/demo namespaces and same-origin behavior were rechecked. | Fixed |
| F-1-29 | IDs, enum values, ISO dates, and 1–3650-day interval are tested. | Fixed |
| F-1-30 | 2,000,000-byte import succeeds and 2,000,001-byte import rejects. | Fixed |
| F-1-31 | Runtime test checks analytics, advertising, remote fonts, accounts, and third-party scripts. | Fixed |
| F-1-32 | Caption plainly distinguishes backup listing from restore proof. | Fixed |
| F-1-33 | Decorative register label is absent. | Fixed |
| F-1-34 | Summary labels state the relevant measure and condition. | Fixed |
| F-1-35 | Export/filter/import/proof controls name their results. | Fixed |
| F-1-36 | Empty-state `data set` and form `Asset or data set` remain. | **Reopened — blocking** |
| F-1-37 | README opening is 18 words and direct. | Fixed |
| F-1-38 | Audience names small IT/platform/operations teams in 18 words. | Fixed |
| F-1-39 | README provenance material is three short sentences. | Fixed |
| F-1-40 | Old provider/storage jargon is absent from the first screen. | Fixed |
| F-1-41 | Shared-file behavior uses direct add/update/skip/conflict wording. | Fixed |
| F-1-42 | Offline and proof-interval language is direct. | Fixed |
| F-1-43 | README gives export/edit/import instructions. | Fixed |
| F-1-44 | Flat-YAML limit is explicit and tested. | Fixed |
| F-1-45 | Empty-state heading is `No backup records yet`. | Fixed |
| F-1-46 | Restore drill uses `/drill`, deep-links, history, focus, and sitemap. | Fixed |
| F-1-47 | Source link is visibly labelled external on app and static 404. | Fixed |
| F-2-1 | Free and safety claim tests observe workflows and outcomes, not copy. | Fixed |
| F-2-2 | Manifest/test wording covers accounts, subscriptions, and advertising. | Fixed |
| F-2-3 | Destructive action is `Replace ledger`. | Fixed |
| F-2-4 | README uses `asset` and `Try it with sample data`. | Fixed |
| P1 | Critical-only 30-day calculation regression remains in tests. | Fixed |
| P2 | CSV/YAML invalid real-calendar date regressions remain in tests. | Fixed |

## Structure, routes, accessibility, and crawl

- `/`, `/?demo=1`, `/drill?demo=1`, `/privacy?demo=1`, and `/terms?demo=1` returned 200; the unknown-route probe returned 404. Their normal and demo states each had one h1 and one main. The live mobile Axe WCAG 2 A/AA scan reported zero violations for all of those routes and the static 404.
- Titles follow the required pattern: `Backup Coverage Ledger — track restore tests`, `Demo — Backup Coverage Ledger`, `Restore drill — Backup Coverage Ledger`, `Privacy — Backup Coverage Ledger`, `Terms — Backup Coverage Ledger`, and `Page not found — Backup Coverage Ledger`. Descriptions, canonicals, OG/Twitter card data, favicon, 180px touch icon, `lang=en`, and the 1200×630 social image are present.
- Browser Back from demo Privacy restored `/?demo=1`, focused `Review a sample backup ledger`, and announced `Review a sample backup ledger page loaded`.
- Crawled internal asset and route targets returned 200: `/`, demo, drill, privacy, terms, `/404.html`, `robots.txt`, `sitemap.xml`, favicon, touch icon, and social preview. The external GitHub link returned 200; mailto links are intentional non-HTTP links.
- Live responses use a response-header CSP including `frame-ancestors 'none'`, with self-only script/style/connect sources. No third-party runtime request was observed.
- The archival paper/grid, serif/monospace pairing, proof-ring status marks, and original proof-lattice illustration match `.factory/design.md` and do not resemble a generic SaaS template.

## Missed leverage

No additional finding. The brief's obvious shared-workflow leverage—stable-ID CSV/YAML import/export, comparison, conflicts, replacement, undo, and printable restore drill—is present. Synchronization would change the stated local-first model. AI would not improve this deterministic record-and-checklist task and there is no decorative AI, provider key, or model endpoint.

## Local quality gates

Fresh-clone checks after `npm ci --include=dev`:

- `npm test`: PASS — 21 tests in 4 files.
- `npm run build`: PASS — `dist/` produced; JavaScript 42.82 kB raw / 13.74 kB gzip, CSS 24.40 kB raw / 6.07 kB gzip.
- `npm run test:e2e`: PASS — 32 Playwright tests; `.last-run.json` reports `passed` with no failed tests.
- Every listed claim command: PASS, as recorded above.

## What would make this perfect

Use `asset` consistently for the tracked item in the empty state and form label, update the terminology/copy audit, add a regression test, then rerun the complete clean-clone claim matrix, full quality gate, live demo-isolation probe, cold 390px/desktop read, Axe route matrix, and crawl. With that one historical finding genuinely closed, this review would be PASS-adjacent.
