# Independent verification 3 — Backup Coverage Ledger

- Work order: `backup-coverage-ledger-verify-3`
- Date: 2026-09-06
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Implementation candidate: `38dfb4c1b9a5abc47b8f066322e04a089a087941`
- Documentation candidate: `80a42000f1c2bcb7c6644f0997900605ceb2ac1e`

## Verdict

**PASS — 0 findings and 0 untested claims.** The deployed static product is the reviewed implementation and completes the job: small IT, platform, and operations teams can keep a local browser ledger of critical assets, backup coverage, and restore proof, then share portable files and print asset-specific restore drills. It does not run backups or hold credentials.

## Cold first screen

Fresh Chromium contexts were opened at 390×844 and 1440×900 before any scrolling.

| Check | Phone | Desktop |
| --- | --- | --- |
| Job | Track backup coverage and restore tests | Track backup coverage and restore tests |
| Audience | Small IT teams with critical assets | Small IT teams with critical assets |
| First action | Try it with sample data | Try it with sample data |
| Result note | Opens an isolated sample ledger | Opens an isolated sample ledger |
| CTA geometry | 350×48px, ends at y=517.94 | 231.88×48px, ends at y=666.03 |
| Horizontal overflow / console errors | 0 / 0 | 0 / 0 |

The three facts (free, offline after first visit, stored in this browser) were present without scrolling.

## Demo and user paths

- One click opened the persistent **Demo — sample data, nothing is saved** mode with Reset demo and Start for real.
- The populated sample contained Customer database, Finance shared drive, Support ticket export, DNS zone records, and Payroll archive. It presented Proof current, Proof due soon, Never proven, Coverage gap, and Proof expired.
- With a pre-seeded real record, a demo edit changed only `demo:backup-coverage-ledger:v1`; Reset demo restored Customer database; Start for real removed the demo key and displayed the untouched real record.
- Normal, invalid, boundary, and recovery behavior is covered by the full browser suite and independent claim commands: required fields, invalid and impossible dates, nested YAML, 0/3651-day intervals, 1/3650-day intervals, exact 2,000,000-byte import acceptance, 2,000,001-byte rejection, import recovery, delete/Undo, and delete typo recovery.
- The live delete regression passed: wrong name produced `Type Customer database exactly.`, correcting the field cleared it, deletion succeeded, Undo restored the asset, and close/reopen reset the field and custom error.
- The live service worker controlled a populated demo; offline reload retained Customer database and displayed `Local · offline`.

## Claims

The declared prerequisites were installed in a clean checkout with `npm ci --include=dev`. Every command in `.factory/claims.json` then ran independently with `npm run test:claims -- --grep @claim:<id>` and passed.

| Claim IDs independently passed |
| --- |
| `demo-isolation`, `ledger-fields`, `missing-fields`, `proof-statuses`, `local-only`, `csv-roundtrip`, `yaml-roundtrip`, `portable-import` |
| `restore-drill`, `offline-reload`, `import-limit`, `portable-schema`, `privacy-runtime`, `free`, `safety-boundary`, `merge-import` |

The tests exercise their stated observable outcomes, not only text. Structure tests also passed, so public copy/README claims are listed and have exactly one matching tagged test. Untested claim count: **0**.

## Quality, accessibility, privacy, and routes

- `npm run check`: PASS — 23 unit/structure tests, production `dist/` build, and 40 Playwright checks; the recorded Playwright status is `passed`.
- `npm audit --omit=dev --audit-level=high`: PASS — 0 vulnerabilities.
- Build output: JavaScript 43.02 kB raw / 13.77 kB gzip; CSS 24.60 kB raw / 6.10 kB gzip. Both are within the static-product budgets.
- Fresh live Axe WCAG 2 A/AA scans: 0 violations on home, demo, drill, Privacy, Terms, demo legal routes, unknown application route, dialog, and dark treatment.
- Each tested application route has `lang=en`, one `<main>`, one `<h1>`, its own title, and no phone overflow. Skip navigation receives first focus. Navigation moves focus to the destination h1 and announces it; Back restores the home h1 focus. Reduced motion had no running animations.
- At 390px, all standalone header/main/footer navigation links on home, demo, both legal pages, and static 404 were at least 44px in both dimensions; the closest adjacent gap was 8px.
- The live privacy flow had no console errors or third-party product requests. Controls and requests showed no analytics, advertising, remote fonts, accounts, billing, credential controls, backup-system access, or data upload.
- All rendered HTTP links returned 200, including the labelled source repository. `mailto:` links were intentional. `/missing-route` returned the designed application page with HTTP 404; this expected response is not a defect.

Two Lighthouse CLI attempts could not establish a browser session in this verifier container (`Unable to connect to Chrome`; then a browser-tab crash). These are tool-environment failures, not product results or public claims. They do not alter the independently verified bundle budgets, live rendering, zero-Axe route matrix, or prior published 100/100/100/100 live report; no fresh Lighthouse score is asserted here.

## Deployment identity

The clean production build from implementation `38dfb4c` matched the live deployment byte-for-byte for all 17 publicly served artifacts: HTML, JavaScript, CSS, source map, service worker, 404 assets, icons, robots, sitemap, and product images. `staticwebapp.config.json` deliberately returns HTTP 404 because deployment configuration is not public. Commit `80a4200` is documentation-only; it does not require a newer product image.

## Earlier finding disposition

I inspected the earlier reviews, verifications, polish records, repair record, and handoff. Every earlier item remains fixed, including the formerly minor findings.

| Earlier IDs | Current independent proof | Disposition |
| --- | --- | --- |
| P1–P2 | Critical-only/no-critical coverage calculation and malformed/impossible date rejections pass the browser suite. | Fixed |
| F-1-1–F-1-9 | Cold first screen, isolated demo, claim mapping, route semantics, designed 404, focus/announcement, metadata, shared chrome, and one h1 were rechecked. | Fixed |
| F-1-10–F-1-16 | Stable-ID merge/conflict/replace/Undo, complete field persistence, safety boundary, named gaps, all status states, same-origin/demo storage, and portable import passed. | Fixed |
| F-1-17–F-1-31 | Tested wording, field/round-trip/offline behavior, print drill, schema and size boundaries, and runtime privacy passed. | Fixed |
| F-1-32–F-1-47 | Plain words, consistent terms, result-naming controls, empty state, deep-link drill, and labelled external source remain present and tested. | Fixed |
| F-2-1–F-2-4 | Free and safety flows are outcome-tested; account/subscription/advertising coverage, Replace ledger wording, and README terminology/action remain correct. | Fixed |
| F-4-1–F-4-7 | All four named gaps, import privacy, actual printing/layout, full schema range, proof persistence, accurate demo state, and no unlisted deployment claim remain covered. | Fixed |
| F-6-1 | Correcting a typo and close/reopen both clear delete validation; delete and Undo succeed live. | Fixed |
| F-6-2 | Phone navigation geometry measured at minimum 44px target and 8px separation across normal, demo, legal, and static 404 pages. | Fixed |

## Applicability

This is a local-first static web product. Backend tenant isolation, server restart persistence, health endpoints, live request allowances/429, billing, and CLI/library/desktop artifact checks do not apply. No additional AI feature is warranted: portable records, merge handling, and drills are deterministic tasks, and adding a remote model would weaken the stated privacy boundary.
