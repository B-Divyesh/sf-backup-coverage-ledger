# Repair 2 verification — Backup Coverage Ledger

- Date: 2026-09-06
- Work order: `backup-coverage-ledger-repair-2`
- Implementation: `33b5d584640d166fae35c87df0f6f405a608cd32`
- Live URL: <https://backup-coverage-ledger.sociobot.in>

## Verdict

**PASS — zero open findings and zero untested claims.**

## Review-6 findings

| Finding | Root-cause repair | Outcome evidence | Live result |
| --- | --- | --- | --- |
| F-6-1 | Clear delete-field custom validity on input and on each dialog open. Associate the exact-name help with the field. | `tests/e2e/app.spec.ts` runs wrong → correct → delete → Undo, then wrong → close → reopen → delete → Undo. | The error changed from `Type Customer database exactly.` to empty after correction. Delete, Undo, and clean reopen all returned `true`. |
| F-6-2 | Give the app wordmark, informational/legal links, footer links, and static-404 navigation a 44px minimum hit area. | The browser test measures computed bounds at 390px on home, demo, Privacy, Terms, and static 404. | Home, demo, drill, both legal modes, and the true 404 had zero undersized targets; each route's minimum was 44×44 CSS pixels. |

## First screen and demo

Fresh phone and desktop contexts saw the same job, audience, and first action before scrolling:

- Job: **Track backup coverage and restore tests**.
- Audience: small IT teams responsible for critical assets.
- First action: **Try it with sample data**.
- Result: **Opens an isolated sample ledger.**

The phone action ended at 517.94px in an 844px viewport. The desktop action ended at 666.03px in a 900px viewport. Both had zero horizontal overflow.

The one-click demo showed Customer database, Finance shared drive, Support ticket export, DNS zone records, and Payroll archive. It showed Proof current, Proof due soon, Never proven, Coverage gap, and Proof expired. A sample edit changed only the `demo:` key. Reset restored the sample. Start for real removed the demo key and showed the untouched `Real private database` record.

## Historical findings

| Earlier findings | Current proof | Disposition |
| --- | --- | --- |
| P1–P2 | Critical-only 30-day coverage and real ISO calendar-date rejection pass unit and browser checks. | Fixed |
| F-1-1–F-1-9 | First screen, isolated demo, claim bijection, semantic routes, true 404, route focus, metadata, shared chrome, and single h1 pass clean and live matrices. | Fixed |
| F-1-10–F-1-16 | Stable-ID merge/conflict/replace/Undo, complete fields, safety boundary, four named gaps, five states, local-only flow, and portable import pass their declared claims. | Fixed |
| F-1-17–F-1-31 | Storage/export/offline wording, field persistence, round trips, print, schema boundaries, exact import-size limit, and runtime privacy pass all declared commands. | Fixed |
| F-1-32–F-1-47 | Plain copy, one-term vocabulary, result-naming controls, empty state, real drill route, and labelled external source remain covered by browser/structure checks and the copy audit. | Fixed |
| F-2-1–F-2-4 | Free and safety checks exercise actual flows; account/subscription/advertising wording is covered; destructive import and README terms remain clear. | Fixed |
| F-4-1–F-4-7 | Complete gap, import-privacy, print, schema, proof-persistence, demo-state, and deployment-copy coverage passes. | Fixed |
| F-6-1–F-6-2 | Recovery and touch-target checks pass locally and on the deployed origin. | Fixed |

## Clean verification

From a detached clean checkout:

- `npm ci --include=dev`: passed; 72 packages audited, zero vulnerabilities.
- `npm run check`: passed; 23 unit/structure tests, production build, 39 browser checks, one intended project skip.
- `npm audit --omit=dev --audit-level=high`: passed.
- All 16 commands declared in `.factory/claims.json`: passed separately.
- Build: JS 43.02 kB raw / 13.77 kB gzip; CSS 24.60 kB raw / 6.10 kB gzip.

## Live verification

- All 17 public files match the clean build byte-for-byte. `staticwebapp.config.json` returns 404 as intended.
- Home/demo/drill/legal/demo-legal routes return 200. The deliberate missing route returns 404 with the designed page.
- Live Axe: zero WCAG 2 A/AA violations on eight checked route/mode combinations.
- Keyboard skip, route focus/announcement, and Back focus pass.
- Reduced motion, 200% text, print, service-worker update, and offline reload pass.
- All captured product requests are same-origin. All rendered HTTP links return 200; mail links are intentional.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.02s, TBT 18ms, CLS 0.

The product is free, so no billing offer metadata applies. This static product has no backend checks.
