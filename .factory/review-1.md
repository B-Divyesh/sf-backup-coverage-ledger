# Adversarial first-read review 1 — Backup Coverage Ledger

- Date: 2026-08-28
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Reviewed commit: `99534befe6a3650c9b32fb9a303b7459c24f066e`
- Viewports: 390×844 and 1440×900, fresh Chromium contexts
- Verdict: **FAIL**

## Verdict

The product is not acceptable in this round. There are **five blocking findings**, including no isolated sample-data demo, no claims manifest or claim-tagged tests, a serious Axe failure on the restore-drill route, and no real 404. There are also unlisted claims, incomplete route metadata/focus behavior, and copy defects. A PASS requires zero findings and no untested claim.

## Thirty-second cold read

### 390px, before scrolling

The first viewport showed the navigation, artwork, the label `Vendor-neutral · local-first`, the headline `Know what can actually be restored.`, the two-sentence explanation, and part of `Add first asset`. The `Load an example` action began at y=866.5, below the 844px viewport.

- What it does: I inferred that it records critical assets, backup locations, recovery instructions, and dated evidence. This is reasonably clear.
- For whom: I could not identify the intended user. The exact text `Map each critical asset to its owner, backup target, recovery path, and a dated extraction proof.` names data fields, not the small IT/operations team in the brief.
- What to click first: the blue `Add first asset` appears primary, although it is partly below the fold. The sample-data path is not visible.

This fails the mandatory first-screen test because all three answers are not available in one screen.

### Desktop, before scrolling

The same explanation was visible, with both `Add first asset` and `Load an example`.

- What it does: records backup coverage and restore evidence.
- For whom: still unstated.
- What to click first: visually, `Add first asset`; the page does not identify the sample path as the recommended first action or say what either action will show.

The desktop view therefore also fails the audience requirement.

## Findings

### Blocking

#### F-1-1 — The first screen does not say who the product is for

- Location/quote: hero, `Vendor-neutral · local-first` and `Map each critical asset to its owner, backup target, recovery path, and a dated extraction proof. The ledger documents evidence—it does not run or verify backups.`
- Evidence: neither sentence names a small IT, platform, engineering, or operations team. At 390×844, `Load an example` is also below the fold at y=866.5.
- Impact: a cold visitor can infer the data model but cannot confirm that this is for their situation. The phone view also hides the try-first action.
- Fix: put the copy before the mobile artwork. Use `Track backup coverage and restore tests` as the headline and `For small IT teams that need one record of each critical data set, its backup, owner, and latest restore test.` as the one supporting sentence. Make `Try it with sample data` the primary action and add `Opens an isolated example ledger` beside it. Show three facts: `Free`, `Works offline after the first visit`, and `Stored in this browser`.

#### F-1-2 — The sample path is not a demo sandbox

- Location/quote: hero button `Load an example`; `src/main.ts:331-335`.
- Evidence: one click loads one `Customer database` record, but writes it to the real `backup-coverage-ledger:v1` key. There is no `Demo — sample data, nothing is saved` banner, `Reset demo`, or `Start for real`. `/demo` and `?demo=1` both read a pre-seeded real record named `Real private database`. The required `.factory/demo.md` is absent. On 390px after the click, the sample record starts at y=911.3 and is not visible in the first 844px viewport.
- Impact: a visitor cannot safely explore without mixing example content into real data. The documented verifier entry point does not exist, and the first post-click screen does not show the sample record in use.
- Fix: implement `/demo` or `?demo=1` with a separate `demo:` storage namespace and a realistic multi-record ledger containing current, due, unproven, and gap states. Keep the banner and its two actions visible on every demo screen. Reset must restore the seed. Leaving demo must discard demo data without reading or writing the production key. Scroll or arrange the post-click view so the sample records are immediately visible. Document all of this in `.factory/demo.md` and test isolation against a pre-seeded real ledger.

#### F-1-3 — The required claims ledger and claim tests do not exist

- Location: `.factory/claims.json` and every `@claim:` test.
- Evidence: `.factory/claims.json` is absent and repository search finds no `@claim:` tags. There were therefore zero listed claim commands to run. `npm run check` passes, but it is not a substitute for the required claim-to-test mapping.
- Impact: privacy, offline, import/export, responsive-use, and calculation statements cannot be audited from the promised clean demo entry point. Every claim remains untested under the claims contract.
- Fix: add `.factory/claims.json`; give every retained claim exactly one observable `@claim:<id>` test running from the isolated demo; remove any sentence that cannot be tested. The individual unlisted claims are F-1-11 through F-1-31.

#### F-1-4 — The restore-drill route has a serious accessibility failure

- Location/quote: `/#drill`, `<strong class="write-line" aria-label="Blank line for operator name"></strong>` (`src/main.ts:371`).
- Evidence: live `@axe-core/playwright` WCAG 2 A/AA scan returns `aria-prohibited-attr`, impact `serious`: `aria-label attribute cannot be used on a strong with no valid role attribute.` The existing Axe loop covers only `/`, `/privacy`, and `/terms` (`tests/e2e/app.spec.ts:32-44`).
- Impact: the accessible name is attached to an element that cannot use it, and the current test suite incorrectly reports route-wide accessibility coverage.
- Fix: use a semantic labelled form control or remove the prohibited label and provide an adjacent text label. Add `/#drill`, demo, 404, populated, empty, and dialog states to the Axe test matrix.

#### F-1-5 — Unknown URLs render the home page with status 200

- Location: `/does-not-exist-review-1`; `public/staticwebapp.config.json:2-4`; route fallback in `src/main.ts:75-80`.
- Evidence: the unknown URL returned 200 with the home title and `Know what canactually be restored.` h1. There is no 404 asset, route, response override, or 404 sitemap/deployment handling.
- Impact: mistyped and stale links look valid, mislead users, and cannot be distinguished by crawlers or support tooling. This is broken routing under the site-structure contract.
- Fix: add a designed product-specific 404 page with a return action, route unknown client paths to it, and add the Static Web Apps `responseOverrides.404.rewrite` configuration without combining `rewrite` and `statusCode` in one route entry. Add a deployed response test.

### Major

#### F-1-6 — SPA navigation does not move or announce focus

- Location: links handled in `src/main.ts:408-416`; `popstate` at `src/main.ts:472`.
- Evidence: after opening Privacy and after browser Back, `document.activeElement` was `BODY`, not the new h1. No route-announcement live region exists.
- Impact: keyboard and screen-reader users are not told that navigation occurred or where the new page begins.
- Fix: after every push, pop, and hash route render, focus a temporarily focusable h1 and update a persistent `aria-live="polite"` route announcer. Add forward/back/focus tests.

#### F-1-7 — Required metadata is incomplete

- Location: `index.html:6-9` and every live route.
- Evidence: the title pattern, lang, theme color, description, and SVG favicon exist. Canonical links, Open Graph fields, Twitter card fields, a 1200×630 product image, and a 180px Apple touch icon are absent. Policy and drill routes reuse the home description and have no route-specific canonical data.
- Impact: shared links and indexed routes lack stable route identity and product-specific previews.
- Fix: render route-specific canonical/title/description metadata, add complete OG/Twitter fields and original 1200×630 artwork, and ship a 180px Apple touch icon. Test every route, including demo and 404.

#### F-1-8 — The standard landing skeleton and global chrome are incomplete

- Location: landing page, header, and footer.
- Evidence: there is no `How it works` three-step section, no explicit product-limitations/privacy section in the required order, and no dedicated free-price section. The header omits Demo and Privacy. The footer omits `Built by Param Factory` and a version/build id (`src/main.ts:61-72`, `404-405`).
- Impact: visitors must infer the workflow and boundaries from scattered interface text, while expected navigation and release identity are unavailable.
- Fix: add the required sections after the live preview, include `Demo` and `Privacy` within the four-link header limit, and add factory attribution plus a build id to every footer.

#### F-1-9 — The home h1 concatenates two words in the DOM

- Location/quote: `<h1>Know what can<br><em>actually</em> be restored.</h1>` (`src/main.ts:89`).
- Evidence: live `textContent` and route tests return `Know what canactually be restored.`
- Impact: copy, assistive technology, and automated summaries can expose `canactually` as one word.
- Fix: add a literal space around the `<br>` boundary or wrap each visual line so the accessible text remains `Know what can actually be restored.` Add an accessible-name assertion.

#### F-1-10 — The implied shared-file workflow only appends duplicates

- Location: brief `offline/shared YAML-or-CSV ledger`; imports at `src/main.ts:338-349`; exported columns in `src/portable.ts` omit record ids.
- Evidence: every import prepends new records. Exports omit stable ids, so importing an updated shared file cannot update or reconcile an existing record and repeat imports duplicate the ledger. The current handoff also names the lack of merge/conflict handling as a gap.
- Impact: teams cannot safely exchange and re-import the shared ledger described by the opportunity without manual duplicate cleanup.
- Fix: export stable record ids and offer a pre-import comparison with `Add new`, `Update changed`, `Skip unchanged`, and explicit conflict choices. Keep a replace-all option with a preview and undo. Test repeat import, updates, conflicts, and rollback. AI is not needed for this product; deterministic merge is the missed leverage.

#### F-1-46 — Restore drill is a hash-routed page, not an in-page anchor

- Location: `/#drill`, `src/main.ts:79`, and the `hashchange` renderer at `src/main.ts:473`.
- Evidence: selecting Restore drill replaces the whole main page, title, and h1. It is therefore a real place, not an anchor within the ledger page, but it has no `/drill` URL or sitemap entry.
- Impact: route semantics, indexing, metadata, and navigation tests treat a page as a fragment.
- Fix: move it to `/drill`, add it to `sitemap.xml` and the service-worker shell, set route metadata, and retain hashes only for actual in-page anchors.

### Unlisted claims

Each row is a separate finding. All are unlisted because `.factory/claims.json` is absent.

| ID | Exact quote/location | Why it is unverified | Concrete fix |
| --- | --- | --- | --- |
| F-1-11 | Landing: `Map each critical asset to its owner, backup target, recovery path, and a dated extraction proof.` | Describes the core record behavior. | Add `@claim:ledger-fields` from demo data and assert all named fields render and persist in the demo namespace. |
| F-1-12 | Landing: `The ledger documents evidence—it does not run or verify backups.` | States a relied-on safety boundary. | Add a safety-boundary entry and a source/network test proving the demo has no backup-system request path, or reduce the copy to an explicitly documented limitation. |
| F-1-13 | Landing: `Required paths are checked automatically.` | It implies path validation, while code checks only required field presence. | Rewrite to `The ledger flags missing owners, backup targets, recovery locations, and restore steps.` Add `@claim:missing-fields`. |
| F-1-14 | Landing: `Proof expires on each asset’s cadence.` | Promises date/status calculation. | Rewrite `The ledger marks proof expired after each asset’s chosen interval.` Add boundary tests under `@claim:proof-expiry`. |
| F-1-15 | Landing: `Everything stays in this browser until you export it.` | Privacy claim. Live requests were first-party-only, but no claim test exists and the demo is not isolated. | Add `@claim:local-only` covering the complete demo flow, request log, storage namespace, reload, and export. |
| F-1-16 | Landing: `You can also import the portable CSV or YAML format.` | Import-format claim. | Add `@claim:portable-import` for both formats from demo data, including visible records and rejected malformed files. |
| F-1-17 | Meta description: `A private, portable ledger for backup coverage and restore proof.` | `Private` and `portable` are product promises. | Replace adjectives with tested outcomes, for example `Record backup owners, locations, and restore proof in a browser ledger that exports CSV and YAML.` Map it to local-only/export tests. |
| F-1-18 | Landing/footer: `Vendor-neutral · local-first` and `Local-first and free` | Provider independence, storage, and price are claims. | Remove `vendor-neutral` unless a concrete compatibility test defines it. Add exact `Free` and `Stored in this browser` facts with tagged tests. |
| F-1-19 | README: `Backup Coverage Ledger is a free, vendor-neutral inventory for small teams that need to know which critical data sets are covered and whether anyone has actually extracted them.` | Core capability, price, and compatibility claims are combined. | Use the F-1-37 rewrite, remove `vendor-neutral`, and map the retained behavior to ledger-fields and free claims. |
| F-1-20 | README: `It links each asset to an owner, backup target, recovery location, extraction method, retention policy, and dated restore proof.` | Field-linking claim. | Cover all fields in `@claim:ledger-fields`. |
| F-1-21 | README: `It does not perform backups, handle credentials, or treat documentation as proof of a successful restore.` | Safety/non-goal claim. | Map to the safety-boundary test and retain the explicit proof warning assertion. |
| F-1-22 | README: `Calculates coverage gaps, never-proven assets, due-soon proofs, and expired proofs.` | Four computed-status claims. | Add one tagged status-boundary test with realistic demo records for every state. |
| F-1-23 | README: `Stores the ledger locally in the browser—no account or application database.` | Storage/privacy claim. | Add `@claim:local-storage` and request-log coverage using the isolated demo. |
| F-1-24 | README: `Imports and exports portable CSV and a deliberately simple YAML subset.` | Two observable file claims. | Add separate CSV/YAML import-export round-trip claims, or split the sentence so each has one test. |
| F-1-25 | README: `Generates a printable, asset-specific restore drill checklist.` | Output-generation claim. | Add `@claim:restore-drill` asserting each demo record and its restore steps appear in print output. |
| F-1-26 | README: `Works after the app shell has been cached for offline use.` | Offline claim. Manual live evidence passed, but it is unlisted. | Add `@claim:offline-reload` using demo data, a first load, `context.setOffline(true)`, and a successful populated reload. |
| F-1-27 | README: `Supports keyboard use, 390px screens, light/dark themes, and reduced motion.` | Four broad accessibility/responsive claims are bundled; current tests cover only a subset. | Split into testable claims. Cover complete keyboard workflows, 390px populated/dialog/drill states, both themes, and computed reduced-motion behavior. |
| F-1-28 | README: `Data is stored in that origin’s localStorage.` | Exact storage claim. | Map to `@claim:local-storage`, including separate demo and real keys. |
| F-1-29 | README: `Criticality is critical, important, or routine; dates use YYYY-MM-DD; proof cadence is 1–3650 days.` | File-schema and validation claim. | Add one tagged portable-schema boundary test or split into three independently tagged claims. |
| F-1-30 | README: `Imports are limited to 2MB and parsed entirely in the browser.` | Quantitative and privacy claim. | Add `@claim:import-limit` at 2,000,000/2,000,001 bytes and include import in the request-log privacy test. |
| F-1-31 | README: `The app has no analytics, third-party scripts, remote fonts, accounts, or server-side ledger storage.` | Broad privacy/architecture claim. | Add a build/runtime audit test for remote assets and outgoing requests; split or narrow anything the test cannot prove. |

### Copy, terminology, and control labels

#### F-1-32 — The hero caption is slogan-shaped and uses inconsistent concepts

- Quote: `A copy is coverage. An extraction is proof.`
- Impact: `copy` is not the interface term `backup target`, and `extraction` is not consistently the same as `restore proof`. The slogan can be read as saying any copy constitutes sufficient coverage.
- Fix: `A listed backup is not restore proof. Record proof only after someone restores and opens representative data.`

#### F-1-33 — `01 / coverage register` is decorative and conflicts with `Asset ledger`

- Location: section label immediately above `Asset ledger`.
- Impact: numbering and a second product term add no navigation value.
- Fix: delete `01 / coverage register`; keep `Asset ledger`.

#### F-1-34 — Summary labels do not make sense independently

- Quotes: `30-day goal`, `Current proof`, `Needs review`.
- Impact: the labels do not name the denominator or condition and depend on small helper copy.
- Fix: use `Critical assets proved in 30 days`, `Proof within each interval`, and `Assets with gaps or stale proof`.

#### F-1-35 — Several buttons do not name their result

- Quotes: `Load an example`, `CSV`, `YAML`, and filter buttons `All`, `Gaps`, `Unproven`, `Expired`, `Due soon`, `Current`.
- Impact: the sample button does not disclose sandbox behavior; export buttons are nouns; filter buttons do not say they change the view.
- Fix: use `Try it with sample data`, `Export CSV`, `Export YAML`, `Show all`, `Show gaps`, `Show unproven`, `Show expired`, `Show due soon`, and `Show current`. Existing `Add asset`, `Import file`, `Save asset`, `Record proof`, and `Print checklist` pass.

#### F-1-36 — The same concepts use too many names

- Evidence: `inventory` / `ledger` / `coverage register`; `copy` / `backup target`; `extraction proof` / `restore proof` / `restore evidence` / `extraction evidence`; `cadence` / `proof cadence` / `30-day goal`; `asset` / `data set` / `record`.
- Impact: users must decide whether these are synonyms or different states.
- Fix: use `ledger`, `backup target`, `restore proof`, `proof interval`, and `asset` consistently. Define `asset` once as a critical data set.

#### F-1-37 — The README opening sentence exceeds 22 words and combines three ideas

- Quote/count: `Backup Coverage Ledger is a free, vendor-neutral inventory for small teams that need to know which critical data sets are covered and whether anyone has actually extracted them.` — 28 words.
- Fix: `Backup Coverage Ledger helps small IT teams track each critical data set, its backup, and the latest restore test.` — 19 words. Put `Free` on its own line and remove unproved `vendor-neutral`.

#### F-1-38 — The README audience sentence exceeds 22 words

- Quote/count: `Small operations, platform, IT, and engineering teams that use several backup tools but lack one human-readable view of ownership, coverage, and restore evidence.` — 23 words.
- Fix: `For small IT, platform, and operations teams that use several backup tools but lack one shared ledger.` — 17 words.

#### F-1-39 — The README provenance sentence exceeds 22 words

- Quote/count: `The researched scope is in .factory/brief.json, the product-specific visual system and original artwork provenance are in .factory/design.md, and release verification is in .factory/handoff.md.` — 23 words.
- Fix: split it: `The researched scope is in .factory/brief.json. The visual system and artwork provenance are in .factory/design.md. Release evidence is in .factory/handoff.md.`

#### F-1-40 — `Vendor-neutral` and `local-first` are unexplained first-screen jargon

- Location: `Vendor-neutral · local-first`.
- Impact: a phone visitor has to translate architecture labels before learning the audience and first action.
- Fix: replace them with the plain facts `Works with any backup provider` only if tested, and `Stored in this browser`.

#### F-1-41 — `human-readable view` is vague README copy

- Location: README `Who it is for`.
- Impact: it does not say what the team can do with the view.
- Fix: use the F-1-38 rewrite ending in `one shared coverage record`.

#### F-1-42 — `app shell` and `cadence` are avoidable jargon

- Quotes: `Works after the app shell has been cached for offline use.` and `Proof expires on each asset’s cadence.`
- Impact: these terms describe implementation rather than user-observable behavior.
- Fix: `Works offline after the first visit.` and `The ledger marks proof expired after each asset’s chosen interval.`

#### F-1-43 — `canonical template` is developer language in user instructions

- Quote: `Use the app’s export actions to produce a canonical template.`
- Impact: it does not say what the file is for.
- Fix: `Export CSV or YAML to get a file you can edit and import again.`

#### F-1-44 — `deliberately simple YAML subset` is vague and self-congratulatory

- Quote: `Imports and exports portable CSV and a deliberately simple YAML subset.`
- Impact: it does not state the actual limitation.
- Fix: `Imports and exports CSV and flat YAML records. Nested YAML, aliases, and block scalars are not supported.`

#### F-1-45 — The empty-state heading does not name the section

- Quote: `Start with the asset you’d miss first.`
- Impact: it is an instruction used as a heading rather than a state name.
- Fix: heading `No backup records yet`; body `Add the critical data set you would miss first.`

#### F-1-47 — The external source link is not identified as external

- Location/quote: footer link `Source` to GitHub.
- Impact: the label does not tell users that it leaves the product site.
- Fix: label it `Source on GitHub (external)` or add an equivalent visible and accessible external-link indicator.

## Complete copy audit

Counts use whitespace-delimited tokens containing a letter or number; hyphenated compounds count as one word. No banned plain-words terms were found. Flags point to findings above.

### Landing page sentences

This covers the cold empty landing route and its attached asset/proof dialog help text.

| # | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 6 | Know what can actually be restored. | F-1-9 DOM spacing |
| L2 | 16 | Map each critical asset to its owner, backup target, recovery path, and a dated extraction proof. | F-1-11, F-1-36 |
| L3 | 10 | The ledger documents evidence—it does not run or verify backups. | F-1-12 |
| L4 | 4 | A copy is coverage. | F-1-32 |
| L5 | 4 | An extraction is proof. | F-1-32 |
| L6 | 5 | Required paths are checked automatically. | F-1-13 |
| L7 | 6 | Proof expires on each asset’s cadence. | F-1-14, F-1-42 |
| L8 | 3 | Keep secrets out. | — |
| L9 | 11 | Record locations and procedures, never passwords, keys, tokens, or recovery codes. | — |
| L10 | 9 | Everything stays in this browser until you export it. | F-1-15 |
| L11 | 7 | Start with the asset you’d miss first. | F-1-45 |
| L12 | 9 | Add a database, shared drive, or service data set. | F-1-36 terminology |
| L13 | 10 | You can also import the portable CSV or YAML format. | F-1-16 |
| L14 | 4 | Required fields are marked *. | — |
| L15 | 4 | Describe paths, not credentials. | — |
| L16 | 8 | Proof is marked expired after this many days. | — |
| L17 | 10 | Only record this after someone extracted and opened representative data. | F-1-36 terminology |
| L18 | 7 | A ledger entry alone is not proof. | — |

### README sentences

| # | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 28 | Backup Coverage Ledger is a free, vendor-neutral inventory for small teams that need to know which critical data sets are covered and whether anyone has actually extracted them. | F-1-19, F-1-37, F-1-40 |
| R2 | 19 | It links each asset to an owner, backup target, recovery location, extraction method, retention policy, and dated restore proof. | F-1-20, F-1-36 |
| R3 | 3 | Live product: backup-coverage-ledger.sociobot.in | — |
| R4 | 16 | It does not perform backups, handle credentials, or treat documentation as proof of a successful restore. | F-1-21 |
| R5 | 23 | Small operations, platform, IT, and engineering teams that use several backup tools but lack one human-readable view of ownership, coverage, and restore evidence. | F-1-38, F-1-41 |
| R6 | 10 | Calculates coverage gaps, never-proven assets, due-soon proofs, and expired proofs. | F-1-22, F-1-36 |
| R7 | 11 | Stores the ledger locally in the browser—no account or application database. | F-1-23 |
| R8 | 11 | Imports and exports portable CSV and a deliberately simple YAML subset. | F-1-24, F-1-44 |
| R9 | 7 | Generates a printable, asset-specific restore drill checklist. | F-1-25 |
| R10 | 11 | Works after the app shell has been cached for offline use. | F-1-26, F-1-42 |
| R11 | 10 | Supports keyboard use, 390px screens, light/dark themes, and reduced motion. | F-1-27 |
| R12 | 18 | Keep passwords, access keys, tokens, recovery codes, and other secret material out of the ledger and exported files. | — |
| R13 | 5 | Requires Node.js 20 or newer. | — |
| R14 | 5 | Vite prints the local URL. | — |
| R15 | 7 | Data is stored in that origin’s localStorage. | F-1-28 |
| R16 | 5 | Playwright is pinned to 1.58.2. | — |
| R17 | 14 | If its Chromium binary is not already available, run npx playwright install chromium once. | — |
| R18 | 9 | The exact deployment build command is npm run build. | — |
| R19 | 11 | The static deploy root is dist/, with dist/index.html at its root. | — |
| R20 | 11 | public/staticwebapp.config.json supplies Azure Static Web Apps navigation fallback and security headers. | — |
| R21 | 10 | Use the app’s export actions to produce a canonical template. | F-1-43 |
| R22 | 3 | CSV headers are: | — |
| R23 | 14 | Criticality is critical, important, or routine; dates use YYYY-MM-DD; proof cadence is 1–3650 days. | F-1-29, F-1-42 |
| R24 | 11 | Imports are limited to 2MB and parsed entirely in the browser. | F-1-30 |
| R25 | 14 | The app has no analytics, third-party scripts, remote fonts, accounts, or server-side ledger storage. | F-1-31 |
| R26 | 7 | See the in-product /privacy and /terms routes. | — |
| R27 | 23 | The researched scope is in .factory/brief.json, the product-specific visual system and original artwork provenance are in .factory/design.md, and release verification is in .factory/handoff.md. | F-1-39 |
| R28 | 1 | MIT. | — |
| R29 | 2 | See LICENSE. | — |

### Heading and button audit

- README headings are literal and understandable out of context. `Privacy and design` combines two topics but still names both.
- Landing headings that pass: `Know what can actually be restored`, `Asset ledger`, `No records yet`, `Add asset`, and `Record restore proof`.
- Landing heading/label failures: `01 / coverage register` (F-1-33), `30-day goal`, `Current proof`, `Needs review` (F-1-34), and `Start with the asset you’d miss first` (F-1-45).
- Button failures and rewrites are in F-1-35. Icon-only theme and close buttons have result-naming accessible labels and pass.

### Terminology table

| Concept | Terms found | Use consistently |
| --- | --- | --- |
| Product data | inventory, coverage register, ledger | ledger |
| Tracked item | critical data set, asset, record | asset; define it once as a critical data set |
| Backup destination | copy, backup, backup target | backup target |
| Evidence | extraction proof, restore proof, restore evidence, extraction evidence | restore proof |
| Review schedule | cadence, proof cadence, interval, 30-day goal | proof interval; reserve 30-day measure for the success metric |

## Demo, privacy, offline, and request evidence

- One click on `Load an example` produced one realistic record and a 100% summary, but the record was below the first mobile viewport.
- The click changed real local storage from empty to `backup-coverage-ledger:v1` containing the sample.
- No demo banner or demo controls appeared.
- `/demo` and `?demo=1` returned 200 home views and displayed an existing real record, proving there is no isolated namespace.
- During the sample and offline flows, every observed request was same-origin: HTML, built JS/CSS, and the product artwork. No analytics, remote font, third-party script, or AI request appeared.
- After an initial online load and service-worker control, a 390px offline reload retained `Customer database`, showed `Local · offline`, and produced no console errors. This confirms the current offline behavior manually, but F-1-26 remains because the claim is unlisted and not run from an isolated demo.
- Source inspection found no decorative AI feature, provider key, Azure endpoint, or Sociobot runtime call. No AI feature is warranted by the brief; deterministic shared-file merge is the useful missing capability (F-1-10).

## Claims run

`.factory/claims.json` does not exist, so there were no listed claim tests to execute. This is not a pass or a vacuous success; it is blocking F-1-3. The repository's untagged checks were run separately from a clean clone and are recorded below.

## History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files existed before this review.

The earlier verification and handoff contain two prior defects. Both are genuinely fixed:

| Earlier id | Live verification | Code/test verification | Result |
| --- | --- | --- | --- |
| P1, critical-only 30-day metric | Imported one current critical record plus one unproven routine record; live summary showed `100%` and `Target met · critical assets`. | `successCoverage` filters the numerator and denominator to critical records; clean-clone unit/e2e tests pass. | Fixed |
| P2, impossible portable dates | Imported YAML with `2026-02-30`; live error named YAML record 1 and `lastProofDate`, no record persisted, and the real storage key remained absent. | CSV/YAML call real-calendar validation before record creation; clean-clone unit/e2e tests pass. | Fixed |

No prior finding is reopened.

## Structure, crawl, identity, and accessibility evidence

- Titles pass on `/`, `/privacy`, `/terms`, and `/#drill`; each has one h1 and one main.
- Live Axe found no violations on `/`, `/privacy`, or `/terms`; `/#drill` failed with the serious violation in F-1-4.
- The home and policy/drill deep links return 200. Browser Back restores the URL and route but not focus (F-1-6).
- All rendered anchor targets crawled successfully: `/`, `/#main`, `/#drill`, `/privacy`, `/terms`, and the GitHub source link returned 200. `mailto:` contacts were exempt.
- Security headers are configured as response headers, including `frame-ancestors 'none'`; no CSP console errors appeared.
- At 390px, measured horizontal overflow was 0px.
- The paper ledger, proof-lattice geometry, serif/monospace pairing, blue/green/red proof marks, and original illustration form a distinct product identity. It does not look like a generic gradient SaaS template.

## Clean-clone verification

Run from a fresh local clone of commit `99534befe6a3650c9b32fb9a303b7459c24f066e`:

| Command | Result |
| --- | --- |
| `npm ci` | Passed; 72 packages audited, 0 vulnerabilities |
| `npm test` | Passed; 14/14 tests |
| `npm run build` | Passed; `dist/` produced; JS 33.04kB raw / 11.36kB gzip |
| `npm run test:e2e` | 9 passed, 1 expected desktop skip |
| `npm run check` | Passed |

The passing gate does not cover the missing demo/claims contracts, unknown-route behavior, route focus, metadata, or restore-drill Axe failure.

## What would make this perfect

There is no optional polish list in this round. To reach the owner's `nothing left to do` standard, close every finding above, then rerun the review from a fresh context and clean clone. The decisive end state is: a phone visitor sees the audience and isolated sample action immediately; the first demo viewport shows a realistic ledger; demo and real storage cannot interact; every retained claim has one passing demo-based test; all routes, including drill/demo/404, pass Axe and metadata checks; unknown URLs are real 404s; shared file updates merge without duplication; and the copy audit contains no flags.
