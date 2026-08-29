# Backup Coverage Ledger

Backup Coverage Ledger helps small IT teams track each critical data set, its backup, and the latest restore test.

[Try the isolated sample ledger](https://backup-coverage-ledger.sociobot.in/?demo=1) or [open the live product](https://backup-coverage-ledger.sociobot.in).

Free. No account or paid tier.

## Who it is for

For small IT, platform, and operations teams that use several backup tools but lack one shared coverage record.

## What it does

- Records each asset, owner, backup target, recovery location, restore steps, retention, proof interval, and dated restore proof.
- Shows gaps, unproven assets, due-soon proof, expired proof, and current proof.
- Stores real and demo ledgers under separate browser keys.
- Imports and exports CSV and flat YAML records with stable IDs.
- Compares shared files before adding, updating, skipping, replacing, or resolving conflicts.
- Builds a printable, asset-specific restore drill checklist.
- Works offline after the first visit.

It does not perform backups, access backup systems, handle credentials, or treat documentation as a successful restore.

Every statement above maps to an observable browser test in [.factory/claims.json](.factory/claims.json).

## Try the demo

Open `/?demo=1` or select **Try it with sample data** on the first screen.

The demo contains five realistic assets and never reads or writes the real ledger key. **Reset demo** restores the sample. **Start for real** discards it.

See [.factory/demo.md](.factory/demo.md) for the storage and reset contract.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Data uses that origin’s `localStorage`.

## Test and build

```sh
npm test          # unit tests
npm run build     # production build -> dist/
npm run test:e2e  # browser, mobile, routing, offline, and accessibility tests
npm run test:claims
npm run check     # all unit, build, and browser tests
```

Playwright is pinned to 1.58.2. Run `npx playwright install chromium` if Chromium is missing.

The deploy command is `npm run build`. The static deploy root is `dist/`.

## Portable file format

Export CSV or YAML to get a file you can edit and import again.

CSV headers are:

```text
id,asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays,createdAt,updatedAt
```

Criticality accepts `critical`, `important`, or `routine`. Dates use `YYYY-MM-DD`. The proof interval accepts 1–3650 days.

Imports accept files up to 2,000,000 bytes. They are parsed in the browser.

YAML supports flat records from this app. Nested YAML, aliases, and block scalars are not supported.

Keep passwords, keys, tokens, recovery codes, and other secrets out of ledger files.

## Privacy and design

The app has no analytics, remote fonts, accounts, or third-party scripts. Read the in-product [privacy](https://backup-coverage-ledger.sociobot.in/privacy) and [terms](https://backup-coverage-ledger.sociobot.in/terms) pages.

The researched scope is in [.factory/brief.json](.factory/brief.json). The visual system and artwork provenance are in [.factory/design.md](.factory/design.md). Release evidence is in [.factory/handoff.md](.factory/handoff.md).

## Deploy

Azure Static Web Apps uses `dist/staticwebapp.config.json`. It provides route fallback, a true 404 response, security headers, and asset caching.

## License

MIT. See [LICENSE](LICENSE).
