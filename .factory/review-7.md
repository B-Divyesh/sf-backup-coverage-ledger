# Review 7 — track backup coverage and restore tests

- Work order: `backup-coverage-ledger-review-7`
- Date: 2026-09-06
- Live URL: <https://backup-coverage-ledger.sociobot.in>
- Implementation reviewed: `38dfb4c1b9a5abc47b8f066322e04a089a087941`
- Documentation baseline reviewed: `6ac3a9950e5bc30613ae20dacd66c54005f5e1b4`
- Earlier product documentation candidate: `80a42000f1c2bcb7c6644f0997900605ceb2ac1e`
- Viewports: fresh Chromium contexts at 1440×900 and 390×844

## Verdict

**PASS — 0 findings and 0 untested claims.**

The live product completes the brief's job. Small IT, platform, and operations teams can record backup coverage and dated restore proof, exchange stable-ID CSV or flat YAML files, resolve changes, and print restore drills. The tool remains local to the browser and does not run backups or hold credentials.

## First screen

Before scrolling, both fresh phone and desktop browsers showed:

- Job: **Track backup coverage and restore tests**.
- Audience: small IT teams responsible for critical assets.
- First action: **Try it with sample data**.
- Result: **Opens an isolated sample ledger.**
- Facts: **Free**, **Works offline after the first visit**, and **Stored in this browser**.

Every item was fully inside the viewport. Both pages had zero horizontal overflow.

## Sample ledger and real-data isolation

The first action opened `/?demo=1` in one click. The initial populated view contained five realistic assets: Customer database, Finance shared drive, Support ticket export, DNS zone records, and Payroll archive. It showed Proof current, Proof due soon, Never proven, Coverage gap, and Proof expired.

The banner **Demo — sample data, nothing is saved to your ledger** remained visible on the ledger, restore drill, and Privacy page. A browser seeded with a sentinel real ledger then completed this sequence:

1. Edit Customer database in demo mode.
2. Confirm only `demo:backup-coverage-ledger:v1` changed.
3. Select **Reset demo** and confirm the five original records returned.
4. Delete Customer database after first entering a wrong confirmation, then use **Undo**.
5. Select **Start for real**.
6. Confirm the demo key was removed and the real key remained byte-for-byte unchanged.

No external or shared data was changed.

## Declared claims

After `npm ci --include=dev`, every command in `.factory/claims.json` ran separately from the clean checkout and passed.

| Claim | Result | Observable coverage |
| --- | --- | --- |
| `demo-isolation` | PASS | Edit, reset, discard, separate storage, real-key preservation |
| `ledger-fields` | PASS | Every field, proof date and notes, reload persistence |
| `missing-fields` | PASS | Owner, backup target, recovery location, restore steps |
| `proof-statuses` | PASS | Current, due soon, unproven, expired, gap |
| `local-only` | PASS | Edit, import, export, reload, storage, request log |
| `csv-roundtrip` | PASS | Stable IDs and no duplicates |
| `yaml-roundtrip` | PASS | Flat YAML, stable IDs, no duplicates |
| `portable-import` | PASS | CSV, flat YAML, nested-YAML rejection |
| `restore-drill` | PASS | Five asset checklists, print call, print layout |
| `offline-reload` | PASS | Fresh context, cached populated ledger, offline reload |
| `import-limit` | PASS | 2,000,000 bytes accepted; 2,000,001 rejected |
| `portable-schema` | PASS | IDs, all criticalities, ISO dates, 1/3650 boundaries, invalid rejection |
| `privacy-runtime` | PASS | No analytics, ads, remote fonts, accounts, or third-party scripts |
| `free` | PASS | Main feature classes without account, subscription, paywall, or payment request |
| `safety-boundary` | PASS | No credential control or backup-system request |
| `merge-import` | PASS | Add, update, skip, conflict, replace, repeat, Undo |

The live pages, metadata, README, privacy text, terms, demo documentation, and copy audit were cross-checked against the manifest. No missing, false, incomplete, or untested public claim was found.

## Normal, invalid, boundary, and recovery paths

- Normal: add, edit, proof, save, reload, filter, CSV/YAML export and import, merge, replace, drill, and print passed in the full suite or individual claim runs.
- Invalid: a blank required asset form remained invalid; nested YAML produced a specific visible error; malformed and impossible dates were rejected before storage.
- Boundary: proof intervals 1 and 3650 passed; 0 and 3651 failed; 2,000,000-byte import passed and 2,000,001-byte import failed.
- Recovery: delete confirmation cleared its custom error after correction; delete and Undo passed live. Closing and reopening also resets the field in the full suite. Import Undo and malformed-storage recovery passed. Corrupt local storage showed a clear export warning; clearing the bad value and reloading restored the empty state.

## Accessibility, routes, privacy, and offline behavior

- `/opt/fleet/lib/verify-url.sh` passed with no console errors, one h1, one main, `lang=en`, complete image alt text, and no unnamed button.
- Fresh Axe WCAG 2 A/AA scans returned zero violations for demo, drill, Privacy, Terms, the designed 404, the open edit dialog, and the dark treatment.
- Keyboard checks passed for skip navigation, dialog focus, Escape, focus return, route focus and announcement, and Back navigation.
- Reduced motion capped animation and transition duration at 0.01 ms. At 200% root text size, home, demo, and Privacy retained zero horizontal overflow.
- At 390px, standalone navigation targets on home, demo, Privacy, Terms, and static 404 were at least 44×44 CSS pixels.
- Each checked route had its own title, description, canonical, Open Graph data, Twitter card, one h1, one main, and no horizontal overflow.
- Every rendered HTTP link returned 200. The two `mailto:` links were intentional. The self-link on the deliberate missing page retained the expected 404 response.
- `/missing-review-7` returned HTTP 404 with the designed title, h1, shared navigation, and return action. This expected 404 is not a defect.
- The privacy page states storage, network, deletion, and contact behavior. The complete live demo flow requested only `https://backup-coverage-ledger.sociobot.in` and produced no unexpected console or page errors.
- The service worker was active and controlling, `registration.update()` completed, and a populated demo reloaded offline with **Local · offline**. No future-version migration is claimed.
- Live headers include HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, restrictive permissions, and a self-only CSP with `frame-ancestors 'none'`.

## Clean checkout and deployment identity

The clean checkout at documentation commit `6ac3a99` ran:

```sh
npm ci --include=dev
npm run check
npm audit --omit=dev --audit-level=high
```

Results:

- 23 unit and structure tests passed.
- TypeScript and the production build passed; `dist/index.html` exists.
- Playwright: 39 passed and one intended project-only skip across 40 cases.
- Production audit: zero vulnerabilities.
- JavaScript: 43.02 kB raw / 13.77 kB gzip.
- CSS: 24.60 kB raw / 6.10 kB gzip.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.13 s, TBT 83 ms, CLS 0.

The live deployment matches the production build from implementation `38dfb4c` byte-for-byte for all 17 public files. `staticwebapp.config.json` returns 404 as intended. Commits `80a4200` and `6ac3a99` change documentation or evidence only, so they do not require a newer product image.

## Earlier finding disposition

Every earlier review, verification, polish record, repair record, and handoff was inspected. This review did not accept their conclusions without retesting.

| Earlier IDs | Current proof | Disposition |
| --- | --- | --- |
| P1 | Mixed-criticality and no-critical tests confirm the 30-day measure uses critical assets only. | Fixed |
| P2 | Malformed and impossible dates are rejected before storage; no infinite-day output appears. | Fixed |
| F-1-1–F-1-9 | Fresh cold reads, isolated demo, claim bijection, Axe, true 404, route focus, metadata, shared chrome, and clean h1 text passed. | Fixed |
| F-1-10–F-1-16 | Stable-ID merge/conflict/replace/Undo, complete fields, safety boundary, all four gaps, all five states, same-origin storage, and portable import passed. | Fixed |
| F-1-17–F-1-31 | Public storage/export/offline wording, field persistence, round trips, print, schema and size boundaries, and runtime privacy are declared and tested. | Fixed |
| F-1-32–F-1-47 | Copy audit has no flagged sentence or banned word; terms are consistent; controls name results; empty state, `/drill`, and external-source label passed. | Fixed |
| F-2-1–F-2-4 | Free and safety tests exercise outcomes; account/subscription/advertising text is covered; **Replace ledger** and README terminology remain correct. | Fixed, including both former minor findings |
| F-4-1–F-4-7 | Four missing fields, import privacy, print invocation/layout, full schema range, proof persistence, exact demo description, and removal of the unlisted deployment guarantee all passed. | Fixed |
| F-6-1 | Wrong delete text gives a specific error, correction clears it, delete succeeds, and Undo restores the asset; close/reopen reset also passes. | Fixed |
| F-6-2 | Phone navigation targets measured at least 44×44 pixels on home, demo, both legal pages, and static 404. | Fixed |

## Scope and remaining work

This is a static, local-first product. Backend tenant isolation, server restart persistence, health, 429/Retry-After, billing, CLI, library, and desktop installation checks do not apply.

No missed feature finding remains. Portable files, deterministic merge and conflict handling, Undo, and printable restore drills cover the brief's implied next actions. Remote sync or generated output would weaken the local-only boundary without helping this deterministic task.

No product change or follow-up is required from this review.

Evidence is stored in `/work/.evidence/review-7/`, including fresh phone and desktop captures, the URL verifier output, and the Lighthouse JSON report.
