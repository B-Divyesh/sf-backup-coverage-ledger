# Handoff — adversarial review 3

Work order: `backup-coverage-ledger-review-3`
Role: reviewer
Live product: <https://backup-coverage-ledger.sociobot.in>

## What was done

- Performed a fresh, non-mutating adversarial review of the live site at 390×844 and 1440×900.
- Read the brief, design, claims/demo material, all earlier reviews, polish ledgers, verification reports, and prior handoff.
- Ran every one of the 16 declared claim commands separately from a fresh clone; all passed.
- Verified live demo isolation with a pre-seeded real ledger; reset and discard behavior preserved real data. Checked same-origin requests, offline claim coverage, routes, metadata, history/focus, links, static 404, live Axe scans, and clean-clone quality gates.
- Wrote `.factory/review-3.md`. No product source, assets, or configuration were changed.

## Verdict and remaining work

**FAIL.** One blocking historical terminology issue remains: the empty state says `data set` and the form says `Asset or data set`, while the established tracked-item term is `asset`. See `F-1-36` in `.factory/review-3.md` for exact locations and the concrete rewrite/test needed.

## Verification commands

```sh
npm ci --include=dev
npm test
npm run build
npm run test:e2e
```

Run each command in `.factory/claims.json` separately for the claim matrix. The review's fresh clone was `/tmp/bcl-review3-clean.VVo8mQ`; all 16 claim commands passed, as did unit, build, and 32-browser-test gates.

## Known gaps

- The sole known product gap is F-1-36. No deployment or product-code changes were made by this review.
