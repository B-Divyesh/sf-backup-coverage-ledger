# Handoff — adversarial first-read review 2

Work order: `backup-coverage-ledger-review-2`

Reviewed commit: `14417f2a179edbd0f1f9ea14f657eec599f3de46`

Live URL: <https://backup-coverage-ledger.sociobot.in>

## What was done

- Performed cold 390×844 and 1440×900 first-screen reads.
- Exercised the one-click demo, five sample states, reset, exit, real/demo storage isolation, and request log.
- Audited every landing and README sentence with word counts, plus headings, terms, and controls.
- Ran all 16 `claims.json` commands separately from a clean clone.
- Rechecked all 47 findings from review 1 and the two earlier verification defects in the live site and source.
- Checked titles, metadata, h1/main structure, deep links, browser Back/focus, live announcements, true 404, internal/external links, CSP, mobile overflow, and visual identity.
- Ran live Axe WCAG A/AA checks and `/opt/fleet/lib/verify-url.sh`.
- Did not modify product code.

## Verdict

**FAIL.** Five findings remain in `.factory/review-2.md`:

- Blocking: F-1-8, inconsistent static 404 chrome (reopened earlier finding).
- Blocking: F-2-1, two claim tests only assert that claim copy exists.
- Major: F-2-2, unlisted account/subscription/advertising claims.
- Minor: F-2-3, ambiguous `Replace all` button.
- Minor: F-2-4, README terminology/action inconsistency.

## Verification evidence

- `npm run check`: passed — 20 unit/structure tests, build, 31 browser tests passed, 1 expected skip.
- All 16 individual manifest commands: process PASS in clean clone `/tmp/bcl-review2-clean.y7IoCU`.
- Live route Axe scans: zero WCAG 2 A/AA violations.
- Live URL verifier: passed with no console errors, one h1/main, complete alt text, and labelled buttons.
- Live crawl: all rendered links returned 200 except the intentional unknown route, which returned the designed 404.
- Build: JS 42.76 kB raw / 13.73 kB gzip; CSS 24.40 kB raw / 6.07 kB gzip.

## Next steps

Apply the five concrete fixes in `.factory/review-2.md`, then rerun every claim command and the full adversarial checklist. No infrastructure, DNS, billing, or deployment changes were made.
