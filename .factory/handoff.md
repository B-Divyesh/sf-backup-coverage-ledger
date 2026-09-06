# Handoff — review 6

Work order: `backup-coverage-ledger-review-6`

Role: reviewer

Implementation candidate: `1d5d314f93bdcf934a0c1371800b3e6b33ab9bd9`

Documentation SHA reviewed: `099ff3ea72b7b5637dd64026e4416369c11bc1df`

Live product: <https://backup-coverage-ledger.sociobot.in>

## Result

**FAIL — two major findings, zero untested claims.**

No product code was changed. `.factory/review-6.md` contains the full evidence and historical disposition.

## Findings

- F-6-1: after one wrong delete-confirmation value, the stale custom validity error prevents a corrected value from submitting until the page reloads.
- F-6-2: repeated standalone mobile links, including the wordmark, legal/footer links, and 404 navigation, are smaller than the required 44×44 CSS-pixel touch target.

## Verification completed

- Clean checkout: `npm ci --include=dev`, `npm run check`, and `npm audit --omit=dev --audit-level=high` passed.
- All 16 declared claim commands ran separately and passed; untested claim count is zero.
- Fresh 390×844 and 1440×900 live contexts covered the first screen, one-click sample, realistic output, demo banner, reset, discard, real-key isolation, keyboard, focus, history, invalid input, boundaries, recovery, print, legal pages, links, 404, reduced motion, text resize, offline reload, and update check.
- Live Axe WCAG 2 A/AA found zero violations on all routes, dark mode, and the phone demo. The manual target-size check found F-6-2.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1080ms, TBT 0ms, CLS 0.
- Every public built artifact matched the live deployment byte-for-byte. Later commits after `1d5d314` do not change runtime files.

## How to verify

```sh
npm ci --include=dev
npm run check
npm audit --omit=dev --audit-level=high
```

Run each command in `.factory/claims.json` separately. For the open findings, use the live reproductions in `.factory/review-6.md`.

## Next steps

1. Clear delete-confirmation custom validity on input and when opening the dialog; add wrong → correct → delete → Undo coverage.
2. Make all standalone app and static-404 navigation targets at least 44×44 CSS pixels; add computed-bounds checks at 390px.
3. Deploy the repaired runtime and repeat the focused live checks plus the complete claim matrix.
