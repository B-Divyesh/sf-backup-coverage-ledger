# Copy audit — polish round 4

Method: whitespace-delimited words containing letters or numbers. Hyphenated terms count as one word. This records every authored sentence visible on the landing route in its empty state, including dialog and import guidance; dynamic asset values are excluded.

| Words | Sentence | Claim or check |
| ---: | --- | --- |
| 6 | Track backup coverage and restore tests. | — |
| 19 | For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test. | — |
| 5 | Opens an isolated sample ledger. | terminology regression |
| 1 | Free. | `free` |
| 6 | Works offline after the first visit. | `offline-reload` |
| 4 | Stored in this browser. | `local-only` |
| 7 | A listed backup is not restore proof. | `safety-boundary` |
| 9 | Record proof after someone restores and opens representative data. | — |
| 12 | The ledger flags missing owners, backup targets, recovery locations, and restore steps. | `missing-fields` |
| 9 | It marks proof expired after each asset’s chosen interval. | `proof-statuses` |
| 3 | Keep secrets out. | — |
| 5 | Records stay in this browser. | `local-only` |
| 6 | Imports and exports run here too. | `local-only` |
| 8 | Add the critical asset you would miss first. | terminology regression |
| 10 | You can also import a CSV or flat YAML file. | `portable-import` |
| 8 | Add its owner, backup target, and recovery location. | — |
| 7 | Restore representative data in an isolated place. | — |
| 8 | Add the date and what your team opened. | — |
| 12 | The ledger does not run backups, open backup systems, or store credentials. | `safety-boundary` |
| 8 | Your team performs and checks every restore test. | — |
| 5 | Records use this browser’s storage. | `local-only` |
| 13 | Export a file when your team needs to share or archive the ledger. | `csv-roundtrip`, `yaml-roundtrip`, `merge-import` |
| 8 | There is no account, subscription, or paid tier. | `free` |
| 4 | Required fields are marked *. | — |
| 4 | Describe paths, not credentials. | `safety-boundary` |
| 6 | Proof expires after this many days. | `portable-schema`, `proof-statuses` |
| 10 | Only record this after someone restores and opens representative data. | — |
| 7 | A ledger entry alone is not proof. | `safety-boundary` |
| 13 | The file contains 0 new, 0 newer, 0 unchanged, and 0 conflicting assets. | `merge-import` |
| 5 | No conflicts need a choice. | — |
| 11 | Merge adds new assets, updates newer assets, and skips unchanged assets. | `merge-import` |
| 7 | Replace ledger removes the current ledger first. | `merge-import` |
| 6 | You can undo either action immediately. | `merge-import` |
| 10 | Type the asset name to remove it from this browser. | — |

The demo route adds one sentence: `Five sample assets show proof that is current, due soon, never recorded, or expired, plus one coverage gap.` (18 words). Its five named states match `proof-statuses`.

No audited sentence exceeds 22 words. No banned marketing word appears.

## Terminology

| Concept | One term used |
| --- | --- |
| Product data | ledger |
| Tracked critical item | asset |
| Backup destination | backup target |
| Dated restore-test record | restore proof |
| Review schedule | proof interval |
| Recovery procedure | restore steps |
| Try-out data | sample |

`record` as a noun means one saved asset entry only. `Restore test` is the real action; `restore proof` is its dated ledger evidence. The visitor-copy regression checks `Record restore proof in three steps`, `Opens an isolated sample ledger.`, and README’s `one shared ledger.` wording.
