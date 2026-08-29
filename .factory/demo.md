# Demo sandbox

- URL: <https://backup-coverage-ledger.sociobot.in/?demo=1>
- Local URL: <http://localhost:5173/?demo=1>
- Entry: select **Try it with sample data** on the first screen.
- Namespace: `demo:backup-coverage-ledger:v1` in `localStorage`.
- Real namespace: `backup-coverage-ledger:v1`.

Demo mode reads and writes only the `demo:` namespace. It never reads or writes the real ledger key.

The sample contains five assets. It shows proof that is current, due soon, never recorded, or expired, plus one coverage gap.

**Reset demo** replaces demo edits with the original five records. **Start for real** deletes the demo namespace and opens the real ledger. No sample record is copied.

The banner remains visible on the demo ledger, restore drill, privacy, and terms routes. Demo links retain `?demo=1`.
