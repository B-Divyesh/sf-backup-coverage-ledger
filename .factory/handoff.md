# Handoff — verification 3

Work order: `backup-coverage-ledger-verify-3`

Live product: <https://backup-coverage-ledger.sociobot.in>

Implementation SHA: `38dfb4c1b9a5abc47b8f066322e04a089a087941`

Documentation reviewed: `80a42000f1c2bcb7c6644f0997900605ceb2ac1e`

Implementation release: `v1.1.4 · repair-2`

## Result

**PASS — independent QA found 0 findings and 0 untested claims.**

- The deployed product was independently compared with implementation `38dfb4c`: all 17 public artifacts match byte-for-byte. `80a4200` is documentation-only.
- Fresh phone and desktop loads name the job, small-IT audience, and **Try it with sample data** action before scrolling. The one-click demo is isolated, resets, and discards without changing a pre-seeded real record.
- Live delete typo correction/close-reopen recovery, Undo, offline reload, keyboard/focus behavior, reduced motion, legal routes, links, designed 404, and mobile target geometry passed.

The repair keeps all existing ledger, demo, file, print, offline, privacy, and route behavior. It adds no account, backend, analytics, payment, or external model dependency.

## Verification

The documented clean setup ran after `npm ci --include=dev` from a clean checkout:

```sh
npm ci --include=dev
npm run check
npm audit --omit=dev --audit-level=high
```

Results:

- 23 unit and structure tests passed.
- The production build passed and produced `dist/index.html`.
- 40 Playwright checks passed.
- Every one of the 16 commands in `.factory/claims.json` passed separately; no public claim is untested.
- Fresh live Axe returned zero WCAG 2 A/AA violations across the route/mode matrix.
- The focused delete-recovery and rendered target-size/spacing checks passed live at 390px.
- JavaScript is 43.02 kB raw / 13.77 kB gzip. CSS is 24.60 kB raw / 6.10 kB gzip.
- Production dependency audit: zero vulnerabilities.

The prior live Lighthouse evidence remains 100/100/100/100. A fresh Lighthouse CLI session could not launch reliably in this verifier container; this is recorded accurately in `.factory/verification-3.md` and is not asserted as a fresh score.

## Cold live checks

All 17 public artifacts match the implementation build byte-for-byte. The deployment configuration remains non-public with HTTP 404.

Fresh 390×844 and 1440×900 Chromium contexts confirmed:

- The first screen names the job, small-IT audience, and **Try it with sample data** action before scrolling.
- The demo shows five realistic assets and five expected proof/gap states.
- Demo edit, reset, and discard never alter a pre-seeded real ledger.
- Wrong delete confirmation recovers after editing or closing; delete and Undo then succeed.
- Every measured standalone navigation link is at least 44×44 CSS pixels. Adjacent navigation targets are at least 8px apart.
- Home, demo, drill, Privacy, Terms, demo legal routes, and the intentional 404 have one `h1`, one `main`, `lang=en`, their expected titles, and no horizontal overflow.
- Live Axe WCAG 2 A/AA reports zero violations across all checked routes.
- Skip-link focus, route focus and announcement, and Back focus pass.
- 200% text size has no horizontal overflow on home, demo, or Privacy.
- Reduced motion leaves no infinite animation and limits durations to 0.01ms.
- Print invokes the browser print path, keeps five checklists, hides page chrome, and has no overflow.
- The service worker updates and reloads the populated demo offline.
- Product traffic remains same-origin. Internal links and the labelled source link return 200; mail links are intentional.
- The designed missing route returns HTTP 404. Its browser network message is expected and is not an application defect.

Evidence is in `.factory/evidence/repair-2-local/`, `.factory/evidence/repair-2-live/`, and `/work/.evidence/repair-2/`.

## Historical disposition

The complete verification and review history was reread. The current report proves the disposition of P1–P2, F-1-1–F-1-47, F-2-1–F-2-4, F-4-1–F-4-7, and F-6-1–F-6-2 in `.factory/verification-3.md`.

## Known gaps and next steps

No known product or verification gap remains. This is a static, local-first product, so backend tenant, health, restart-persistence, rate-limit, and billing checks do not apply.
