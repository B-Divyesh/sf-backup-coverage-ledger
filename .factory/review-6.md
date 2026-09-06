# Review 6 — track backup coverage and restore tests

- Date: 2026-09-06
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Implementation candidate: `1d5d314f93bdcf934a0c1371800b3e6b33ab9bd9`
- Documentation SHA reviewed: `099ff3ea72b7b5637dd64026e4416369c11bc1df`
- Clean checkout: `/tmp/bcl-review-6.Xd2IcN`
- Browsers: fresh Chromium contexts at 390×844 and 1440×900

## Verdict: FAIL

**FAIL — two major findings remain. There are zero untested claims.**

The ledger's main work, sample sandbox, portable files, restore drill, offline reload, privacy boundary, and route structure pass. The release still fails because a mistyped delete confirmation cannot recover without reloading the page, and several mobile links are smaller than the required 44×44 CSS-pixel touch target.

Finding count: **2**. Untested claim count: **0**.

## First screen

Before scrolling at both sizes, the page answers the required questions in plain words:

- Job: **Track backup coverage and restore tests**.
- Audience: small IT teams responsible for critical assets.
- First action: **Try it with sample data**.
- Result note: **Opens an isolated sample ledger.**

At 390×844, the action ends at y=512 and the three facts end at y=645. At 1440×900, they end at y=666 and y=709. Both views have zero horizontal overflow. Screenshots are `/work/.evidence/review-6/phone-first-screen.png` and `/work/.evidence/review-6/desktop-first-screen.png`.

## Findings

### F-6-1 — Major — Delete confirmation cannot recover from a typo

- Live reproduction: create `Boundary archive`, open **Delete Boundary archive**, enter `wrong`, and select **Delete asset**. The field correctly reports `Type Boundary archive exactly.` Change the field to `Boundary archive` and select **Delete asset** again.
- Result: the field remains invalid, the dialog stays open, and the asset remains. Closing and reopening the dialog does not clear the error. Reloading the page is the only tested recovery; after reload, the correct name deletes the asset and **Undo** restores it.
- Cause: `confirmDelete` sets a custom validity error only inside the submit handler at `src/main.ts:259-265`. Once set, native validation blocks the next submit event, so the same handler cannot clear the stale error. `form.reset()` in `openDeleteDialog` does not clear custom validity.
- Impact: one typing mistake makes deletion unusable for the rest of the page session.
- Required fix: clear the custom validity error on input and when opening the dialog. Add a browser test for wrong value → corrected value → successful deletion → Undo, including close and reopen recovery.
- Evidence: `/work/.evidence/review-6/live-workflow.json`.

### F-6-2 — Major — Mobile navigation links miss the 44×44 touch-target baseline

- Live 390px measurements on the app: the home wordmark is 38×38; **Read the privacy details** is 231.2×19; footer **Privacy**, **Terms**, and **Source on GitHub (external)** links are 17px high.
- The designed 404 also has undersized standalone links. Its header links are 24.8px high and its footer links are 17px high.
- The intentionally hidden file input and the inline privacy email were excluded from this finding.
- Impact: the repeated home, legal, and recovery navigation targets do not meet the attached accessibility and site-structure contract on touch screens.
- Required fix: give the app wordmark and all standalone navigation links a minimum 44×44 hit area. Apply the same rule to `public/404.css`, then add a 390px computed-bounds regression test for normal, demo, legal, and 404 pages.
- Evidence: `/work/.evidence/review-6/live-touch-targets.json`.

## Sample sandbox and product output

The first-screen action entered the demo in one click. The first populated view showed five realistic assets: Customer database, Finance shared drive, Support ticket export, DNS zone records, and Payroll archive. It showed one each of **Proof current**, **Proof due soon**, **Never proven**, **Coverage gap**, and **Proof expired**.

The banner remained visible on the ledger, restore drill, Privacy, and Terms pages. It says **Demo — sample data, nothing is saved to your ledger** and provides **Reset demo** and **Start for real**.

A fresh phone context was pre-seeded with `Real private database` under the real key. Editing the customer sample changed only the demo key. Reset restored the original five samples. Start for real deleted the demo key and showed the unchanged real record. No sample value entered the real key.

The live restore drill contained five asset-specific checklists. **Print checklist** invoked printing; print media hid the header, footer, and page actions and had no horizontal overflow.

## Normal, invalid, boundary, and recovery paths

- Normal: a complete real asset saved and persisted after reload. A valid CSV recovered immediately after a rejected YAML import.
- Invalid: required fields rejected an empty save. Proof interval `0` was rejected. Nested YAML produced a named alert. An incorrect delete confirmation produced a specific error.
- Boundary: proof interval `3650` saved and persisted. The declared claim command also accepted exactly 2,000,000 bytes and rejected 2,000,001 bytes, and covered interval `1`.
- Recovery: malformed import → valid import passed; delete → Undo passed when the first confirmation was correct. Wrong delete confirmation → corrected confirmation failed as F-6-1.

## Declared claims

Every command in `.factory/claims.json` ran separately after `npm ci --include=dev` in the clean checkout. Every command exited 0, and source inspection confirmed that each tagged test exercises its complete wording.

| Claim | Result | Observable check |
| --- | --- | --- |
| `demo-isolation` | PASS | Edit, reset, discard, and real-key preservation |
| `ledger-fields` | PASS | All fields, proof date, notes, storage, and reload |
| `missing-fields` | PASS | Owner, target, location, and restore-step gaps |
| `proof-statuses` | PASS | Current, due, unproven, expired, and gap states |
| `local-only` | PASS | Edit, import, export, reload, storage, and request log |
| `csv-roundtrip` | PASS | Stable IDs and no duplicate rows |
| `yaml-roundtrip` | PASS | Flat YAML stable IDs and no duplicates |
| `portable-import` | PASS | CSV, flat YAML, and nested-YAML rejection |
| `restore-drill` | PASS | Five asset checklists, print call, and print layout |
| `offline-reload` | PASS | Fresh context, cached populated demo, offline reload |
| `import-limit` | PASS | 2,000,000 accepted; 2,000,001 rejected |
| `portable-schema` | PASS | IDs, all criticalities, ISO dates, 1/3650, invalid boundaries |
| `privacy-runtime` | PASS | No analytics, ads, remote fonts, accounts, or third parties |
| `free` | PASS | Feature classes run without account, billing, or payment request |
| `safety-boundary` | PASS | No credential control or backup-system request |
| `merge-import` | PASS | Add, update, skip, conflict, replace, repeat, and Undo |

Claim log: `/work/.evidence/review-6/claim-commands.log`. There are no missing, false, incomplete, or untested public claims.

## Clean-checkout results

From the clean checkout at the documentation SHA:

- `npm ci --include=dev`: PASS; 72 packages audited, 0 vulnerabilities.
- `npm run check`: PASS; 23 unit/structure tests, production build, and 35 browser tests passed with one intended project-only skip.
- `npm audit --omit=dev --audit-level=high`: PASS; 0 vulnerabilities.
- Build output: `dist/index.html` exists. Initial JavaScript is 42.84 kB raw / 13.74 kB gzip. CSS is 24.40 kB raw / 6.07 kB gzip.
- Live mobile Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 930ms, LCP 1080ms, TBT 0ms, CLS 0, total transfer 49,872 bytes.

The first Lighthouse launch lacked its required `CHROME_PATH`, and a second browser process crashed. The documented successful run used Playwright's installed Chromium through `CHROME_PATH`; the completed JSON is `/work/.evidence/review-6/lighthouse-live.json`. These setup attempts are not product results.

## Accessibility, privacy, offline, and routes

- Live Axe WCAG 2 A/AA: zero violations on `/`, `/?demo=1`, `/drill?demo=1`, `/privacy`, `/terms`, the designed 404, the dark treatment, and the phone demo.
- Keyboard: the skip link receives first focus; Enter activates the demo link and edit button; the dialog focuses its first field; Escape returns focus to the trigger. History Back focuses and announces the destination h1.
- Reduced motion: the media query matched and no rendered element had animation or transition longer than 0.02ms or an infinite animation.
- Text at a 200% root size had no horizontal overflow on home, demo, or Privacy. F-6-2 remains the separate touch-target failure.
- Privacy: captured product requests were same-origin. Demo edits and imports remained under `demo:backup-coverage-ledger:v1`; the real key was unchanged. No analytics, advertising, remote font, account, billing, credential, or backup-system request appeared.
- Offline: the live service worker controlled the page, completed an online update check, and reloaded the populated sample while offline with the `Local · offline` label.
- Routes: home, demo, drill, Privacy, and Terms returned 200 with their own titles, one h1, one main, `lang=en`, valid heading order, and canonical metadata. Every rendered link returned 200 or was an intentional `mailto:` link.
- 404: `/review-6-missing` returned HTTP 404 with the product-specific missing-page design and return link. Chromium's document-level `Failed to load resource: 404` line is expected for this deliberate response and is not a defect.
- This is a static product. Backend tenant isolation, restart persistence, health, 429/Retry-After, and installed CLI/library/desktop checks do not apply.

## Live implementation identity

`1d5d314` is the last commit that changes runtime files. `fd28742` changes only a structure test. `66d05de` and `099ff3e` add evidence and review documents. There is no runtime-file diff from `1d5d314` through `099ff3e`.

The clean build matched every publicly served artifact byte-for-byte: index, JavaScript, CSS, source map, service worker, 404 HTML/CSS, icons, robots, sitemap, and all image derivatives. `staticwebapp.config.json` correctly remained non-public with HTTP 404. The live runtime is therefore the reviewed implementation candidate, not a later report-only image.

Evidence: `/work/.evidence/review-6/live-artifact-compare.txt`.

## Earlier finding disposition

Every earlier review, verification, polish note, and handoff was inspected. All earlier findings remain fixed. F-6-1 and F-6-2 are new checks, not unresolved items hidden by an earlier report.

| Earlier ID | Current proof | Disposition |
| --- | --- | --- |
| F-1-1 | Both first screens show job, audience, action, result, and facts. | Fixed |
| F-1-2 | Five-record isolated demo, reset, discard, and real-key preservation passed live. | Fixed |
| F-1-3 | Sixteen entries have one matching tag and sixteen commands pass. | Fixed |
| F-1-4 | Drill semantics and live Axe are clean. | Fixed |
| F-1-5 | Unknown URL is a designed HTTP 404. | Fixed |
| F-1-6 | Navigation and Back focus and announce the h1. | Fixed |
| F-1-7 | Route titles, descriptions, canonicals, icons, and social metadata remain. | Fixed |
| F-1-8 | Static 404 retains shared navigation and footer content. | Fixed |
| F-1-9 | Home has one correctly spaced h1. | Fixed |
| F-1-10 | Stable-ID compare, conflict, replace, repeat, and Undo pass. | Fixed |
| F-1-11 | All record fields, proof date, and notes persist. | Fixed |
| F-1-12 | No-backup and no-credential boundary is explicit and exercised. | Fixed |
| F-1-13 | Four named missing-field states are tested. | Fixed |
| F-1-14 | All five proof and gap states render. | Fixed |
| F-1-15 | Edit, import, export, and reload remain demo-only and same-origin. | Fixed |
| F-1-16 | CSV and flat YAML work; nested YAML rejects. | Fixed |
| F-1-17 | Metadata uses concrete tested outcomes. | Fixed |
| F-1-18 | First-screen jargon remains removed. | Fixed |
| F-1-19 | README opens with the job and exact sample action. | Fixed |
| F-1-20 | README and test cover the complete field list. | Fixed |
| F-1-21 | Safety limitation remains explicit and tested. | Fixed |
| F-1-22 | Status words and calculations agree. | Fixed |
| F-1-23 | Browser storage and separate demo namespace were observed. | Fixed |
| F-1-24 | CSV/YAML preserve IDs without duplicates. | Fixed |
| F-1-25 | Live drill invokes print and contains asset-specific checklists. | Fixed |
| F-1-26 | Populated demo reloads offline. | Fixed |
| F-1-27 | Old bundled README claim remains removed; keyboard, mobile layout, themes, motion, and Axe checks pass. F-6-2 is a new target-size measurement. | Fixed as scoped |
| F-1-28 | Separate real/demo keys and same-origin behavior passed live. | Fixed |
| F-1-29 | IDs, criticalities, dates, and interval boundaries pass. | Fixed |
| F-1-30 | Exact import-size boundary passes. | Fixed |
| F-1-31 | Runtime excludes analytics, ads, remote fonts, accounts, and third parties. | Fixed |
| F-1-32 | Caption plainly distinguishes a listed backup from proof. | Fixed |
| F-1-33 | Decorative register label remains absent. | Fixed |
| F-1-34 | Summary labels name their measure and condition. | Fixed |
| F-1-35 | Main controls name their results. | Fixed |
| F-1-36 | Visitor copy consistently uses asset, ledger, sample, and restore proof. | Fixed |
| F-1-37 | README opening remains within the word limit. | Fixed |
| F-1-38 | Intended teams remain named. | Fixed |
| F-1-39 | Provenance remains concise and documented. | Fixed |
| F-1-40 | Storage and price wording remains concrete. | Fixed |
| F-1-41 | Shared-file outcomes remain named. | Fixed |
| F-1-42 | Offline and interval wording remains direct. | Fixed |
| F-1-43 | Export, edit, and import instructions remain concrete. | Fixed |
| F-1-44 | Flat-YAML limits remain explicit and tested. | Fixed |
| F-1-45 | Empty state names its content and next action. | Fixed |
| F-1-46 | Drill remains a real deep-linkable route with history. | Fixed |
| F-1-47 | External source link remains labelled on app and 404. | Fixed |
| F-2-1 | Free and safety tests exercise workflows, not only copy. | Fixed |
| F-2-2 | Account, subscription, and advertising wording is covered. | Fixed |
| F-2-3 | Destructive import action says Replace ledger. | Fixed |
| F-2-4 | README uses asset and the exact sample action. | Fixed |
| F-4-1 | Test imports every named missing field. | Fixed |
| F-4-2 | Privacy flow includes an imported record. | Fixed |
| F-4-3 | Print invocation, print CSS, and layout pass locally and live. | Fixed |
| F-4-4 | Full schema boundaries and round trip pass. | Fixed |
| F-4-5 | Proof date and notes persist after reload. | Fixed |
| F-4-6 | Demo introduction accurately separates proof states and a coverage gap. | Fixed |
| F-4-7 | Unlisted deployment guarantee remains removed. | Fixed |
| P1 | Critical-only 30-day goal and no-critical state pass. | Fixed |
| P2 | Malformed and impossible dates are rejected before storage. | Fixed |

## Missing feature check

No additional feature finding. The brief's useful sharing work is covered by portable CSV/YAML, stable-ID comparison, conflict choices, replacement, Undo, and printable restore drills. Server sync would weaken the stated local-only boundary. Model-generated output would not improve this deterministic ledger and checklist job.

## Required next work

Fix F-6-1 and F-6-2, add the named regression tests, deploy the new runtime, then rerun the wrong-confirmation recovery and 390px touch-target measurements. A later review can declare PASS only after both findings are absent and all claim commands still pass.
