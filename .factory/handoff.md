# Handoff — adversarial review 4

Work order: `backup-coverage-ledger-review-4`
Role: reviewer
Reviewed commit: `c173e43ea0ea77ea7c5bf50326c0376190337f44`
Live product: <https://backup-coverage-ledger.sociobot.in>

## Completed

- Performed cold first-read checks at 390×844 and 1440×900.
- Audited every landing/README sentence, heading, control, term, and visitor-facing claim.
- Exercised the demo with a pre-seeded real ledger; verified edit/reset/discard isolation, same-origin requests, and offline reload.
- Ran all 16 declared claim commands separately from clean clone `/tmp/bcl-review4-clean.zlqcSi`.
- Rechecked all findings from reviews 1–3 and polish rounds 1–3 against the live site and current code/tests.
- Crawled live routes and links; checked titles, metadata, 404 behavior, shared chrome, history/focus, CSP, responsive overflow, and visual identity.
- Ran live WCAG 2 A/AA Axe scans on home, demo, drill, privacy, terms, and the true 404.
- Wrote `.factory/review-4.md`. No product code was changed.

## Verification

```sh
npm ci --include=dev
npm test
npm run build
npm run test:e2e
```

Results: 21 unit/structure tests passed; build produced `dist/`; the browser suite reported 33 passed and 1 project-conditional skip. Every claim command exited successfully, but five tagged tests do not prove their complete manifest wording. Live routes and the deliberate 404 returned expected statuses, Axe found zero WCAG A/AA violations, all intentional links resolved, first-party-only demo traffic was observed, and the populated demo reloaded offline.

## Result and remaining work

Verdict: **FAIL**. `.factory/review-4.md` records six blocking findings and two major findings. Required follow-up is to close the reopened terminology finding, correct the demo state description, complete the five claim tests, and list or remove the README deployment claim before rerunning the full review.
