# Handoff — repair 2

Work order: `backup-coverage-ledger-repair-2`

Live product: <https://backup-coverage-ledger.sociobot.in>

Implementation SHA: `38dfb4c1b9a5abc47b8f066322e04a089a087941`

Documentation SHA: the final report commit containing this handoff; the exact pushed SHA is also written to `/work/.evidence/repair-2/shas.json`.

Implementation release: `v1.1.4 · repair-2`

## Result

**PASS — both review-6 findings are fixed, and no known finding remains.**

- Delete confirmation now clears its custom validation error when the operator edits the value and whenever the dialog opens. Wrong name → correct name → delete → Undo works without a reload. Closing after an error and reopening also starts with a valid empty field.
- The wordmark, informational link, legal/footer links, and static-404 navigation now provide hit areas of at least 44×44 CSS pixels with at least 8px between adjacent navigation targets. A browser regression measures rendered geometry at 390px across normal, demo, legal, and 404 pages.

The repair keeps all existing ledger, demo, file, print, offline, privacy, and route behavior. It adds no account, backend, analytics, payment, or external model dependency.

## Verification

The documented clean setup ran from a detached checkout of the implementation SHA:

```sh
npm ci --include=dev
npm run check
npm audit --omit=dev --audit-level=high
```

Results:

- 23 unit and structure tests passed.
- The production build passed and produced `dist/index.html`.
- 39 Playwright checks passed; one desktop-only project check was intentionally skipped in the mobile project.
- Every one of the 16 commands in `.factory/claims.json` passed separately.
- The focused delete-recovery and rendered target-size/spacing checks passed on desktop and mobile projects.
- JavaScript is 43.02 kB raw / 13.77 kB gzip. CSS is 24.60 kB raw / 6.10 kB gzip.
- Production dependency audit: zero vulnerabilities.

Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.96s, TBT 72ms, CLS 0.

Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.02s, TBT 18ms, CLS 0.

## Cold live checks

The existing production Static Web App `sf-backup-coverage-ledger` was reused and the clean `dist/` was deployed. All 17 public artifacts match the implementation build byte-for-byte. The deployment configuration remains non-public with HTTP 404.

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

The complete verification and review history was reread before the repair. The clean test and live matrices retain the fixes for P1, P2, F-1-1 through F-1-47, F-2-1 through F-2-4, and F-4-1 through F-4-7. `.factory/repair-2.md` maps those groups to current evidence.

## Known gaps and next steps

No known product or verification gap remains. This is a static, local-first product, so backend tenant, health, restart-persistence, rate-limit, and billing checks do not apply.
