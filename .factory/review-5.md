# Adversarial first-read review 5 — Backup Coverage Ledger

- Date: 2026-08-29
- Reviewed commit: `66d05de0450aa4a2152f49633cfe438998147f25`
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Evidence: fresh Chromium contexts at 390×844 and 1440×900; fresh clone `/tmp/bcl-review-5.b7boKZ`.

## Verdict: PASS

There are **zero findings**. The cold first screen is clear, the isolated demo is useful immediately, all declared claims are exercised, and every earlier finding is actually fixed.

## Thirty-second cold read

At 390×844 before scrolling, I could answer all three required questions:

- It tracks backup coverage and restore tests.
- It is for small IT teams with critical assets.
- Click **Try it with sample data**; `Opens an isolated sample ledger.` says what happens.

The h1, 19-word audience sentence, CTA, and three facts (`Free`, `Works offline after the first visit`, `Stored in this browser`) are visible before scrolling. CTA ends at y=512 and the facts at y=645, with no horizontal overflow. At 1440×900 the same information and the distinct proof-lattice art are visible before scrolling.

## Copy audit

Counting method: whitespace-delimited word tokens containing letters or digits; hyphenated compounds count as one word. The landing set covers its initial empty state, static dialog/import guidance, and useful image alt. Dynamic record values are excluded. No sentence is over 22 words; no jargon, marketing adjective, information-free heading, terminology inconsistency, or non-result-naming action was found.

### Landing sentences

| ID | Words | Exact sentence | Claim/check |
| --- | ---: | --- | --- |
| L1 | 6 | Track backup coverage and restore tests. | h1 |
| L2 | 19 | For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test. | audience |
| L3 | 5 | Opens an isolated sample ledger. | demo-isolation |
| L4 | 1 | Free. | free |
| L5 | 6 | Works offline after the first visit. | offline-reload |
| L6 | 4 | Stored in this browser. | local-only |
| L7 | 7 | A listed backup is not restore proof. | safety-boundary |
| L8 | 9 | Record proof after someone restores and opens representative data. | instruction |
| L9 | 12 | The ledger flags missing owners, backup targets, recovery locations, and restore steps. | missing-fields |
| L10 | 9 | It marks proof expired after each asset’s chosen interval. | proof-statuses |
| L11 | 3 | Keep secrets out. | safety instruction |
| L12 | 5 | Records stay in this browser. | local-only |
| L13 | 6 | Imports and exports run here too. | local-only |
| L14 | 8 | Add the critical asset you would miss first. | instruction |
| L15 | 10 | You can also import a CSV or flat YAML file. | portable-import |
| L16 | 8 | Add its owner, backup target, and recovery location. | instruction |
| L17 | 7 | Restore representative data in an isolated place. | instruction |
| L18 | 8 | Add the date and what your team opened. | instruction |
| L19 | 12 | The ledger does not run backups, open backup systems, or store credentials. | safety-boundary |
| L20 | 8 | Your team performs and checks every restore test. | limitation |
| L21 | 5 | Records use this browser’s storage. | local-only |
| L22 | 13 | Export a file when your team needs to share or archive the ledger. | CSV/YAML/merge |
| L23 | 8 | There is no account, subscription, or paid tier. | free |
| L24 | 4 | Required fields are marked *. | form instruction |
| L25 | 4 | Describe paths, not credentials. | safety instruction |
| L26 | 6 | Proof expires after this many days. | portable-schema/proof-statuses |
| L27 | 10 | Only record this after someone restores and opens representative data. | instruction |
| L28 | 7 | A ledger entry alone is not proof. | safety-boundary |
| L29 | 13 | The file contains 0 new, 0 newer, 0 unchanged, and 0 conflicting assets. | merge-import |
| L30 | 5 | No conflicts need a choice. | import instruction |
| L31 | 11 | Merge adds new assets, updates newer assets, and skips unchanged assets. | merge-import |
| L32 | 7 | Replace ledger removes the current ledger first. | merge-import |
| L33 | 6 | You can undo either action immediately. | merge-import |
| L34 | 10 | Type the asset name to remove it from this browser. | deletion instruction |
| L35 | 14 | Paper geometry links backup folders to restore-proof rings; one red line stops before its ring. | image alt |

The demo adds: `Five sample assets show proof that is current, due soon, never recorded, or expired, plus one coverage gap.` — 18 words. It accurately names four proof conditions and the separate coverage gap.

### README sentences

| ID | Words | Exact sentence | Claim/check |
| --- | ---: | --- | --- |
| R1 | 18 | Backup Coverage Ledger helps small IT teams track each critical asset, its backup, and the latest restore test. | ledger-fields |
| R2 | 10 | Try it with sample data or open the live product. | link instruction |
| R3 | 1 | Free. | free |
| R4 | 5 | No account or paid tier. | free |
| R5 | 17 | For small IT, platform, and operations teams that use several backup tools but lack one shared ledger. | audience |
| R6 | 17 | Records each asset, owner, backup target, recovery location, restore steps, retention, proof interval, and dated restore proof. | ledger-fields |
| R7 | 11 | Shows gaps, unproven assets, due-soon proof, expired proof, and current proof. | proof-statuses |
| R8 | 9 | Stores real and demo ledgers under separate browser keys. | demo-isolation |
| R9 | 11 | Imports and exports CSV and flat YAML records with stable IDs. | CSV/YAML claims |
| R10 | 11 | Compares shared files before adding, updating, skipping, replacing, or resolving conflicts. | merge-import |
| R11 | 7 | Builds a printable, asset-specific restore drill checklist. | restore-drill |
| R12 | 6 | Works offline after the first visit. | offline-reload |
| R13 | 17 | It does not perform backups, access backup systems, handle credentials, or treat documentation as a successful restore. | safety-boundary |
| R14 | 12 | Every statement above maps to an observable browser test in `.factory/claims.json`. | confirmed below |
| R15 | 13 | Open `/?demo=1` or select **Try it with sample data** on the first screen. | demo instruction |
| R16 | 15 | The demo contains five realistic assets and never reads or writes the real ledger key. | demo-isolation |
| R17 | 5 | **Reset demo** restores the sample. | demo-isolation |
| R18 | 5 | **Start for real** discards it. | demo-isolation |
| R19 | 7 | See `.factory/demo.md` for the storage and reset contract. | pointer |
| R20 | 5 | Use Node.js 20 or newer. | run instruction |
| R21 | 5 | Vite prints the local URL. | run instruction |
| R22 | 5 | Data uses that origin’s `localStorage`. | local-only |
| R23 | 5 | Playwright is pinned to 1.58.2. | repository fact |
| R24 | 9 | Run `npx playwright install chromium` if Chromium is missing. | run instruction |
| R25 | 7 | The deploy command is `npm run build`. | verified instruction |
| R26 | 6 | The static deploy root is `dist/`. | verified output |
| R27 | 14 | Export CSV or YAML to get a file you can edit and import again. | CSV/YAML claims |
| R28 | 3 | CSV headers are: | format introduction |
| R29 | 6 | Criticality accepts `critical`, `important`, or `routine`. | portable-schema |
| R30 | 3 | Dates use `YYYY-MM-DD`. | portable-schema |
| R31 | 7 | The proof interval accepts 1–3650 days. | portable-schema |
| R32 | 9 | Imports accept files up to 2,000,000 bytes. | import-limit |
| R33 | 6 | They are parsed in the browser. | local-only |
| R34 | 7 | YAML supports flat records from this app. | portable-import |
| R35 | 9 | Nested YAML, aliases, and block scalars are not supported. | portable-import |
| R36 | 13 | Keep passwords, keys, tokens, recovery codes, and other secrets out of ledger files. | safety instruction |
| R37 | 11 | The app has no analytics, remote fonts, accounts, or third-party scripts. | privacy-runtime |
| R38 | 7 | Read the in-product privacy and terms pages. | link instruction |
| R39 | 7 | The researched scope is in `.factory/brief.json`. | pointer |
| R40 | 10 | The visual system and artwork provenance are in `.factory/design.md`. | pointer |
| R41 | 6 | Release evidence is in `.factory/handoff.md`. | pointer |
| R42 | 9 | Deploy the `dist/` directory with Azure Static Web Apps. | deploy instruction |
| R43 | 1 | MIT. | licence fact |
| R44 | 2 | See `LICENSE`. | pointer |

Headings are useful outside context: `Asset ledger`, `No backup records yet`, `Record restore proof in three steps`, `A record is not a successful restore`, `Your ledger stays local`, and `Use every feature for free`. Actions name outcomes: `Try it with sample data`, `Add asset`, `Import file`, `Export CSV`, `Export YAML`, `Record restore proof`, `Reset demo`, `Start for real`, `Replace ledger`, `Merge file`, and `Print checklist`. Terms stay consistent: **asset**, **ledger**, **backup target**, **restore proof**, **restore steps**, and **proof interval**.

## Demo, claims, and sandbox

- One click from the first CTA opened `/?demo=1` with the persistent `Demo — sample data, nothing is saved to your ledger` banner, **Reset demo**, **Start for real**, sample-ledger h1, summary, and a realistic record in the initial phone viewport.
- The live landing-to-demo request log was same-origin only. Fresh demo storage contained only `demo:backup-coverage-ledger:v1`.
- `@claim:demo-isolation` pre-seeds the real key, edits and resets demo data, leaves demo, and verifies the untouched real record. It also verifies demo-key deletion on exit.
- No CLI or library sandbox applies to this static web product.

All 16 manifest commands were run **separately** in the fresh clone and passed: `demo-isolation`, `ledger-fields`, `missing-fields`, `proof-statuses`, `local-only`, `csv-roundtrip`, `yaml-roundtrip`, `portable-import`, `restore-drill`, `offline-reload`, `import-limit`, `portable-schema`, `privacy-runtime`, `free`, `safety-boundary`, and `merge-import`.

`npm run check` passed: 23 unit/structure tests, a production build to `dist/`, and the full 36-test Playwright suite (`test-results/.last-run.json` is `passed`). Initial JavaScript is 13.74 kB gzip; CSS is 6.07 kB gzip. No live copy claim lacks an applicable manifest entry. The privacy, free, and safety tests exercise actual flows and requests rather than merely checking copy.

## Structure, accessibility, and crawl

- `/`, `/?demo=1`, `/drill?demo=1`, `/privacy?demo=1`, and `/terms?demo=1` return 200. `/review-5-missing` is a designed true 404.
- Routes have `lang=en`, exactly one h1 and main, route-specific title/description/canonical, OG/Twitter data, favicon, touch icon, shared header/footer, and original social art.
- Browser forward and Back from demo Privacy settle on the route h1 and announce `Review a sample backup ledger page loaded`.
- Live Axe WCAG 2 A/AA scans found zero violations on home, demo, drill, privacy, terms, and true 404. Normal routes logged no console errors.
- Internal routes/assets return 200; the labelled source link returns 200; `mailto:` links are intentional. Headers include self-only CSP with `frame-ancestors 'none'`, `nosniff`, and `no-referrer`.
- The paper-ledger/grid, proof-ring marks, serif/monospace pairing, and original proof-lattice art are product-specific rather than a generic SaaS template.

## History verification

All earlier reviews, polish notes, and handoff were read. Each prior finding was rechecked live and against source/tests:

| Earlier ID | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Cold screen names job, audience, action, result, and facts. | Fixed |
| F-1-2 | Five-record isolated demo, reset/discard, real-key preservation. | Fixed |
| F-1-3 | 16 entries, one matching tag each, independently passing. | Fixed |
| F-1-4 | Semantic drill; live Axe clean. | Fixed |
| F-1-5 | Unknown URL is designed HTTP 404. | Fixed |
| F-1-6 | Push/Back focuses h1 and announces. | Fixed |
| F-1-7 | Full per-route metadata and icons present. | Fixed |
| F-1-8 | Static 404 now matches chrome. | Fixed |
| F-1-9 | Home h1 has correct word spacing. | Fixed |
| F-1-10 | Stable-ID compare/conflict/replace/undo pass. | Fixed |
| F-1-11 | All fields, proof date, and notes persist. | Fixed |
| F-1-12 | No-backup/no-credential boundary exercised. | Fixed |
| F-1-13 | Four required-field gaps named. | Fixed |
| F-1-14 | Five status states render. | Fixed |
| F-1-15 | Edit/import/export/reload stay demo-only and same-origin. | Fixed |
| F-1-16 | CSV/YAML work; nested YAML rejects. | Fixed |
| F-1-17 | Metadata uses tested concrete wording. | Fixed |
| F-1-18 | First screen avoids old jargon. | Fixed |
| F-1-19 | README opening and sample CTA are direct. | Fixed |
| F-1-20 | Field list and test cover all fields. | Fixed |
| F-1-21 | Safety limitation remains tested. | Fixed |
| F-1-22 | Status language and behavior consistent. | Fixed |
| F-1-23 | Browser storage/demo namespace observed. | Fixed |
| F-1-24 | CSV/YAML preserve IDs without duplicates. | Fixed |
| F-1-25 | Drill invokes print and has asset-specific checklists. | Fixed |
| F-1-26 | Populated demo reloads offline. | Fixed |
| F-1-27 | Keyboard/mobile/theme/motion/Axe checks remain. | Fixed |
| F-1-28 | Separate keys and same-origin runtime rechecked. | Fixed |
| F-1-29 | Schema, dates, enum, interval boundaries test. | Fixed |
| F-1-30 | Exact import size boundary test passes. | Fixed |
| F-1-31 | No analytics/ads/fonts/accounts/third parties. | Fixed |
| F-1-32 | Caption distinguishes listing from proof. | Fixed |
| F-1-33 | Decorative register label gone. | Fixed |
| F-1-34 | Summary labels name measure/condition. | Fixed |
| F-1-35 | Controls name results. | Fixed |
| F-1-36 | Visitor copy consistently says asset/sample/restore proof. | Fixed |
| F-1-37 | README opening concise. | Fixed |
| F-1-38 | Intended teams named. | Fixed |
| F-1-39 | Provenance concise/documented. | Fixed |
| F-1-40 | Storage/price concrete. | Fixed |
| F-1-41 | Merge outcomes named. | Fixed |
| F-1-42 | Offline/interval wording direct. | Fixed |
| F-1-43 | Export/edit/import instruction present. | Fixed |
| F-1-44 | Flat-YAML limits explicit/tested. | Fixed |
| F-1-45 | Empty state names its content. | Fixed |
| F-1-46 | Drill is a real route with history/sitemap. | Fixed |
| F-1-47 | External source labelled, including 404. | Fixed |
| F-2-1 | Free/safety tests prove workflows, not copy. | Fixed |
| F-2-2 | Account/subscription/advertising claims covered. | Fixed |
| F-2-3 | Destructive action says Replace ledger. | Fixed |
| F-2-4 | README uses asset and exact CTA. | Fixed |
| F-4-1 | Test imports every named missing field. | Fixed |
| F-4-2 | Privacy flow includes import. | Fixed |
| F-4-3 | Print invocation/CSS/layout tested. | Fixed |
| F-4-4 | Schema boundaries and round trip tested. | Fixed |
| F-4-5 | Proof date/notes asserted after reload. | Fixed |
| F-4-6 | Demo state explanation accurate. | Fixed |
| F-4-7 | Unlisted deployment guarantee removed. | Fixed |
| P1 | Critical-only goal/no-critical state remain tested. | Fixed |
| P2 | Impossible dates remain rejected. | Fixed |

## Missed leverage

No finding. The brief implies portable shared files, import/export, merge/conflict handling, and a restore-drill output; all are present and tested. Sync would violate the local-first boundary. AI would not improve this deterministic ledger workflow, and no decorative AI or provider key is present.

## What would make this perfect

Keep the current standard: retain the demo namespace, update claim tests when visitor copy or behavior changes, and repeat this fresh-clone/live-route matrix before release. There is no product change left to request in this round.
