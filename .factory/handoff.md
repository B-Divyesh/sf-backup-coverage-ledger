# Handoff — polish round 2

Work order: `backup-coverage-ledger-polish-2`  
Repair commits: `2c3d656b6dc281cb4624ae9e62470865204502e4`, `c4d30c83c1d54535760e026bcc74def5c6a016bb`  
Product: <https://backup-coverage-ledger.sociobot.in>

## What changed

- Closed every finding from both adversarial reviews. The complete finding-to-change ledger is in `.factory/polish-2.md`.
- Made the static true-404 page use the same four primary links and complete footer as application routes, with a parity regression test.
- Turned the `free` and safety-boundary tests into real browser workflows: they exercise proof, export, import, drill, reset, controls, and outgoing requests instead of checking printed promises.
- Listed the retained accounts, subscription, and advertising promises in `.factory/claims.json`; their tests now cover them.
- Renamed the destructive import action to **Replace ledger** and made the README use the established `asset` and **Try it with sample data** terms.
- Added an accessible asset-specific name to each restore-proof action. This fixes the production verifier’s mobile/content-visibility edge case while making the control clearer to assistive technology.
- Updated the verb-first catalog description and copy audit. The visual proof-lattice system, local-first static artifact class, and deployment output remain unchanged.

## Verification

Fresh exact clone: `/tmp/bcl-polish-2-final2-clean.*` at `c4d30c83c1d54535760e026bcc74def5c6a016bb`.

- `npm ci`: passed, 0 vulnerabilities reported.
- Every one of the 16 commands declared in `.factory/claims.json`: passed separately from that clone.
- `npm run check`: passed — 21 Vitest unit/structure tests, production `dist/` build, and 32 Playwright desktop/mobile/browser tests.
- Playwright Axe WCAG 2 A/AA route/dialog/dark-theme matrix: 0 violations (included in `npm run check`).
- Production build: 42.82 kB JavaScript (13.74 kB gzip) and 24.40 kB CSS (6.07 kB gzip); no downloaded fonts.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/?demo=1`: passed. Evidence: `.factory/evidence/polish-2-local-final/verify.json`; title, language, main landmark, one h1, alt text, console errors, and unlabeled buttons are clean.
- Current screenshots: `.factory/evidence/polish-2-local-final/screenshot-desktop.png`, `.factory/evidence/polish-2-local-final/screenshot-mobile.png`, and `.factory/evidence/polish-2-local-final/404-mobile.png`.

## Run locally

```sh
npm ci
npm run check
npm run dev
```

Open `/?demo=1` for the isolated five-record sample. The demo uses `demo:backup-coverage-ledger:v1`; **Reset demo** reseeds it and **Start for real** deletes it before opening `backup-coverage-ledger:v1`.

## Deployment and live recheck

The repair commit was pushed to `origin/main`. The work-order configuration specifies a static deployment with `npm ci && npm test && npm run build` and `dist/`; it provides no Static Web Apps token, app identity, or repository deployment workflow. At the time of this handoff draft, the live host was still serving the preceding asset `index-DgzB0cg7.js`, rather than this repair’s `index-Bk_EctYg.js`. Do not accept the old live revision as the repair. The required cold live recheck must be run once the factory-managed static deployment promotes the pushed SHA.

## Known gaps

No known repository or product gaps remain. Live promotion is factory-managed and is the only outstanding external state at this instant.
