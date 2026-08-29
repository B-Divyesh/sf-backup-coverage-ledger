import './style.css';
import { demoRecords } from './demo';
import { createRecord, daysSince, getStatus, missingFields, proofExpiry, STATUS_LABELS, successCoverage } from './ledger';
import { compareImport, mergeImport, type ImportComparison } from './merge';
import { parsePortableFile, toCsv, toYaml } from './portable';
import type { CoverageStatus, ImportResult, LedgerRecord, LedgerState } from './types';

const REAL_STORAGE_KEY = 'backup-coverage-ledger:v1';
const DEMO_STORAGE_KEY = 'demo:backup-coverage-ledger:v1';
const THEME_KEY = 'backup-coverage-ledger:theme';
const BUILD_ID = 'v1.1.3 · polish-4';
const ORIGIN = 'https://backup-coverage-ledger.sociobot.in';
const app = document.querySelector<HTMLDivElement>('#app')!;

let records: LedgerRecord[] = [];
let isDemo = new URLSearchParams(location.search).get('demo') === '1';
let storageAvailable = true;
let activeFilter: CoverageStatus | 'all' = 'all';
let query = '';
let returnFocus: HTMLElement | null = null;
let pendingImport: { result: ImportResult; comparison: ImportComparison } | null = null;
let undoAction: (() => void) | null = null;

function escapeHtml(value: unknown): string {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function icon(name: 'plus' | 'download' | 'upload' | 'print' | 'moon' | 'edit' | 'trash'): string {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
    upload: '<path d="M12 17V5m0 0 5 5m-5-5-5 5M5 21h14"/>',
    print: '<path d="M7 9V3h10v6M7 18H4V9h16v9h-3m-10-4h10v7H7z"/>',
    moon: '<path d="M20 15.3A9 9 0 1 1 8.7 4a7 7 0 0 0 11.3 11.3Z"/>',
    edit: '<path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Zm9.8-13 3.2 3.2"/>',
    trash: '<path d="M4 7h16M9 3h6l1 4M7 7l1 14h8l1-14M10 11v6m4-6v6"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function storageKey(): string { return isDemo ? DEMO_STORAGE_KEY : REAL_STORAGE_KEY; }

function load(): void {
  records = [];
  storageAvailable = true;
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw && isDemo) { records = demoRecords(); save(); return; }
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
    localStorage.setItem(storageKey(), JSON.stringify({ version: 1, records } satisfies LedgerState));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    announce('This browser blocked local saving. Export the ledger before closing this tab.', 'error');
  }
}

function demoQuery(): string { return isDemo ? '?demo=1' : ''; }
function routeHref(path: string): string { return `${path}${demoQuery()}`; }

function sharedHeader(active: 'ledger' | 'demo' | 'drill' | 'privacy' | 'none' = 'none'): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route aria-label="Backup Coverage Ledger home"><span class="mark" aria-hidden="true"><i></i><i></i></span><span>Backup Coverage<br>Ledger</span></a>
    <nav aria-label="Primary">
      <a href="/" data-route ${active === 'ledger' ? 'aria-current="page"' : ''}>Ledger</a>
      <a href="/?demo=1" data-route ${active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
      <a href="${routeHref('/drill')}" data-route ${active === 'drill' ? 'aria-current="page"' : ''}>Restore drill</a>
      <a href="${routeHref('/privacy')}" data-route ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
    </nav>
    <div class="header-tools"><span class="network" id="network-state"><span aria-hidden="true"></span>${navigator.onLine ? 'Local · online' : 'Local · offline'}</span><button class="icon-button" id="theme-toggle" type="button" aria-label="Use dark theme" aria-pressed="false">${icon('moon')}</button></div>
  </header>`;
}

function demoBanner(): string {
  if (!isDemo) return '';
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved to your ledger</strong><div><button type="button" data-action="reset-demo">Reset demo</button><button type="button" data-action="start-real">Start for real</button></div></aside>`;
}

type Route = 'ledger' | 'drill' | 'privacy' | 'terms' | '404';

function currentRoute(): Route {
  if (location.pathname === '/') return 'ledger';
  if (location.pathname === '/drill') return 'drill';
  if (location.pathname === '/privacy') return 'privacy';
  if (location.pathname === '/terms') return 'terms';
  return '404';
}

const routeMeta: Record<Route | 'demo', { title: string; description: string; path: string }> = {
  ledger: { title: 'Backup Coverage Ledger — track restore tests', description: 'Record backup owners, locations, and restore proof in a browser ledger that exports CSV and YAML.', path: '/' },
  demo: { title: 'Demo — Backup Coverage Ledger', description: 'Try an isolated sample ledger with current, due-soon, never-recorded, and expired proof, plus one coverage gap.', path: '/?demo=1' },
  drill: { title: 'Restore drill — Backup Coverage Ledger', description: 'Print a restore drill checklist from the assets in your backup coverage ledger.', path: '/drill' },
  privacy: { title: 'Privacy — Backup Coverage Ledger', description: 'Learn what Backup Coverage Ledger stores in your browser and which network requests it makes.', path: '/privacy' },
  terms: { title: 'Terms — Backup Coverage Ledger', description: 'Read the terms and safety boundaries for Backup Coverage Ledger.', path: '/terms' },
  '404': { title: 'Page not found — Backup Coverage Ledger', description: 'This Backup Coverage Ledger page does not exist. Return to the ledger.', path: '/404.html' }
};

function updateMetadata(route: Route): void {
  const meta = route === 'ledger' && isDemo ? routeMeta.demo : routeMeta[route];
  document.title = meta.title;
  const fields: Array<[string, string]> = [['meta[name="description"]', meta.description], ['meta[property="og:title"]', meta.title], ['meta[property="og:description"]', meta.description], ['meta[property="og:url"]', `${ORIGIN}${meta.path}`], ['meta[name="twitter:title"]', meta.title], ['meta[name="twitter:description"]', meta.description]];
  for (const [selector, value] of fields) document.querySelector(selector)?.setAttribute('content', value);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${ORIGIN}${meta.path}`);
}

function render(moveFocus = false): void {
  const newDemo = new URLSearchParams(location.search).get('demo') === '1';
  if (newDemo !== isDemo) { isDemo = newDemo; activeFilter = 'all'; query = ''; load(); }
  const route = currentRoute(); updateMetadata(route);
  if (route === 'ledger') renderLedger();
  else if (route === 'drill') renderDrill();
  else if (route === 'privacy' || route === 'terms') renderPolicy(route);
  else renderNotFound();
  bindGlobal(); updateThemeControl(); if (moveFocus) focusRoute();
}

function ledgerHero(): string {
  if (isDemo) return `<section class="demo-intro" aria-labelledby="page-title"><p class="eyebrow"><span></span>Isolated sample ledger</p><h1 id="page-title">Review a sample backup ledger</h1><p>Five sample assets show proof that is current, due soon, never recorded, or expired, plus one coverage gap.</p></section>`;
  return `<section class="hero ${records.length ? 'hero--compact' : ''}" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow"><span></span>Backup coverage ledger</p><h1 id="page-title">Track backup coverage and restore tests</h1><p class="lede">For small IT teams that need one record of each critical asset, its backup, owner, and latest restore test.</p><div class="hero-actions"><a class="button button--primary" href="/?demo=1" data-route>Try it with sample data</a><span class="action-note">Opens an isolated sample ledger.</span></div><ul class="hero-facts" aria-label="Product facts"><li>Free</li><li>Works offline after the first visit</li><li>Stored in this browser</li></ul></div><figure class="hero-art"><picture><source type="image/avif" srcset="/assets/proof-lattice-480.avif 480w, /assets/proof-lattice-960.avif 960w" sizes="(max-width: 700px) 100vw, 48vw"><source type="image/webp" srcset="/assets/proof-lattice-480.webp 480w, /assets/proof-lattice-960.webp 960w" sizes="(max-width: 700px) 100vw, 48vw"><img src="/assets/proof-lattice-960.jpg" width="960" height="640" ${records.length ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" alt="Paper geometry links backup folders to restore-proof rings; one red line stops before its ring."></picture><figcaption><span aria-hidden="true">○—●</span> A listed backup is not restore proof. Record proof after someone restores and opens representative data.</figcaption></figure></section>`;
}

function summary(): string {
  const statuses = records.map((record) => getStatus(record));
  const current = statuses.filter((status) => status === 'current' || status === 'due').length;
  const attention = records.length - current;
  const criticalCount = records.filter((record) => record.criticality === 'critical').length;
  const coverage = successCoverage(records);
  const goal = criticalCount ? `<strong>${coverage}%</strong><small>${coverage >= 90 ? 'Target met' : 'Target: 90%'}</small>` : '<strong>—</strong><small>No critical assets listed</small>';
  return `<aside class="summary" aria-label="Coverage summary"><div><span>Critical assets proved in 30 days</span>${goal}</div><div><span>Proof within each interval</span><strong>${current}<small> / ${records.length}</small></strong><small>Current or due soon</small></div><div><span>Assets with gaps or stale proof</span><strong>${attention}</strong><small>Needs review</small></div></aside>`;
}

function renderLedger(): void {
  const filtered = records.filter((record) => (activeFilter === 'all' || getStatus(record) === activeFilter) && `${record.asset} ${record.owner} ${record.backupTarget} ${record.recoveryLocation}`.toLowerCase().includes(query.toLowerCase()));
  const controls = `<div class="toolbar"><div class="primary-actions"><button class="button button--primary" type="button" data-action="add">${icon('plus')} Add asset</button><label class="button button--quiet file-label">${icon('upload')} Import file<input id="import-file" type="file" accept=".csv,.yaml,.yml,text/csv,application/yaml,text/yaml"></label></div><div class="export-actions" aria-label="Export options"><button class="button button--quiet" type="button" data-export="csv">${icon('download')} Export CSV</button><button class="button button--quiet" type="button" data-export="yaml">${icon('download')} Export YAML</button></div></div><div class="privacy-note"><span aria-hidden="true">⊘</span><p><strong>Keep secrets out.</strong> Records stay in this browser. Imports and exports run here too.</p></div>${records.length ? filterBar() : ''}`;
  const list = `<div id="record-list" class="record-list" aria-live="polite">${recordList(filtered)}</div>`;
  app.innerHTML = `${sharedHeader(isDemo ? 'demo' : 'ledger')}${demoBanner()}<main id="main" class="${isDemo ? 'demo-main' : ''}">${ledgerHero()}${!storageAvailable ? '<div class="banner banner--danger" role="alert"><strong>Local saving is unavailable.</strong> Export before closing this tab.</div>' : ''}<section class="workspace" aria-labelledby="ledger-heading"><div class="workspace-heading"><div><h2 id="ledger-heading">Asset ledger</h2><p>The ledger flags missing owners, backup targets, recovery locations, and restore steps. It marks proof expired after each asset’s chosen interval.</p></div>${summary()}</div>${isDemo ? `${list}${controls}` : `${controls}${list}`}</section>${isDemo ? '' : landingSections()}</main>${footer()}${dialogs()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
  bindLedger();
}

function landingSections(): string {
  return `<section class="info-section" aria-labelledby="how-heading"><p class="eyebrow"><span></span>How it works</p><h2 id="how-heading">Record restore proof in three steps</h2><ol class="steps"><li><strong>List each asset</strong><span>Add its owner, backup target, and recovery location.</span></li><li><strong>Run a restore test</strong><span>Restore representative data in an isolated place.</span></li><li><strong>Record the proof</strong><span>Add the date and what your team opened.</span></li></ol></section><section class="info-section boundary-section" aria-labelledby="limits-heading"><div><p class="eyebrow"><span></span>Clear limits</p><h2 id="limits-heading">A record is not a successful restore</h2><p>The ledger does not run backups, open backup systems, or store credentials. Your team performs and checks every restore test.</p></div><div class="privacy-block"><h3>Your ledger stays local</h3><p>Records use this browser’s storage. Export a file when your team needs to share or archive the ledger.</p><a href="/privacy" data-route>Read the privacy details</a></div></section><section class="price-section" aria-labelledby="price-heading"><p class="eyebrow"><span></span>Price</p><h2 id="price-heading">Use every feature for free</h2><p>There is no account, subscription, or paid tier.</p><a class="button button--primary" href="/?demo=1" data-route>Try it with sample data</a></section>`;
}

function filterBar(): string {
  const counts = (status: CoverageStatus) => records.filter((record) => getStatus(record) === status).length;
  const options: Array<[CoverageStatus | 'all', string, number]> = [['all', 'Show all', records.length], ['gap', 'Show gaps', counts('gap')], ['unproven', 'Show unproven', counts('unproven')], ['expired', 'Show expired', counts('expired')], ['due', 'Show due soon', counts('due')], ['current', 'Show current', counts('current')]];
  return `<div class="filter-row"><div class="filters" aria-label="Filter assets">${options.map(([key, label, count]) => `<button type="button" data-filter="${key}" aria-pressed="${activeFilter === key}">${label}<span>${count}</span></button>`).join('')}</div><label class="search"><span class="sr-only">Search assets</span><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg><input id="search" type="search" value="${escapeHtml(query)}" placeholder="Search ledger"></label></div>`;
}

function recordList(filtered: LedgerRecord[]): string {
  if (!records.length) return `<div class="empty-state"><div class="empty-geometry" aria-hidden="true"><i></i><i></i><i></i></div><h3>No backup records yet</h3><p>Add the critical asset you would miss first. You can also import a CSV or flat YAML file.</p><button class="button button--primary" type="button" data-action="add">${icon('plus')} Add first asset</button></div>`;
  if (!filtered.length) return `<div class="no-results"><p>No assets match this view.</p><button type="button" class="text-button" data-action="clear-filter">Clear filters</button></div>`;
  return filtered.map(recordRow).join('');
}

function recordRow(record: LedgerRecord): string {
  const status = getStatus(record); const missing = missingFields(record); const expiry = proofExpiry(record);
  const detail = status === 'gap' ? `Missing ${missing.map(prettyField).join(', ')}` : status === 'unproven' ? 'No restore proof has been recorded' : status === 'expired' ? `${daysSince(record.lastProofDate)} days since proof` : status === 'due' ? `Expires ${formatDate(expiry)}` : `${daysSince(record.lastProofDate)} days since proof`;
  return `<article class="record" data-record-id="${escapeHtml(record.id)}"><div class="record-primary"><span class="criticality criticality--${record.criticality}">${escapeHtml(record.criticality)}</span><h3>${escapeHtml(record.asset)}</h3><p>Owner · ${escapeHtml(record.owner || 'Not assigned')}</p></div><div class="record-path"><span>Backup target</span><strong>${escapeHtml(record.backupTarget || 'Not recorded')}</strong><small>${escapeHtml(record.recoveryLocation || 'Recovery location missing')}</small></div><div class="record-path"><span>Restore steps</span><strong>${escapeHtml(record.extractionMethod || 'Not recorded')}</strong><small>${record.retention ? `Retention · ${escapeHtml(record.retention)}` : 'Retention not recorded'}</small></div><div class="record-proof"><span class="status status--${status}"><i aria-hidden="true"></i>${STATUS_LABELS[status]}</span><small>${escapeHtml(detail)}</small><button type="button" class="text-button" data-action="proof" data-id="${escapeHtml(record.id)}" aria-label="Record restore proof for ${escapeHtml(record.asset)}">Record restore proof</button></div><div class="record-actions"><button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(record.id)}" aria-label="Edit ${escapeHtml(record.asset)}">${icon('edit')}</button><button class="icon-button icon-button--danger" type="button" data-action="delete" data-id="${escapeHtml(record.id)}" aria-label="Delete ${escapeHtml(record.asset)}">${icon('trash')}</button></div></article>`;
}

function prettyField(field: keyof LedgerRecord): string {
  const labels: Partial<Record<keyof LedgerRecord, string>> = { owner: 'owner', backupTarget: 'backup target', recoveryLocation: 'recovery location', extractionMethod: 'restore steps', asset: 'asset name' };
  return labels[field] || field;
}

function dialogs(): string {
  return `<dialog id="asset-dialog" class="sheet"><form id="asset-form" method="dialog"><div class="dialog-head"><div><p class="section-index">Asset record</p><h2 id="asset-dialog-title">Add asset</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div><p class="form-note"><strong>Required fields are marked *</strong>. Describe paths, not credentials.</p><input type="hidden" name="id"><div class="form-grid">${field('asset', 'Asset', true, 'Production PostgreSQL')}${field('owner', 'Accountable owner', true, 'Name or team')}<label><span>Criticality *</span><select name="criticality" required><option value="critical">Critical</option><option value="important">Important</option><option value="routine">Routine</option></select></label>${field('backupTarget', 'Backup target', true, 'e.g. Restic repository')}${field('recoveryLocation', 'Recovery location', true, 'e.g. Operations runbook §4')}${field('retention', 'Retention policy', false, 'e.g. 30 daily, 12 monthly')}<label class="span-2"><span>Restore steps *</span><textarea name="extractionMethod" rows="3" required placeholder="Commands or procedure reference—no passwords"></textarea></label><label><span>Last restore proof</span><input name="lastProofDate" type="date" max="${todayIso()}"></label><label><span>Proof interval (days) *</span><input name="proofCadenceDays" type="number" min="1" max="3650" value="30" required><small>Proof expires after this many days.</small></label><label class="span-2"><span>Proof notes</span><textarea name="proofNotes" rows="2" placeholder="What was restored and checked?"></textarea></label></div><div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--primary" type="submit">Save asset</button></div></form></dialog>
  <dialog id="proof-dialog" class="sheet sheet--small"><form id="proof-form" method="dialog"><div class="dialog-head"><div><p class="section-index">Restore proof</p><h2 id="proof-dialog-title">Record restore proof</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div><p class="form-note">Only record this after someone restores and opens representative data. A ledger entry alone is not proof.</p><input type="hidden" name="id"><label><span>Proof date *</span><input name="proofDate" type="date" required max="${todayIso()}"></label><label><span>What was restored and checked? *</span><textarea name="proofNotes" rows="4" required></textarea></label><div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--primary" type="submit">Record proof</button></div></form></dialog>
  <dialog id="import-dialog" class="sheet sheet--small"><form id="import-form" method="dialog"><div class="dialog-head"><div><p class="section-index">Import comparison</p><h2>Review file changes</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div><div id="import-preview"></div><div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--quiet" type="button" id="replace-import">Replace ledger</button><button class="button button--primary" type="submit">Merge file</button></div></form></dialog>
  <dialog id="delete-dialog" class="sheet sheet--small"><form id="delete-form" method="dialog"><div class="dialog-head"><div><p class="section-index">Delete asset</p><h2 id="delete-title">Confirm deletion</h2></div><button class="dialog-close" type="button" value="cancel" aria-label="Close dialog">×</button></div><p>Type the asset name to remove it from this browser.</p><input type="hidden" name="id"><label><span>Asset name *</span><input name="confirmation" required autocomplete="off"><small id="delete-help"></small></label><div class="dialog-actions"><button class="button button--quiet" type="button" value="cancel">Cancel</button><button class="button button--danger" type="submit">Delete asset</button></div></form></dialog>`;
}

function field(name: string, label: string, required: boolean, placeholder: string): string {
  return `<label><span>${label}${required ? ' *' : ''}</span><input name="${name}" type="text" ${required ? 'required' : ''} placeholder="${placeholder}"></label>`;
}

function bindLedger(): void {
  app.querySelectorAll<HTMLElement>('[data-action="add"]').forEach((button) => button.addEventListener('click', () => openAssetDialog(undefined, button)));
  app.querySelector('[data-action="clear-filter"]')?.addEventListener('click', () => { activeFilter = 'all'; query = ''; render(); });
  app.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter as typeof activeFilter; render(); }));
  app.querySelector<HTMLInputElement>('#search')?.addEventListener('input', (event) => { query = (event.target as HTMLInputElement).value; renderLedger(); bindGlobal(); updateThemeControl(); requestAnimationFrame(() => { const search = app.querySelector<HTMLInputElement>('#search'); search?.focus(); search?.setSelectionRange(query.length, query.length); }); });
  app.querySelectorAll<HTMLButtonElement>('[data-action="edit"]').forEach((button) => button.addEventListener('click', () => openAssetDialog(records.find((record) => record.id === button.dataset.id), button)));
  app.querySelectorAll<HTMLButtonElement>('[data-action="proof"]').forEach((button) => button.addEventListener('click', () => openProofDialog(button.dataset.id!, button)));
  app.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach((button) => button.addEventListener('click', () => openDeleteDialog(button.dataset.id!, button)));
  app.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => exportLedger(button.dataset.export as 'csv' | 'yaml')));
  app.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importLedger);
  app.querySelector<HTMLFormElement>('#asset-form')!.addEventListener('submit', saveAssetForm);
  app.querySelector<HTMLFormElement>('#proof-form')!.addEventListener('submit', saveProofForm);
  app.querySelector<HTMLFormElement>('#import-form')!.addEventListener('submit', applyMergedImport);
  app.querySelector('#replace-import')!.addEventListener('click', replaceImport);
  app.querySelector<HTMLFormElement>('#delete-form')!.addEventListener('submit', confirmDelete);
  app.querySelectorAll<HTMLDialogElement>('dialog').forEach(bindDialogClose);
}

function bindDialogClose(dialog: HTMLDialogElement): void {
  dialog.querySelectorAll<HTMLButtonElement>('[value="cancel"]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => returnFocus?.focus());
}

function openAssetDialog(record?: LedgerRecord, source?: HTMLElement): void {
  returnFocus = source || document.activeElement as HTMLElement;
  const dialog = app.querySelector<HTMLDialogElement>('#asset-dialog')!;
  const form = app.querySelector<HTMLFormElement>('#asset-form')!; form.reset();
  (form.elements.namedItem('id') as HTMLInputElement).value = record?.id || '';
  (form.elements.namedItem('proofCadenceDays') as HTMLInputElement).value = String(record?.proofCadenceDays || 30);
  if (record) for (const key of ['asset', 'owner', 'criticality', 'backupTarget', 'recoveryLocation', 'retention', 'extractionMethod', 'lastProofDate', 'proofNotes'] as const) (form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = String(record[key]);
  app.querySelector('#asset-dialog-title')!.textContent = record ? `Edit ${record.asset}` : 'Add asset';
  dialog.showModal(); (form.elements.namedItem('asset') as HTMLInputElement).focus();
}

function saveAssetForm(event: SubmitEvent): void {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form);
  const proofDate = String(data.get('lastProofDate')); const proofNotes = String(data.get('proofNotes')).trim();
  const notesInput = form.elements.namedItem('proofNotes') as HTMLTextAreaElement;
  notesInput.setCustomValidity(proofDate && !proofNotes ? 'Describe what was restored and checked, or remove the proof date.' : '');
  if (!form.reportValidity()) { notesInput.focus(); return; }
  const id = String(data.get('id') || ''); const existing = records.find((record) => record.id === id);
  const record = createRecord({ ...existing, id: id || undefined, asset: String(data.get('asset')), owner: String(data.get('owner')), criticality: String(data.get('criticality')) as LedgerRecord['criticality'], backupTarget: String(data.get('backupTarget')), recoveryLocation: String(data.get('recoveryLocation')), retention: String(data.get('retention')), extractionMethod: String(data.get('extractionMethod')), lastProofDate: proofDate, proofNotes, proofCadenceDays: Number(data.get('proofCadenceDays')), updatedAt: new Date().toISOString() });
  records = existing ? records.map((item) => item.id === id ? record : item) : [record, ...records];
  save(); dialogClose('#asset-dialog'); render(); announce(existing ? `${record.asset} updated.` : `${record.asset} added.`);
}

function openProofDialog(id: string, source: HTMLElement): void {
  const record = records.find((item) => item.id === id); if (!record) return; returnFocus = source;
  const dialog = app.querySelector<HTMLDialogElement>('#proof-dialog')!; const form = app.querySelector<HTMLFormElement>('#proof-form')!; form.reset();
  (form.elements.namedItem('id') as HTMLInputElement).value = id; (form.elements.namedItem('proofDate') as HTMLInputElement).value = todayIso(); (form.elements.namedItem('proofNotes') as HTMLTextAreaElement).value = record.proofNotes;
  app.querySelector('#proof-dialog-title')!.textContent = `Record proof · ${record.asset}`; dialog.showModal(); (form.elements.namedItem('proofDate') as HTMLInputElement).focus();
}

function saveProofForm(event: SubmitEvent): void {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; if (!form.reportValidity()) return;
  const data = new FormData(form); const record = records.find((item) => item.id === String(data.get('id'))); if (!record) return;
  record.lastProofDate = String(data.get('proofDate')); record.proofNotes = String(data.get('proofNotes')).trim(); record.updatedAt = new Date().toISOString();
  save(); dialogClose('#proof-dialog'); render(); announce(`Restore proof recorded for ${record.asset}.`);
}

function openDeleteDialog(id: string, source: HTMLElement): void {
  const record = records.find((item) => item.id === id); if (!record) return; returnFocus = source;
  const form = app.querySelector<HTMLFormElement>('#delete-form')!; form.reset(); (form.elements.namedItem('id') as HTMLInputElement).value = id;
  app.querySelector('#delete-title')!.textContent = `Delete ${record.asset}?`; app.querySelector('#delete-help')!.textContent = `Type “${record.asset}” exactly.`;
  app.querySelector<HTMLDialogElement>('#delete-dialog')!.showModal(); (form.elements.namedItem('confirmation') as HTMLInputElement).focus();
}

function confirmDelete(event: SubmitEvent): void {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form);
  const index = records.findIndex((record) => record.id === String(data.get('id'))); const record = records[index]; if (!record) return;
  const confirmation = form.elements.namedItem('confirmation') as HTMLInputElement; confirmation.setCustomValidity(confirmation.value === record.asset ? '' : `Type ${record.asset} exactly.`);
  if (!form.reportValidity()) return;
  const snapshot = records.map((item) => ({ ...item })); records.splice(index, 1); save(); dialogClose('#delete-dialog'); render();
  undoAction = () => { records = snapshot; save(); render(); announce('Deletion undone.'); }; announce(`${record.asset} deleted.`, 'undo');
}

async function importLedger(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('The file is larger than 2 MB. Split it into smaller ledgers.');
    const result = parsePortableFile(file.name, await file.text()); pendingImport = { result, comparison: compareImport(records, result.records) }; openImportDialog(input);
  } catch (error) {
    input.value = ''; announce(`Import failed: ${error instanceof Error ? error.message : 'The file could not be read.'}`, 'error');
  }
}

function openImportDialog(source: HTMLElement): void {
  if (!pendingImport) return; returnFocus = source; const { comparison } = pendingImport;
  const conflicts = comparison.conflicts.map(({ current, imported }) => `<label class="conflict-choice"><span>${escapeHtml(current.asset)} changed in both ledgers</span><select name="conflict:${escapeHtml(current.id)}"><option value="current">Keep current version</option><option value="imported">Use imported version (${escapeHtml(imported.updatedAt.slice(0, 10))})</option></select></label>`).join('');
  app.querySelector('#import-preview')!.innerHTML = `<p>The file contains <strong>${comparison.added.length} new</strong>, <strong>${comparison.updated.length} newer</strong>, <strong>${comparison.unchanged.length} unchanged</strong>, and <strong>${comparison.conflicts.length} conflicting</strong> assets.</p>${conflicts || '<p>No conflicts need a choice. Merge adds new assets, updates newer assets, and skips unchanged assets.</p>'}<p class="form-note">Replace ledger removes the current ledger first. You can undo either action immediately.</p>`;
  app.querySelector<HTMLDialogElement>('#import-dialog')!.showModal(); app.querySelector<HTMLButtonElement>('#import-form button[type="submit"]')!.focus();
}

function applyMergedImport(event: SubmitEvent): void {
  event.preventDefault(); if (!pendingImport) return;
  const snapshot = records.map((record) => ({ ...record })); const data = new FormData(event.currentTarget as HTMLFormElement); const choices: Record<string, 'current' | 'imported'> = {};
  for (const conflict of pendingImport.comparison.conflicts) choices[conflict.current.id] = data.get(`conflict:${conflict.current.id}`) === 'imported' ? 'imported' : 'current';
  records = mergeImport(records, pendingImport.comparison, choices);
  finishImport(snapshot, `Merged file: ${pendingImport.comparison.added.length} added, ${pendingImport.comparison.updated.length} updated, ${pendingImport.comparison.unchanged.length} unchanged.`);
}

function replaceImport(): void {
  if (!pendingImport) return; const snapshot = records.map((record) => ({ ...record })); records = pendingImport.result.records;
  finishImport(snapshot, `Replaced the ledger with ${records.length} imported assets.`);
}

function finishImport(snapshot: LedgerRecord[], message: string): void {
  save(); dialogClose('#import-dialog'); pendingImport = null; render();
  undoAction = () => { records = snapshot; save(); render(); announce('Import undone.'); }; announce(message, 'undo');
}

function exportLedger(format: 'csv' | 'yaml'): void {
  if (!records.length) { announce('Add at least one asset before exporting.', 'error'); return; }
  const text = format === 'csv' ? toCsv(records) : toYaml(records); const blob = new Blob([text], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/yaml;charset=utf-8' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `backup-coverage-ledger-${todayIso()}.${format}`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 0);
  announce(`Exported ${records.length} assets as ${format.toUpperCase()}.`);
}

function renderDrill(): void {
  app.innerHTML = `${sharedHeader('drill')}${demoBanner()}<main id="main" class="drill-page"><section class="page-intro"><p class="eyebrow"><span></span>Printable restore checklist</p><h1>Run a restore drill</h1><p class="lede">Restore representative data in an isolated place. Check that the data opens before recording proof.</p><div class="page-actions"><button class="button button--primary" type="button" id="print-drill">${icon('print')} Print checklist</button><a class="button button--quiet" href="${routeHref('/')}" data-route>Back to ledger</a></div></section><section class="drill-sheet" aria-labelledby="drill-heading"><div class="drill-meta"><div><span>Drill date</span><strong>${formatDate(todayIso())}</strong></div><div><span>Prepared from</span><strong>${records.length} ledger asset${records.length === 1 ? '' : 's'}</strong></div><label><span>Operator</span><input type="text" aria-label="Operator name"></label></div><h2 id="drill-heading">Restore checklist</h2>${records.length ? records.map(drillRecord).join('') : `<div class="empty-state"><h3>No assets to test yet</h3><p>Add assets to the ledger before making a checklist.</p><a href="${routeHref('/')}" data-route class="button button--primary">Open ledger</a></div>`}<div class="drill-warning"><strong>A checked box is not proof by itself.</strong><p>Record proof only after the restored sample is readable and representative. Keep secrets out of notes.</p></div></section></main>${footer()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
  app.querySelector('#print-drill')?.addEventListener('click', () => window.print());
}

function drillRecord(record: LedgerRecord): string {
  const steps = [`Confirm owner: ${record.owner || 'not assigned'}`, `Open recovery location: ${record.recoveryLocation || 'not recorded'}`, `Access backup target without copying credentials: ${record.backupTarget || 'not recorded'}`, 'Restore a representative sample to an isolated temporary location', 'Check that the sample opens and contains expected recent data', 'Remove temporary data and record the result in the ledger'];
  return `<article class="drill-record"><div class="drill-title"><span class="criticality criticality--${record.criticality}">${record.criticality}</span><h3>${escapeHtml(record.asset)}</h3><span class="status status--${getStatus(record)}"><i aria-hidden="true"></i>${STATUS_LABELS[getStatus(record)]}</span></div><dl><div><dt>Restore steps</dt><dd>${escapeHtml(record.extractionMethod || 'Not recorded—resolve before the drill.')}</dd></div><div><dt>Expected retention</dt><dd>${escapeHtml(record.retention || 'Not recorded')}</dd></div></dl><ol>${steps.map((step, index) => `<li><label><input type="checkbox"><span>${escapeHtml(step)}</span></label>${index === 4 ? '<span class="write-line" aria-hidden="true"></span>' : ''}</li>`).join('')}</ol><div class="signoff"><span>Result</span><label><input type="checkbox"> Pass</label><label><input type="checkbox"> Follow-up needed</label><span class="write-line" aria-hidden="true"></span></div></article>`;
}

function renderPolicy(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  app.innerHTML = `${sharedHeader(privacy ? 'privacy' : 'none')}${demoBanner()}<main id="main" class="policy-page"><article><p class="eyebrow"><span></span>Plain-language policy</p><h1>${privacy ? 'Privacy' : 'Terms of use'}</h1><p class="policy-date">Effective 28 August 2026</p>${privacy ? privacyCopy() : termsCopy()}<a class="button button--quiet" href="${routeHref('/')}" data-route>Return to ledger</a></article></main>${footer()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
}

function privacyCopy(): string {
  return `<h2>Your ledger stays on your device</h2><p>Records use your browser’s local storage. The app has no account, analytics, advertising, or third-party scripts.</p><p>We do not receive the asset names, locations, restore steps, or proof notes you enter.</p><h2>Files you import and export</h2><p>The browser parses imports and creates exports. You control where exported files go and who can read them.</p><h2>Network requests</h2><p>The hosted app requests its own HTML, styles, scripts, and artwork. Short-lived hosting logs may include an IP address and browser details.</p><h2>Your controls</h2><p>Delete records in the ledger or clear this site’s storage. Export first if you need a copy.</p><p>Do not enter credentials, keys, tokens, or recovery codes.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p>`;
}

function termsCopy(): string {
  return `<h2>A record, not a backup service</h2><p>This free tool documents backup coverage and restore tests. It does not create backups, access backup systems, or certify recovery.</p><h2>Your responsibility</h2><p>You are responsible for accurate records and safe restore tests. Follow your organization’s access and data-handling rules.</p><h2>No warranty</h2><p>The software is provided “as is,” without warranties. A ledger entry is proof only after your team completes the recorded restore test.</p><h2>Acceptable use</h2><p>Do not store secrets or document systems you cannot access. You may use and modify the software under the MIT License.</p><h2>Contact</h2><p>Email <a href="mailto:hello@sociobot.in">hello@sociobot.in</a> with questions.</p>`;
}

function renderNotFound(): void {
  app.innerHTML = `${sharedHeader()}<main id="main" class="not-found"><div class="broken-lattice" aria-hidden="true"><i></i><i></i><i></i></div><p class="eyebrow"><span></span>Error 404</p><h1>That ledger page is missing</h1><p>The address does not match a page in Backup Coverage Ledger.</p><a class="button button--primary" href="/" data-route>Return to the ledger</a></main>${footer()}<div id="toast-region" class="toast-region" aria-live="polite"></div>`;
}

function footer(): string {
  return `<footer><p>Track backup owners, locations, and restore proof.</p><nav aria-label="Legal"><a href="${routeHref('/privacy')}" data-route>Privacy</a><a href="${routeHref('/terms')}" data-route>Terms</a><a href="https://github.com/B-Divyesh/sf-backup-coverage-ledger" rel="external">Source on GitHub (external)</a></nav><p class="art-credit">Built by Param Factory · ${BUILD_ID}<br>Original generative artwork</p></footer>`;
}

function bindGlobal(): void {
  app.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href); if (url.origin !== location.origin) return; event.preventDefault(); history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`); render(true); window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  app.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  app.querySelectorAll('[data-action="reset-demo"]').forEach((button) => button.addEventListener('click', resetDemo));
  app.querySelectorAll('[data-action="start-real"]').forEach((button) => button.addEventListener('click', startReal));
}

function resetDemo(): void { if (!isDemo) return; records = demoRecords(); save(); activeFilter = 'all'; query = ''; render(); announce('Demo reset to the original sample data.'); }
function startReal(): void { localStorage.removeItem(DEMO_STORAGE_KEY); history.pushState({}, '', '/'); isDemo = false; load(); render(true); window.scrollTo(0, 0); }

function focusRoute(): void {
  requestAnimationFrame(() => { const heading = app.querySelector<HTMLElement>('h1'); if (!heading) return; heading.tabIndex = -1; heading.focus(); const announcer = document.querySelector('#route-status'); if (announcer) announcer.textContent = `${heading.textContent?.trim()} page loaded`; });
}

function setNetworkState(): void {
  const state = document.querySelector('#network-state'); if (state) state.innerHTML = `<span aria-hidden="true"></span>${navigator.onLine ? 'Local · online' : 'Local · offline'}`;
  if (!navigator.onLine) announce('You are offline. The ledger still works and saves on this device.');
}

function toggleTheme(): void {
  const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); updateThemeControl();
}

function initTheme(): void {
  const saved = localStorage.getItem(THEME_KEY); const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

function updateThemeControl(): void {
  const button = app.querySelector<HTMLButtonElement>('#theme-toggle'); if (!button) return; const dark = document.documentElement.dataset.theme === 'dark'; button.setAttribute('aria-pressed', String(dark)); button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
}

function announce(message: string, type: 'default' | 'error' | 'undo' = 'default'): void {
  requestAnimationFrame(() => {
    const region = document.querySelector<HTMLDivElement>('#toast-region'); if (!region) return;
    region.innerHTML = `<div class="toast ${type === 'error' ? 'toast--error' : ''}" role="${type === 'error' ? 'alert' : 'status'}"><span>${escapeHtml(message)}</span>${type === 'undo' ? '<button type="button" id="undo-action">Undo</button>' : ''}<button type="button" class="toast-close" aria-label="Dismiss message">×</button></div>`;
    region.querySelector('.toast-close')?.addEventListener('click', () => { region.innerHTML = ''; }); region.querySelector('#undo-action')?.addEventListener('click', () => { const action = undoAction; undoAction = null; action?.(); });
    if (type === 'default') setTimeout(() => { if (region.isConnected) region.innerHTML = ''; }, 5000);
  });
}

function dialogClose(selector: string): void { app.querySelector<HTMLDialogElement>(selector)?.close(); }
function formatDate(date: string): string { if (!date) return 'Not recorded'; const parsed = new Date(`${date}T00:00:00`); return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed); }
function todayIso(): string { return new Date().toISOString().slice(0, 10); }

initTheme(); load(); render();
addEventListener('popstate', () => render(true));
addEventListener('online', setNetworkState); addEventListener('offline', setNetworkState);
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
