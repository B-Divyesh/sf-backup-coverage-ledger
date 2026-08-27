# Backup Coverage Ledger

Backup Coverage Ledger is a free, vendor-neutral inventory for small teams that need to know which critical data sets are covered and whether anyone has actually extracted them. It links each asset to an owner, backup target, recovery location, extraction method, retention policy, and dated restore proof.

Live product: [backup-coverage-ledger.sociobot.in](https://backup-coverage-ledger.sociobot.in)

It does not perform backups, handle credentials, or treat documentation as proof of a successful restore.

## Who it is for

Small operations, platform, IT, and engineering teams that use several backup tools but lack one human-readable view of ownership, coverage, and restore evidence.

## What it does

- Calculates coverage gaps, never-proven assets, due-soon proofs, and expired proofs.
- Stores the ledger locally in the browser—no account or application database.
- Imports and exports portable CSV and a deliberately simple YAML subset.
- Generates a printable, asset-specific restore drill checklist.
- Works after the app shell has been cached for offline use.
- Supports keyboard use, 390px screens, light/dark themes, and reduced motion.

Keep passwords, access keys, tokens, recovery codes, and other secret material out of the ledger and exported files.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Data is stored in that origin’s `localStorage`.

## Test and build

```sh
npm test          # unit tests
npm run build     # production build -> dist/
npm run test:e2e  # Chromium desktop/mobile flows and axe checks
npm run check     # all of the above
```

Playwright is pinned to 1.58.2. If its Chromium binary is not already available, run `npx playwright install chromium` once.

The exact deployment build command is `npm run build`. The static deploy root is `dist/`, with `dist/index.html` at its root. `public/staticwebapp.config.json` supplies Azure Static Web Apps navigation fallback and security headers.

## Portable file format

Use the app’s export actions to produce a canonical template. CSV headers are:

```text
asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays
```

Criticality is `critical`, `important`, or `routine`; dates use `YYYY-MM-DD`; proof cadence is 1–3650 days. Imports are limited to 2MB and parsed entirely in the browser.

## Privacy and design

The app has no analytics, third-party scripts, remote fonts, accounts, or server-side ledger storage. See the in-product `/privacy` and `/terms` routes. The researched scope is in [.factory/brief.json](.factory/brief.json), the product-specific visual system and original artwork provenance are in [.factory/design.md](.factory/design.md), and release verification is in [.factory/handoff.md](.factory/handoff.md).

## License

MIT. See [LICENSE](LICENSE).
