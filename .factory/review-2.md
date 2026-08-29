# Adversarial first-read review 2 — Backup Coverage Ledger

- Date: 2026-08-29
- Work order: `backup-coverage-ledger-review-2`
- Reviewed commit: `14417f2a179edbd0f1f9ea14f657eec599f3de46`
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Viewports: 390×844 and 1440×900, fresh Chromium contexts
- Verdict: **FAIL**

## Verdict

**FAIL — five findings remain: two blocking, one major, and two minor.** The first screen, demo, core workflows, local build, accessibility scan, and all 16 listed claim commands work. Acceptance still fails because the static 404 only partially implements the shared chrome promised as the fix for F-1-8, and two claim tests assert that claim text exists rather than testing the promised outcome. Repeated account/subscription/advertising claims are also absent from the claims ledger. A PASS requires zero findings and no untested claim.

## Findings

### Blocking

#### F-1-8 — Reopened: the 404 still does not use the shared header and footer

- Exact location: live unknown route `/review-2-missing-page`; `public/404.html:26-28`; compare `src/main.ts:74-84` and the normal footer.
- Exact mismatch: the 404 header contains `Ledger`, `Demo`, and `Privacy`, while every application route contains `Ledger`, `Demo`, `Restore drill`, and `Privacy`. Its footer omits `Source on GitHub (external)` and `Original generative artwork`.
- Evidence: the live unknown route correctly returned HTTP 404, but its extracted header/footer differed from `/`, `/drill`, `/privacy`, and `/terms`. The repair ledger says F-1-8 added “one shared header/footer skeleton,” so this is a half-fix of the earlier finding.
- Impact: navigation changes when a visitor most needs a reliable way out. The history rule makes any half-fixed earlier finding blocking again under the same ID.
- Concrete fix: generate `404.html` from the same chrome data or keep a parity-tested static copy. Add a browser/structure assertion that the wordmark, four primary links, product one-liner, Privacy, Terms, source link, build ID, and art credit match on every route including the true 404.

#### F-2-1 — Two listed claim tests only verify that the claims were printed

- Exact location: `tests/e2e/claims.spec.ts:158-165`; README line 25 says `Every statement above maps to an observable browser test in .factory/claims.json.`
- Exact behavior: `@claim:free` only asserts that `Use every feature for free` and `There is no account, subscription, or paid tier.` are visible. `@claim:safety-boundary` only asserts that the limitation heading and sentence are visible.
- Evidence: both commands pass, but neither observes the claimed outcome. They prove that the page repeats the promise, not that features have no payment/account gate or that the app lacks backup-system/credential behavior. This fails the attached claims rule: a claim test must assert the observable result, not the presence of copy.
- Impact: a green claims run can coexist with a paywall, sign-in gate, credential field, or backup-system request. The README's test-coverage statement is therefore misleading.
- Concrete fix: make `@claim:free` exercise every feature class from a clean demo and assert no sign-in, paywall, billing control, or payment request appears. Make `@claim:safety-boundary` inspect all requests and relevant controls during add/import/proof/drill flows, asserting there is no credential input or backup-system integration. If those outcomes cannot be tested honestly, rewrite these as explicit limitations and remove the claim-test coverage assertion.

### Major

#### F-2-2 — Account, subscription, and advertising claims are not listed in `claims.json`

- Exact quotes: landing `There is no account, subscription, or paid tier.`; README `No account or paid tier.` and `The app has no analytics, remote fonts, accounts, or third-party scripts.`; Privacy `The app has no account, analytics, advertising, or third-party scripts.`
- Evidence: `free` lists only “Every feature is free with no paid tier.” `privacy-runtime` lists only analytics, remote fonts, and third-party scripts. No entry names absence of accounts, subscriptions, or advertising.
- Impact: these are relied-on privacy and cost promises, but the manifest does not enumerate all of them. Manual source/request inspection found no account, subscription, or advertising path, which confirms current behavior but does not satisfy the required claim-to-test ledger.
- Concrete fix: either remove the extra words or extend the claim entries and their single tagged tests to cover accounts/authentication, subscriptions/billing, and advertising explicitly. Keep each retained sentence aligned with the exact manifest wording.

### Minor

#### F-2-3 — `Replace all` does not name the object it will replace

- Exact location: import comparison dialog, `src/main.ts:183`; help at `src/main.ts:281` says `Replace all removes the current ledger first.`
- Impact: this is the destructive branch of import, but the button makes the user consult surrounding copy to learn that “all” means the ledger.
- Concrete fix: rename the button `Replace ledger`. Keep the preview, undo, and explanatory sentence.

#### F-2-4 — The README changes terms and demo-action wording at the point of introduction

- Exact location: README lines 3 and 5: `each critical data set` followed by later `asset`, and `Try the isolated sample ledger` versus the product action `Try it with sample data`.
- Impact: the product terminology table chooses `asset`, and the required primary action has one established label. A first-time reader should not decide whether a data set is different from an asset or whether the README link opens a different sample path.
- Concrete fix: use `Backup Coverage Ledger helps small IT teams track each critical asset, its backup, and the latest restore test.` and label the link `Try it with sample data`.

## Thirty-second cold read

### 390×844, before scrolling

- What it does: tracks backup coverage and restore tests.
- For whom: small IT teams that need one record for each critical asset.
- What to click first: `Try it with sample data`; the adjacent line says `Opens an isolated example ledger.`
- Evidence: the headline occupied y=198.7–341.8, the audience sentence y=361.8–439.9, the action y=463.9–511.9, and all three facts ended at y=644.9. All required information was visible without scrolling.
- Result: pass.

### 1440×900, before scrolling

- What it does: tracks backup coverage and restore tests.
- For whom: small IT teams.
- What to click first: `Try it with sample data`, which opens an isolated example ledger.
- Evidence: the action and the three facts were visible above y=709, alongside the product-specific proof-lattice artwork.
- Result: pass.

Exact first-screen text used for the answers: `Track backup coverage and restore tests`; `For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test.`; `Try it with sample data`; `Opens an isolated example ledger.`

## Copy audit

Counting method: tokens containing letters or numbers; hyphenated compounds count as one word. The landing audit covers the empty real ledger plus the dialog/help sentences present in that page. Headings and controls are audited separately. No sentence exceeds 22 words and no banned marketing adjective appears.

### Landing page sentences

| ID | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 6 | Track backup coverage and restore tests. | — |
| L2 | 19 | For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test. | — |
| L3 | 5 | Opens an isolated example ledger. | — |
| L4 | 1 | Free. | listed claim |
| L5 | 6 | Works offline after the first visit. | listed claim |
| L6 | 4 | Stored in this browser. | listed claim |
| L7 | 7 | A listed backup is not restore proof. | — |
| L8 | 9 | Record proof after someone restores and opens representative data. | — |
| L9 | 12 | The ledger flags missing owners, backup targets, recovery locations, and restore steps. | listed claim |
| L10 | 9 | It marks proof expired after each asset’s chosen interval. | listed claim |
| L11 | 3 | Keep secrets out. | — |
| L12 | 5 | Records stay in this browser. | listed claim |
| L13 | 6 | Imports and exports run here too. | listed claim |
| L14 | 9 | Add the critical data set you would miss first. | — |
| L15 | 10 | You can also import a CSV or flat YAML file. | listed claim |
| L16 | 8 | Add its owner, backup target, and recovery location. | — |
| L17 | 7 | Restore representative data in an isolated place. | — |
| L18 | 8 | Add the date and what your team opened. | — |
| L19 | 12 | The ledger does not run backups, open backup systems, or store credentials. | F-2-1 |
| L20 | 8 | Your team performs and checks every restore test. | — |
| L21 | 5 | Records use this browser’s storage. | listed claim |
| L22 | 13 | Export a file when your team needs to share or archive the ledger. | listed claim |
| L23 | 8 | There is no account, subscription, or paid tier. | F-2-1, F-2-2 |
| L24 | 7 | Track backup owners, locations, and restore proof. | listed claim |
| L25 | 4 | Required fields are marked *. | — |
| L26 | 4 | Describe paths, not credentials. | — |
| L27 | 6 | Proof expires after this many days. | listed claim |
| L28 | 10 | Only record this after someone restores and opens representative data. | — |
| L29 | 7 | A ledger entry alone is not proof. | — |
| L30 | 10 | Type the asset name to remove it from this browser. | — |
| L31 | 11 | Merge adds new assets, updates newer assets, and skips unchanged assets. | listed claim |
| L32 | 7 | Replace all removes the current ledger first. | F-2-3 |
| L33 | 6 | You can undo either action immediately. | listed claim |

### README sentences

| ID | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 19 | Backup Coverage Ledger helps small IT teams track each critical data set, its backup, and the latest restore test. | F-2-4 |
| R2 | 10 | Try the isolated sample ledger or open the live product. | F-2-4 |
| R3 | 1 | Free. | listed claim |
| R4 | 5 | No account or paid tier. | F-2-1, F-2-2 |
| R5 | 18 | For small IT, platform, and operations teams that use several backup tools but lack one shared coverage record. | — |
| R6 | 17 | Records each asset, owner, backup target, recovery location, restore steps, retention, proof interval, and dated restore proof. | listed claim |
| R7 | 11 | Shows gaps, unproven assets, due-soon proof, expired proof, and current proof. | listed claim |
| R8 | 9 | Stores real and demo ledgers under separate browser keys. | listed claim |
| R9 | 11 | Imports and exports CSV and flat YAML records with stable IDs. | listed claim |
| R10 | 11 | Compares shared files before adding, updating, skipping, replacing, or resolving conflicts. | listed claim |
| R11 | 7 | Builds a printable, asset-specific restore drill checklist. | listed claim |
| R12 | 6 | Works offline after the first visit. | listed claim |
| R13 | 17 | It does not perform backups, access backup systems, handle credentials, or treat documentation as a successful restore. | F-2-1 |
| R14 | 12 | Every statement above maps to an observable browser test in .factory/claims.json. | F-2-1 |
| R15 | 14 | Open /?demo=1 or select Try it with sample data on the first screen. | — |
| R16 | 15 | The demo contains five realistic assets and never reads or writes the real ledger key. | listed claim |
| R17 | 5 | Reset demo restores the sample. | listed claim |
| R18 | 5 | Start for real discards it. | listed claim |
| R19 | 9 | See .factory/demo.md for the storage and reset contract. | — |
| R20 | 6 | Use Node.js 20 or newer. | — |
| R21 | 5 | Vite prints the local URL. | — |
| R22 | 5 | Data uses that origin’s localStorage. | listed claim |
| R23 | 7 | Playwright is pinned to 1.58.2. | — |
| R24 | 9 | Run npx playwright install chromium if Chromium is missing. | — |
| R25 | 7 | The deploy command is npm run build. | — |
| R26 | 6 | The static deploy root is dist/. | — |
| R27 | 14 | Export CSV or YAML to get a file you can edit and import again. | listed claim |
| R28 | 3 | CSV headers are: | — |
| R29 | 6 | Criticality accepts critical, important, or routine. | listed claim |
| R30 | 3 | Dates use YYYY-MM-DD. | listed claim |
| R31 | 7 | The proof interval accepts 1–3650 days. | listed claim |
| R32 | 9 | Imports accept files up to 2,000,000 bytes. | listed claim |
| R33 | 6 | They are parsed in the browser. | listed claim |
| R34 | 7 | YAML supports flat records from this app. | listed claim |
| R35 | 9 | Nested YAML, aliases, and block scalars are not supported. | listed claim |
| R36 | 13 | Keep passwords, keys, tokens, recovery codes, and other secrets out of ledger files. | — |
| R37 | 11 | The app has no analytics, remote fonts, accounts, or third-party scripts. | F-2-2 |
| R38 | 7 | Read the in-product privacy and terms pages. | — |
| R39 | 7 | The researched scope is in .factory/brief.json. | — |
| R40 | 10 | The visual system and artwork provenance are in .factory/design.md. | — |
| R41 | 6 | Release evidence is in .factory/handoff.md. | — |
| R42 | 8 | Azure Static Web Apps uses dist/staticwebapp.config.json. | — |
| R43 | 13 | It provides route fallback, a true 404 response, security headers, and asset caching. | locally/live verified |
| R44 | 1 | MIT. | verified by LICENSE |
| R45 | 2 | See LICENSE. | — |

### Headings, terminology, and controls

- Landing headings are concrete and retain a valid h1 → h2 → h3 outline: `Track backup coverage and restore tests`, `Asset ledger`, `No backup records yet`, `Keep restore evidence in three steps`, `A record is not a successful restore`, `Your ledger stays local`, and `Use every feature for free`.
- README headings make sense out of context. `Privacy and design` combines two topics but names both.
- Landing controls that pass include `Try it with sample data`, `Add asset`, `Import file`, `Export CSV`, `Export YAML`, `Record restore proof`, `Save asset`, `Merge file`, and the `Show …` filter controls.
- `Replace all` fails result naming (F-2-3).
- The chosen terms are `ledger`, `asset`, `backup target`, `restore proof`, `restore steps`, and `proof interval`. README's opening `data set` and alternate demo-link label are F-2-4.

## Demo and sandbox behavior

- One click on the first-screen action opened `/?demo=1` with the persistent banner `Demo — sample data, nothing is saved to your ledger`, `Reset demo`, and `Start for real`.
- At 390×844, the demo h1 and summary were visible and the first realistic record began at y=679.7. Five records covered current, due-soon, unproven, coverage-gap, and expired states.
- A fresh context was pre-seeded with `Private payroll database` under `backup-coverage-ledger:v1`. Editing and resetting the sample changed only `demo:backup-coverage-ledger:v1`. Reset restored all five sample records. `Start for real` deleted the demo key and displayed the untouched private record.
- Every observed demo request was a same-origin GET. No console/page errors or failed requests occurred. Offline reload also passed through the listed claim test.
- Result: demo and sandbox pass.

## Claims run

Every manifest command was run separately from clean clone `/tmp/bcl-review2-clean.y7IoCU` at the reviewed commit after `npm ci`.

| Claim | Command result | Outcome coverage |
| --- | --- | --- |
| `demo-isolation` | PASS | adequate |
| `ledger-fields` | PASS | adequate |
| `missing-fields` | PASS | adequate |
| `proof-statuses` | PASS | adequate |
| `local-only` | PASS | adequate; live request log agreed |
| `csv-roundtrip` | PASS | adequate |
| `yaml-roundtrip` | PASS | adequate |
| `portable-import` | PASS | adequate |
| `restore-drill` | PASS | adequate |
| `offline-reload` | PASS | adequate |
| `import-limit` | PASS | adequate |
| `portable-schema` | PASS | adequate |
| `privacy-runtime` | PASS | adequate for its listed wording |
| `free` | PASS | inadequate; F-2-1 |
| `safety-boundary` | PASS | inadequate; F-2-1 |
| `merge-import` | PASS | adequate |

The commands have no process failure, but the claims ledger does not pass acceptance because F-2-1 leaves two outcomes untested and F-2-2 identifies unlisted wording.

## History verification

Every finding in `.factory/review-1.md` was rechecked against the live site and current source/tests. “Fixed” below means independently observed, not merely marked fixed in `.factory/polish-1.md`.

| Earlier ID | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 | Both cold viewports name the job, audience, first action, outcome, and three facts above the fold. | Fixed |
| F-1-2 | Five-record demo, separate key, banner, reset, discard, and real-key preservation were exercised live. | Fixed |
| F-1-3 | `claims.json` has 16 entries and structure tests enforce one matching tag each; outcome weakness is separately F-2-1. | Fixed as scoped |
| F-1-4 | Live Axe on `/drill?demo=1` returned zero violations; the prohibited `strong[aria-label]` is gone. | Fixed |
| F-1-5 | Unknown live route returns the designed page with HTTP 404. | Fixed |
| F-1-6 | Privacy navigation and browser Back focus the new h1 and update the polite announcement after route render. | Fixed |
| F-1-7 | Every route has route-specific title, description, canonical, OG/Twitter image metadata, favicon, and touch icon. | Fixed |
| F-1-8 | Application routes share chrome, but the static 404 differs. | **Reopened — blocking** |
| F-1-9 | Home h1 text is exactly `Track backup coverage and restore tests`; no concatenation. | Fixed |
| F-1-10 | Stable-ID merge/replace/conflict/undo flow passed. | Fixed |
| F-1-11 | All ledger fields render and persist in demo storage. | Fixed |
| F-1-12 | Limitation copy and manifest exist; test adequacy is separately F-2-1. | Fixed as copy/manifest scope |
| F-1-13 | DNS sample names missing owner and recovery location. | Fixed |
| F-1-14 | All five proof states render and the interval calculation tests pass. | Fixed |
| F-1-15 | Demo edit/export/reload remained same-origin and in demo storage. | Fixed |
| F-1-16 | CSV/YAML imports and nested-YAML rejection passed. | Fixed |
| F-1-17 | Metadata uses specific export/storage outcomes mapped to tests. | Fixed |
| F-1-18 | `vendor-neutral` and `local-first` jargon are absent from the first screen. | Fixed |
| F-1-19 | README opening is short and links the real demo. | Fixed; terminology polish remains F-2-4 |
| F-1-20 | Field list and field test include owner, target, location, steps, retention, interval, and proof. | Fixed |
| F-1-21 | Safety boundary is explicit; outcome-test weakness is F-2-1. | Fixed as wording scope |
| F-1-22 | Exact current/due/unproven/expired/gap states are rendered and tested. | Fixed |
| F-1-23 | Browser storage, demo namespace, and request behavior were observed. | Fixed |
| F-1-24 | CSV and YAML round trips preserve stable IDs without duplicates. | Fixed |
| F-1-25 | `/drill?demo=1` shows all five asset-specific checklists. | Fixed |
| F-1-26 | Populated demo reloaded under service-worker-controlled offline mode. | Fixed |
| F-1-27 | Broad support marketing was removed; mobile/keyboard/theme/reduced-motion checks exist. | Fixed |
| F-1-28 | Real/demo storage keys and same-origin request behavior were confirmed. | Fixed |
| F-1-29 | IDs, enum values, dates, and interval boundaries are tested. | Fixed |
| F-1-30 | 2,000,000 bytes accepted and 2,000,001 rejected. | Fixed |
| F-1-31 | Runtime resource/request test and live log found no analytics, remote fonts, or third-party scripts. | Fixed for listed wording; extra wording is F-2-2 |
| F-1-32 | Caption now explains that a listed backup is not restore proof. | Fixed |
| F-1-33 | Decorative numbered register label is gone. | Fixed |
| F-1-34 | Summary labels name critical proof, interval proof, and review count. | Fixed |
| F-1-35 | Original ambiguous sample/export/filter controls now use result-naming labels. | Fixed; new import label issue is F-2-3 |
| F-1-36 | Interface distinguishes ledger, asset, target, proof, steps, and interval. | Fixed; README introduction polish is F-2-4 |
| F-1-37 | README opening is 19 words. | Fixed |
| F-1-38 | Audience sentence is 18 words and names the teams. | Fixed |
| F-1-39 | Provenance material is split into three short sentences. | Fixed |
| F-1-40 | First-screen jargon is replaced by concrete facts. | Fixed |
| F-1-41 | Shared-file comparison names adds, updates, skips, replacements, and conflicts. | Fixed |
| F-1-42 | Copy uses `offline after the first visit` and `proof interval`. | Fixed |
| F-1-43 | README gives a concrete export/edit/import instruction. | Fixed |
| F-1-44 | Flat-YAML limits are explicit and tested. | Fixed |
| F-1-45 | Empty state is named `No backup records yet`. | Fixed |
| F-1-46 | Restore drill uses the real `/drill` route with metadata, history, focus, and sitemap entry. | Fixed |
| F-1-47 | External source link is explicitly labelled on application routes; its omission from 404 is included in F-1-8. | Fixed as label scope |

The earlier verification defects were also rechecked:

| Earlier defect | Confirmation | Result |
| --- | --- | --- |
| P1, critical-only 30-day measure | Unit/e2e test retains mixed criticality and live demo reports the critical denominator. | Fixed |
| P2, invalid portable proof dates | CSV/YAML validation and regression tests reject malformed/impossible dates before storage. | Fixed |

## Structure, accessibility, privacy, and crawl

- `/`, `/?demo=1`, `/drill`, `/drill?demo=1`, `/privacy`, and `/terms` return 200. The unknown route returns 404.
- Each route has one h1, one main, `lang=en`, a route-specific title and description, canonical/OG/Twitter metadata, favicon, and touch icon. The social image is 1200×630 in the repository.
- Live Axe WCAG 2 A/AA returned zero violations for every listed route and the 404 at 390 px. The full local Axe matrix also covers dialogs and dark mode.
- `/opt/fleet/lib/verify-url.sh` passed the live home page: no console errors, one h1, one main, no missing alt text, and no unnamed buttons.
- Mobile horizontal overflow was 0 px on all tested routes. Back navigation, focus, and the route live region passed after the render frame.
- All rendered internal links, favicon, touch icon, social image, and the external GitHub source returned 200. `mailto:` links were exempt.
- The live CSP is a response header and limits scripts, styles, connections, and default resources to self; `frame-ancestors 'none'` is correctly in the header.
- The visual identity is distinct: archival paper/grid, serif and monospace pairing, proof-ring geometry, status ink, and original proof-lattice art. It is not a generic SaaS template.
- Structure fails only at the inconsistent static 404 chrome described in F-1-8.

## Missed leverage

No finding. The brief calls for an offline/shared CSV-or-YAML ledger. Stable-ID export/import, comparison, conflicts, replace, undo, and a printable drill cover the obvious sharing and portability leverage. Server sync would change the local-first/privacy model, and AI would add cost, network use, and nondeterminism to a deterministic record-and-checklist job. No decorative AI, provider key, Azure endpoint, or Sociobot runtime call is present.

## Local verification

- `npm ci`: passed; 72 packages audited, zero vulnerabilities.
- All 16 manifest commands: passed individually in a clean clone.
- `npm run check`: passed; 20 unit/structure tests, production build, and 31 Playwright tests passed with one expected desktop-project skip.
- Build output: JS 42.76 kB raw / 13.73 kB gzip; CSS 24.40 kB raw / 6.07 kB gzip; `dist/` produced.
- Live browser probes: no application console/page/failed-request errors on known routes; all observed requests were same-origin.

## What would make this perfect

1. Make the true 404 use exactly the same header/footer contract as every other route and test that parity.
2. Replace the copy-presence-only `free` and `safety-boundary` checks with outcome tests.
3. List and test—or remove—the account, subscription, and advertising claims.
4. Rename `Replace all` to `Replace ledger`.
5. Use `asset` and `Try it with sample data` consistently in the README.

Then rerun every claim command, `npm run check`, the live route/Axe/crawl matrix, demo isolation, and this entire checklist from a fresh context.
