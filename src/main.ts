import './style.css';
import { createRecord, daysSince, getStatus, missingFields, proofExpiry, STATUS_LABELS, successCoverage } from './ledger';
import { parsePortableFile, toCsv, toYaml } from './portable';
import type { CoverageStatus, LedgerRecord, LedgerState } from './types';

const STORAGE_KEY = 'backup-coverage-ledger:v1';
const THEME_KEY = 'backup-coverage-ledger:theme';
const app = document.querySelector<HTMLDivElement>('#app')!;

let records: LedgerRecord[] = [];
let storageAvailable = true;
let activeFilter: CoverageStatus | 'all' = 'all';
let query = '';
let lastDeleted: { record: LedgerRecord; index: number } | null = null;
let returnFocus: HTMLElement | null = null;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function icon(name: 'plus' | 'download' | 'upload' | 'print' | 'check' | 'moon' | 'edit' | 'trash'): string {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
    upload: '<path d="M12 17V5m0 0 5 5m-5-5-5 5M5 21h14"/>',
    print: '<path d="M7 9V3h10v6M7 18H4V9h16v9h-3m-10-4h10v7H7z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    moon: '<path d="M20 15.3A9 9 0 1 1 8.7 4a7 7 0 0 0 11.3 11.3Z"/>',
    edit: '<path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Zm9.8-13 3.2 3.2"/>',
    trash: '<path d="M4 7h16M9 3h6l1 4M7 7l1 14h8l1-14M10 11v6m4-6v6"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function load(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as LedgerState;
    if (parsed.version !== 1 || !Array.isArray(parsed.records)) throw new Error('Unknown ledger version');
    records = parsed.records.map((record) => createRecord(record));
  } catch (error) {
    storageAvailable = false;
    records = [];
    queueMicrotask(() => announce(`Saved ledger could not be read. Export any visible data before closing. ${String(error)}`, 'error'));
  }
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records } satisfies LedgerState));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    announce('This browser blocked local saving. Export the ledger before closing this tab.', 'error');
  }
}

function sharedHeader(active: 'ledger' | 'drill' | 'none' = 'none'): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route aria-label="Backup Coverage Ledger home"><span class="mark" aria-hidden="true"><i></i><i></i></span><span>Backup Coverage<br>Ledger</span></a>
    <nav aria-label="Primary">
      <a href="/" data-route ${active === 'ledger' ? 'aria-current="page"' : ''}>Ledger</a>
      <a href="/#drill" data-route ${active === 'drill' ? 'aria-current="page"' : ''}>Restore drill</a>
    </nav>
    <div class="header-tools">
      <span class="network" id="network-state"><span aria-hidden="true"></span>${navigator.onLine ? 'Local · online' : 'Local · offline'}</span>
      <button class="icon-button" id="theme-toggle" type="button" aria-label="Use dark theme" aria-pressed="false">${icon('moon')}</button>
    </div>
  </header>`;
}

function render(): void {
  const path = location.pathname;
  if (path === '/privacy') renderPolicy('privacy');
  else if (path === '/terms') renderPolicy('terms');
  else if (location.hash === '#drill') { document.title = 'Restore drill — Backup Coverage Ledger'; renderDrill(); }
  else { document.title = 'Backup Coverage Ledger — know what can be restored'; renderLedger(); }
  bindGlobal();
  updateThemeControl();
}

function ledgerHero(): string {
  return `<section class="hero ${records.length ? 'hero--compact' : ''}" aria-labelledby="page-title">
    <div class="hero-copy">
      <p class="eyebrow"><span></span>Vendor-neutral · local-first</p>
      <h1 id="page-title">Know what can<br><em>actually</em> be restored.</h1>
      <p class="lede">Map each critical asset to its owner, backup target, recovery path, and a dated extraction proof. The ledger documents evidence—it does not run or verify backups.</p>
      ${records.length ? '' : `<div class="hero-actions"><button class="button button--primary" type="button" data-action="add">${icon('plus')} Add first asset</button><button class="button button--quiet" type="button" data-action="example">Load an example</button></div>`}
    </div>
    <figure class="hero-art">
      <picture>
        <source type="image/avif" srcset="/assets/proof-lattice-480.avif 480w, /assets/proof-lattice-960.avif 960w" sizes="(max-width: 700px) 100vw, 48vw">
        <source type="image/webp" srcset="/assets/proof-lattice-480.webp 480w, /assets/proof-lattice-960.webp 960w" sizes="(max-width: 700px) 100vw, 48vw">
        <img src="/assets/proof-lattice-960.jpg" width="960" height="640" ${records.length ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" alt="Abstract paper lattice connecting asset folders, backup planes, and proof rings; one red line remains incomplete.">
      </picture>
      <figcaption><span aria-hidden="true">○—●</span> A copy is coverage. An extraction is proof.</figcaption>
    </figure>
  </section>`;
}

function summary(): string {
  const statuses = records.map((record) => getStatus(record));
  const current = statuses.filter((status) => status === 'current' || status === 'due').length;
  const attention = records.length - current;
  const coverage = successCoverage(records);
  return `<aside class="summary" aria-label="Coverage summary">
    <div><span>30-day goal</span><strong>${coverage}%</strong><small>${coverage >= 90 ? 'Target met' : 'Target: 90%'}</small></div>
    <div><span>Current proof</span><strong>${current}<small> / ${records.length}</small></strong><small>Within each cadence</small></div>
    <div><span>Needs review</span><strong>${attention}</strong><small>Gaps or stale proof</small></div>
  </aside>`;
}

function renderLedger(): void {
  const filtered = records.filter((record) => {
    const status = getStatus(record);
    const matchesStatus = activeFilter === 'all' || status === activeFilter;
    const haystack = `${record.asset} ${record.owner} ${record.backupTarget} ${record.recoveryLocation}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  app.innerHTML = `${sharedHeader('ledger')}<main id="main">
    ${ledgerHero()}
    ${!storageAvailable ? '<div class="banner banner--danger" role="alert"><strong>Local saving is unavailable.</strong> Export before closing this tab.</div>' : ''}
    <section class="workspace" aria-labelledby="ledger-heading">
      <div class="workspace-heading"><div><p class="section-index">01 / coverage register</p><h2 id="ledger-heading">Asset ledger</h2><p>Required paths are checked automatically. Proof expires on each asset’s cadence.</p></div>${summary()}</div>
      <div class="toolbar">
        <div class="primary-actions"><button class="button button--primary" type="button" data-action="add">${icon('plus')} Add asset</button><label class="button button--quiet file-label">${icon('upload')} Import file<input id="import-file" type="file" accept=".csv,.yaml,.yml,text/csv,application/yaml,text/yaml"></label></div>
        <div class="export-actions" aria-label="Export options"><button class="button button--quiet" type="button" data-export="csv">${icon('download')} CSV</button><button class="button button--quiet" type="button" data-export="yaml">${icon('download')} YAML</button></div>
      </div>
      <div class="privacy-note"><span aria-hidden="true">⊘</span><p><strong>Keep secrets out.</strong> Record locations and procedures, never passwords, keys, tokens, or recovery codes. Everything stays in this browser until you export it.</p></div>
      ${records.length ? filterBar() : ''}
      <div id="record-list" class="record-list" aria-live="polite">${recordList(filtered)}</div>
    </section>
  </main>${footer()}${dialogs()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
  bindLedger();
}

function filterBar(): string {
  const counts = (status: CoverageStatus) => records.filter((record) => getStatus(record) === status).length;
  const options: Array<[CoverageStatus | 'all', string, number]> = [
    ['all', 'All', records.length], ['gap', 'Gaps', counts('gap')], ['unproven', 'Unproven', counts('unproven')],
    ['expired', 'Expired', counts('expired')], ['due', 'Due soon', counts('due')], ['current', 'Current', counts('current')]
  ];
  return `<div class="filter-row"><div class="filters" aria-label="Filter assets">${options.map(([key, label, count]) => `<button type="button" data-filter="${key}" aria-pressed="${activeFilter === key}">${label}<span>${count}</span></button>`).join('')}</div><label class="search"><span class="sr-only">Search assets</span><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg><input id="search" type="search" value="${escapeHtml(query)}" placeholder="Search ledger"></label></div>`;
}

function recordList(filtered: LedgerRecord[]): string {
  if (!records.length) return `<div class="empty-state"><div class="empty-geometry" aria-hidden="true"><i></i><i></i><i></i></div><p class="section-index">No records yet</p><h3>Start with the asset you’d miss first.</h3><p>Add a database, shared drive, or service data set. You can also import the portable CSV or YAML format.</p><button class="button button--primary" type="button" data-action="add">${icon('plus')} Add first asset</button></div>`;
  if (!filtered.length) return `<div class="no-results"><p>No assets match this view.</p><button type="button" class="text-button" data-action="clear-filter">Clear filters</button></div>`;
  return filtered.map(recordRow).join('');
}

function recordRow(record: LedgerRecord): string {
  const status = getStatus(record);
  const missing = missingFields(record);
  const expiry = proofExpiry(record);
  let statusDetail = '';
  if (status === 'gap') statusDetail = `Missing ${missing.map(prettyField).join(', ')}`;
  else if (status === 'unproven') statusDetail = 'No extraction has been recorded';
  else if (status === 'expired') statusDetail = record.lastProofDate ? `${daysSince(record.lastProofDate)} days since proof` : '';
  else if (status === 'due') statusDetail = `Expires ${formatDate(expiry)}`;
  else statusDetail = `${daysSince(record.lastProofDate)} days since proof`;
  return `<article class="record" data-record-id="${record.id}">
    <div class="record-primary"><span class="criticality criticality--${record.criticality}">${escapeHtml(record.criticality)}</span><h3>${escapeHtml(record.asset)}</h3><p>Owner · ${escapeHtml(record.owner || 'Not assigned')}</p></div>
    <div class="record-path"><span>Backup target</span><strong>${escapeHtml(record.backupTarget || 'Not recorded')}</strong><small>${escapeHtml(record.recoveryLocation || 'Recovery location missing')}</small></div>
    <div class="record-path"><span>Extraction</span><strong>${escapeHtml(record.extractionMethod || 'Not recorded')}</strong><small>${record.retention ? `Retention · ${escapeHtml(record.retention)}` : 'Retention not recorded'}</small></div>
    <div class="record-proof"><span class="status status--${status}"><i aria-hidden="true"></i>${STATUS_LABELS[status]}</span><small>${escapeHtml(statusDetail)}</small><button type="button" class="text-button" data-action="proof" data-id="${record.id}">Record restore proof</button></div>
    <div class="record-actions"><button class="icon-button" type="button" data-action="edit" data-id="${record.id}" aria-label="Edit ${escapeHtml(record.asset)}">${icon('edit')}</button><button class="icon-button icon-button--danger" type="button" data-action="delete" data-id="${record.id}" aria-label="Delete ${escapeHtml(record.asset)}">${icon('trash')}</button></div>
  </article>`;
}

function prettyField(field: keyof LedgerRecord): string {
  const labels: Partial<Record<keyof LedgerRecord, string>> = { owner: 'owner', backupTarget: 'backup target', recoveryLocation: 'recovery location', extractionMethod: 'extraction method', asset: 'asset name' };
  return labels[field] || field;
}

function dialogs(): string {
  return `<dialog id="asset-dialog" class="sheet"><form id="asset-form" method="dialog">
    <div class="dialog-head"><div><p class="section-index">Coverage record</p><h2 id="asset-dialog-title">Add asset</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div>
    <p class="form-note"><strong>Required fields are marked *</strong>. Describe paths, not credentials.</p>
    <input type="hidden" name="id">
    <div class="form-grid">
      ${field('asset', 'Asset or data set', true, 'Production PostgreSQL')}
      ${field('owner', 'Accountable owner', true, 'Name or team')}
      <label><span>Criticality *</span><select name="criticality" required><option value="critical">Critical</option><option value="important">Important</option><option value="routine">Routine</option></select></label>
      ${field('backupTarget', 'Backup target', true, 'e.g. Restic repository')}
      ${field('recoveryLocation', 'Recovery location', true, 'e.g. Operations runbook §4')}
      ${field('retention', 'Retention policy', false, 'e.g. 30 daily, 12 monthly')}
      <label class="span-2"><span>Extraction method *</span><textarea name="extractionMethod" rows="3" required placeholder="Commands or procedure reference—no passwords"></textarea></label>
      <label><span>Last restore proof</span><input name="lastProofDate" type="date" max="${todayIso()}"></label>
      <label><span>Proof cadence (days) *</span><input name="proofCadenceDays" type="number" min="1" max="3650" value="30" required><small>Proof is marked expired after this many days.</small></label>
      <label class="span-2"><span>Proof notes</span><textarea name="proofNotes" rows="2" placeholder="What was extracted and checked?"></textarea></label>
    </div>
    <div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--primary" type="submit">Save asset</button></div>
  </form></dialog>
  <dialog id="proof-dialog" class="sheet sheet--small"><form id="proof-form" method="dialog">
    <div class="dialog-head"><div><p class="section-index">Extraction evidence</p><h2 id="proof-dialog-title">Record restore proof</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div>
    <p class="form-note">Only record this after someone extracted and opened representative data. A ledger entry alone is not proof.</p>
    <input type="hidden" name="id">
    <label><span>Proof date *</span><input name="proofDate" type="date" required max="${todayIso()}"></label>
    <label><span>What was extracted and checked? *</span><textarea name="proofNotes" rows="4" required placeholder="Example: restored latest dump to an isolated instance; opened 10 recent records"></textarea></label>
    <div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--primary" type="submit">Record proof</button></div>
  </form></dialog>`;
}

function field(name: string, label: string, required: boolean, placeholder: string): string {
  return `<label><span>${label}${required ? ' *' : ''}</span><input name="${name}" type="text" ${required ? 'required' : ''} placeholder="${placeholder}"></label>`;
}

function bindLedger(): void {
  app.querySelectorAll<HTMLElement>('[data-action="add"]').forEach((button) => button.addEventListener('click', () => openAssetDialog(undefined, button)));
  app.querySelector('[data-action="example"]')?.addEventListener('click', loadExample);
  app.querySelector('[data-action="clear-filter"]')?.addEventListener('click', () => { activeFilter = 'all'; query = ''; render(); });
  app.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter as typeof activeFilter; render(); }));
  app.querySelector<HTMLInputElement>('#search')?.addEventListener('input', (event) => { query = (event.target as HTMLInputElement).value; renderLedger(); bindGlobal(); updateThemeControl(); requestAnimationFrame(() => { const search = app.querySelector<HTMLInputElement>('#search'); search?.focus(); search?.setSelectionRange(query.length, query.length); }); });
  app.querySelectorAll<HTMLButtonElement>('[data-action="edit"]').forEach((button) => button.addEventListener('click', () => openAssetDialog(records.find((record) => record.id === button.dataset.id), button)));
  app.querySelectorAll<HTMLButtonElement>('[data-action="proof"]').forEach((button) => button.addEventListener('click', () => openProofDialog(button.dataset.id!, button)));
  app.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach((button) => button.addEventListener('click', () => deleteRecord(button.dataset.id!)));
  app.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => exportLedger(button.dataset.export as 'csv' | 'yaml')));
  app.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importLedger);

  const assetDialog = app.querySelector<HTMLDialogElement>('#asset-dialog')!;
  const assetForm = app.querySelector<HTMLFormElement>('#asset-form')!;
  assetForm.addEventListener('submit', saveAssetForm);
  bindDialogClose(assetDialog);
  const proofDialog = app.querySelector<HTMLDialogElement>('#proof-dialog')!;
  app.querySelector<HTMLFormElement>('#proof-form')!.addEventListener('submit', saveProofForm);
  bindDialogClose(proofDialog);
}

function bindDialogClose(dialog: HTMLDialogElement): void {
  dialog.querySelectorAll<HTMLButtonElement>('[value="cancel"]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => returnFocus?.focus());
}

function openAssetDialog(record?: LedgerRecord, source?: HTMLElement): void {
  returnFocus = source || document.activeElement as HTMLElement;
  const dialog = app.querySelector<HTMLDialogElement>('#asset-dialog')!;
  const form = app.querySelector<HTMLFormElement>('#asset-form')!;
  form.reset();
  (form.elements.namedItem('id') as HTMLInputElement).value = record?.id || '';
  (form.elements.namedItem('proofCadenceDays') as HTMLInputElement).value = String(record?.proofCadenceDays || 30);
  if (record) {
    for (const key of ['asset', 'owner', 'criticality', 'backupTarget', 'recoveryLocation', 'retention', 'extractionMethod', 'lastProofDate', 'proofNotes'] as const) {
      (form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = String(record[key]);
    }
  }
  app.querySelector('#asset-dialog-title')!.textContent = record ? `Edit ${record.asset}` : 'Add asset';
  dialog.showModal();
  (form.elements.namedItem('asset') as HTMLInputElement).focus();
}

function saveAssetForm(event: SubmitEvent): void {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const proofDate = String(data.get('lastProofDate'));
  const proofNotes = String(data.get('proofNotes')).trim();
  const proofNotesInput = form.elements.namedItem('proofNotes') as HTMLTextAreaElement;
  proofNotesInput.setCustomValidity(proofDate && !proofNotes ? 'Describe what was extracted and checked, or remove the proof date.' : '');
  if (!form.reportValidity()) { proofNotesInput.focus(); return; }
  const id = String(data.get('id') || '');
  const existing = records.find((record) => record.id === id);
  const record = createRecord({
    ...existing,
    id: id || undefined,
    asset: String(data.get('asset')), owner: String(data.get('owner')),
    criticality: String(data.get('criticality')) as LedgerRecord['criticality'],
    backupTarget: String(data.get('backupTarget')), recoveryLocation: String(data.get('recoveryLocation')),
    retention: String(data.get('retention')), extractionMethod: String(data.get('extractionMethod')),
    lastProofDate: proofDate, proofNotes,
    proofCadenceDays: Number(data.get('proofCadenceDays')), updatedAt: new Date().toISOString()
  });
  if (existing) records = records.map((item) => item.id === id ? record : item);
  else records = [record, ...records];
  save();
  app.querySelector<HTMLDialogElement>('#asset-dialog')!.close();
  render();
  announce(existing ? `${record.asset} updated.` : `${record.asset} added.`);
}

function openProofDialog(id: string, source: HTMLElement): void {
  const record = records.find((item) => item.id === id);
  if (!record) return;
  returnFocus = source;
  const dialog = app.querySelector<HTMLDialogElement>('#proof-dialog')!;
  const form = app.querySelector<HTMLFormElement>('#proof-form')!;
  form.reset();
  (form.elements.namedItem('id') as HTMLInputElement).value = id;
  (form.elements.namedItem('proofDate') as HTMLInputElement).value = todayIso();
  (form.elements.namedItem('proofNotes') as HTMLTextAreaElement).value = record.proofNotes;
  app.querySelector('#proof-dialog-title')!.textContent = `Record proof · ${record.asset}`;
  dialog.showModal();
  (form.elements.namedItem('proofDate') as HTMLInputElement).focus();
}

function saveProofForm(event: SubmitEvent): void {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const id = String(data.get('id'));
  const record = records.find((item) => item.id === id);
  if (!record) return;
  record.lastProofDate = String(data.get('proofDate'));
  record.proofNotes = String(data.get('proofNotes')).trim();
  record.updatedAt = new Date().toISOString();
  save();
  app.querySelector<HTMLDialogElement>('#proof-dialog')!.close();
  render();
  announce(`Restore proof recorded for ${record.asset}.`);
}

function deleteRecord(id: string): void {
  const index = records.findIndex((record) => record.id === id);
  const record = records[index];
  if (!record || !confirm(`Delete “${record.asset}” from this browser? You can undo immediately afterward.`)) return;
  lastDeleted = { record, index };
  records.splice(index, 1);
  save(); render();
  announce(`${record.asset} deleted.`, 'undo');
}

function loadExample(): void {
  if (records.length) return;
  const date = new Date(); date.setDate(date.getDate() - 12);
  records = [createRecord({ asset: 'Customer database', owner: 'Platform team', criticality: 'critical', backupTarget: 'Encrypted object storage / daily snapshot', recoveryLocation: 'Operations runbook §4', retention: '30 daily, 12 monthly', extractionMethod: 'Restore the latest snapshot into an isolated PostgreSQL instance, then run the integrity checklist.', lastProofDate: date.toISOString().slice(0, 10), proofNotes: 'Example only: schema loaded and 10 recent records opened.', proofCadenceDays: 30 })];
  save(); render(); announce('Example asset loaded. Edit it to match your environment.');
}

async function importLedger(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('The file is larger than 2 MB. Split it into smaller ledgers.');
    const result = parsePortableFile(file.name, await file.text());
    const action = records.length ? confirm(`Import ${result.records.length} record${result.records.length === 1 ? '' : 's'}? Choose OK to add them, or Cancel to keep the current ledger unchanged.`) : true;
    if (!action) { input.value = ''; return; }
    records = [...result.records, ...records];
    save(); render();
    announce(`Imported ${result.records.length} record${result.records.length === 1 ? '' : 's'}.${result.warnings.length ? ` ${result.warnings.join(' ')}` : ''}`);
  } catch (error) {
    input.value = '';
    announce(`Import failed: ${error instanceof Error ? error.message : 'The file could not be read.'}`, 'error');
  }
}

function exportLedger(format: 'csv' | 'yaml'): void {
  if (!records.length) { announce('Add at least one asset before exporting.', 'error'); return; }
  const text = format === 'csv' ? toCsv(records) : toYaml(records);
  const blob = new Blob([text], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/yaml;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `backup-coverage-ledger-${todayIso()}.${format}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  announce(`Exported ${records.length} records as ${format.toUpperCase()}.`);
}

function renderDrill(): void {
  app.innerHTML = `${sharedHeader('drill')}<main id="main" class="drill-page">
    <section class="page-intro"><p class="eyebrow"><span></span>Printable field checklist</p><h1>Restore drill</h1><p class="lede">Prove that representative data can leave its backup and become readable again. Run this in an isolated location—never over production.</p><div class="page-actions"><button class="button button--primary" type="button" id="print-drill">${icon('print')} Print checklist</button><a class="button button--quiet" href="/" data-route>Back to ledger</a></div></section>
    <section class="drill-sheet" aria-labelledby="drill-heading"><div class="drill-meta"><div><span>Drill date</span><strong>${formatDate(todayIso())}</strong></div><div><span>Prepared from</span><strong>${records.length} ledger asset${records.length === 1 ? '' : 's'}</strong></div><div><span>Operator</span><strong class="write-line" aria-label="Blank line for operator name"></strong></div></div><h2 id="drill-heading">Extraction checklist</h2>
    ${records.length ? records.map(drillRecord).join('') : `<div class="empty-state"><p class="section-index">Nothing to drill</p><h3>Add assets to the ledger first.</h3><p>The checklist is generated from recovery locations and extraction methods in your local ledger.</p><a href="/" data-route class="button button--primary">Open ledger</a></div>`}
    <div class="drill-warning"><strong>A checked box is not automatically proof.</strong><p>Record the date and evidence in the ledger only after the extracted sample is readable and representative. Do not include secrets in notes.</p></div></section>
  </main>${footer()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
  app.querySelector('#print-drill')?.addEventListener('click', () => window.print());
}

function drillRecord(record: LedgerRecord): string {
  const steps = [
    `Confirm owner: ${record.owner || 'not assigned'}`,
    `Open recovery location: ${record.recoveryLocation || 'not recorded'}`,
    `Access backup target without copying credentials into this sheet: ${record.backupTarget || 'not recorded'}`,
    `Extract a representative sample to an isolated temporary location`,
    `Verify the sample opens and contains expected recent data`,
    `Remove temporary data and record the result in the ledger`
  ];
  return `<article class="drill-record"><div class="drill-title"><span class="criticality criticality--${record.criticality}">${record.criticality}</span><h3>${escapeHtml(record.asset)}</h3><span class="status status--${getStatus(record)}"><i aria-hidden="true"></i>${STATUS_LABELS[getStatus(record)]}</span></div><dl><div><dt>Extraction method</dt><dd>${escapeHtml(record.extractionMethod || 'Not recorded—resolve before drilling.')}</dd></div><div><dt>Expected retention</dt><dd>${escapeHtml(record.retention || 'Not recorded')}</dd></div></dl><ol>${steps.map((step, index) => `<li><label><input type="checkbox"><span>${escapeHtml(step)}</span></label>${index === 4 ? '<span class="write-line"></span>' : ''}</li>`).join('')}</ol><div class="signoff"><span>Result</span><label><input type="checkbox"> Pass</label><label><input type="checkbox"> Follow-up needed</label><span class="write-line"></span></div></article>`;
}

function renderPolicy(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  document.title = `${privacy ? 'Privacy' : 'Terms'} — Backup Coverage Ledger`;
  app.innerHTML = `${sharedHeader()}<main id="main" class="policy-page"><article><p class="eyebrow"><span></span>Plain-language policy</p><h1>${privacy ? 'Privacy' : 'Terms of use'}</h1><p class="policy-date">Effective 27 August 2026</p>${privacy ? privacyCopy() : termsCopy()}<a class="button button--quiet" href="/" data-route>Return to ledger</a></article></main>${footer()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
}

function privacyCopy(): string {
  return `<h2>Your ledger stays on your device</h2><p>Backup Coverage Ledger stores records in your browser’s local storage. It has no account system, application database, analytics, advertising, or third-party scripts. We do not receive the asset names, locations, recovery procedures, or proof notes you enter.</p><h2>Files you import and export</h2><p>Imports are parsed in your browser and are not uploaded. Exports are created locally. You control where those files go and who can read them.</p><h2>Network requests</h2><p>Opening the hosted app requests its static HTML, styles, scripts, and artwork from Sociobot’s hosting. Standard short-lived server logs may include an IP address and user agent for security and reliability. The app works offline after its shell is cached.</p><h2>Your controls</h2><p>Delete individual records in the ledger or clear this site’s storage in your browser settings. Export first if you need a copy. Do not enter credentials, keys, tokens, or recovery codes.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>`;
}

function termsCopy(): string {
  return `<h2>A documentation tool, not a backup service</h2><p>This free utility helps you document backup coverage and restore exercises. It does not create backups, access backup systems, validate credentials, guarantee retention, or certify recoverability.</p><h2>Your responsibility</h2><p>You are responsible for the accuracy and security of ledger records, for keeping credentials out of them, and for performing safe restore tests. Run drills in isolated environments and follow your organization’s change, access, and data-handling policies.</p><h2>No warranty</h2><p>The software is provided “as is,” without warranties. A current-looking ledger entry is not evidence of a successful restore unless your team actually completed and evaluated the extraction it describes.</p><h2>Acceptable use</h2><p>Do not use the tool to store secret material or to document systems you are not authorized to access. You may use, copy, and modify the software under its MIT License.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p>`;
}

function footer(): string {
  return `<footer><p>Backup Coverage Ledger <span>·</span> Local-first and free</p><nav aria-label="Legal"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://github.com/B-Divyesh/sf-backup-coverage-ledger">Source</a></nav><p class="art-credit">Original generative artwork · 2026</p></footer>`;
}

function bindGlobal(): void {
  app.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    history.pushState({}, '', `${url.pathname}${url.hash}`);
    document.title = 'Backup Coverage Ledger — know what can be restored';
    render(); window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  app.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
}

function setNetworkState(): void {
  const state = document.querySelector('#network-state');
  if (state) state.innerHTML = `<span aria-hidden="true"></span>${navigator.onLine ? 'Local · online' : 'Local · offline'}`;
  if (!navigator.onLine) announce('You are offline. The ledger still works and saves on this device.');
}

function toggleTheme(): void {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  updateThemeControl();
}

function initTheme(): void {
  const saved = localStorage.getItem(THEME_KEY);
  const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

function updateThemeControl(): void {
  const button = app.querySelector<HTMLButtonElement>('#theme-toggle');
  if (!button) return;
  const dark = document.documentElement.dataset.theme === 'dark';
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
}

function announce(message: string, type: 'default' | 'error' | 'undo' = 'default'): void {
  requestAnimationFrame(() => {
    const region = document.querySelector<HTMLDivElement>('#toast-region');
    if (!region) return;
    region.innerHTML = `<div class="toast ${type === 'error' ? 'toast--error' : ''}" role="${type === 'error' ? 'alert' : 'status'}"><span>${escapeHtml(message)}</span>${type === 'undo' ? '<button type="button" id="undo-delete">Undo</button>' : ''}<button type="button" class="toast-close" aria-label="Dismiss message">×</button></div>`;
    region.querySelector('.toast-close')?.addEventListener('click', () => { region.innerHTML = ''; });
    region.querySelector('#undo-delete')?.addEventListener('click', () => {
      if (!lastDeleted) return;
      records.splice(lastDeleted.index, 0, lastDeleted.record); lastDeleted = null; save(); render(); announce('Deletion undone.');
    });
    if (type !== 'error' && type !== 'undo') setTimeout(() => { if (region.isConnected) region.innerHTML = ''; }, 5000);
  });
}

function formatDate(date: string): string {
  if (!date) return 'Not recorded';
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}

function todayIso(): string { return new Date().toISOString().slice(0, 10); }

initTheme();
load();
render();
addEventListener('popstate', render);
addEventListener('hashchange', render);
addEventListener('online', setNetworkState);
addEventListener('offline', setNetworkState);
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
