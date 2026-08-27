import { createRecord } from './ledger';
import type { Criticality, ImportResult, LedgerRecord } from './types';

export const COLUMNS = [
  'asset', 'owner', 'criticality', 'backupTarget', 'recoveryLocation', 'retention',
  'extractionMethod', 'lastProofDate', 'proofNotes', 'proofCadenceDays'
] as const;

function csvCell(value: unknown): string {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(records: LedgerRecord[]): string {
  const lines = [COLUMNS.join(',')];
  for (const record of records) lines.push(COLUMNS.map((key) => csvCell(record[key])).join(','));
  return `${lines.join('\n')}\n`;
}

export function parseCsv(text: string): ImportResult {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      if (row.some((part) => part.trim())) rows.push(row);
      row = [];
    } else cell += char;
  }
  if (quoted) throw new Error('The CSV has an unclosed quoted field.');
  row.push(cell);
  if (row.some((part) => part.trim())) rows.push(row);
  if (!rows.length) throw new Error('The CSV file is empty.');

  const headers = rows[0]!.map((value) => value.trim());
  for (const required of ['asset', 'owner', 'backupTarget', 'recoveryLocation']) {
    if (!headers.includes(required)) throw new Error(`CSV is missing the “${required}” column.`);
  }
  const warnings: string[] = [];
  const records = rows.slice(1).map((values, index) => {
    const raw: Record<string, string> = {};
    headers.forEach((header, column) => { raw[header] = values[column]?.trim() || ''; });
    if (!raw.asset) throw new Error(`Row ${index + 2} needs an asset name.`);
    const criticality = normalizeCriticality(raw.criticality, index + 2, warnings);
    return createRecord({
      asset: raw.asset, owner: raw.owner, criticality,
      backupTarget: raw.backupTarget, recoveryLocation: raw.recoveryLocation,
      retention: raw.retention, extractionMethod: raw.extractionMethod,
      lastProofDate: raw.lastProofDate, proofNotes: raw.proofNotes,
      proofCadenceDays: Number(raw.proofCadenceDays || 30)
    });
  });
  return { records, warnings };
}

function normalizeCriticality(value: string | undefined, row: number, warnings: string[]): Criticality {
  if (value === 'critical' || value === 'important' || value === 'routine') return value;
  if (value) warnings.push(`Row ${row}: unknown criticality “${value}”; changed to critical.`);
  return 'critical';
}

function yamlValue(value: unknown): string {
  return JSON.stringify(String(value ?? ''));
}

export function toYaml(records: LedgerRecord[]): string {
  const body = records.map((record) => COLUMNS.map((key, index) => `${index ? '  ' : '- '}${key}: ${yamlValue(record[key])}`).join('\n')).join('\n');
  return `# Backup Coverage Ledger v1\n# Portable metadata only. Do not put credentials in this file.\nrecords:\n${body ? body.split('\n').map((line) => `  ${line}`).join('\n') : '  []'}\n`;
}

export function parseYaml(text: string): ImportResult {
  if (!/^\s*records\s*:/m.test(text)) throw new Error('YAML must contain a top-level “records:” list.');
  const records: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;
  for (const sourceLine of text.split(/\r?\n/)) {
    const line = sourceLine.trim();
    if (!line || line.startsWith('#') || line === 'records:' || line === '[]') continue;
    const match = line.match(/^(-\s*)?([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!match) throw new Error(`Unsupported YAML line: “${line.slice(0, 60)}”. Export this ledger’s YAML format or use CSV.`);
    if (match[1]) { current = {}; records.push(current); }
    if (!current) throw new Error('Each YAML record must start with “- asset:”.');
    const key = match[2]!;
    let value = match[3]!.trim();
    if (value.startsWith('"')) {
      try { value = JSON.parse(value) as string; } catch { throw new Error(`Invalid quoted YAML value for “${key}”.`); }
    }
    current[key] = value;
  }
  const warnings: string[] = [];
  const normalized = records.map((raw, index) => {
    if (!raw.asset) throw new Error(`YAML record ${index + 1} needs an asset name.`);
    return createRecord({
      asset: raw.asset, owner: raw.owner, criticality: normalizeCriticality(raw.criticality, index + 1, warnings),
      backupTarget: raw.backupTarget, recoveryLocation: raw.recoveryLocation,
      retention: raw.retention, extractionMethod: raw.extractionMethod,
      lastProofDate: raw.lastProofDate, proofNotes: raw.proofNotes,
      proofCadenceDays: Number(raw.proofCadenceDays || 30)
    });
  });
  return { records: normalized, warnings };
}

export function parsePortableFile(name: string, text: string): ImportResult {
  const lower = name.toLowerCase();
  if (lower.endsWith('.csv')) return parseCsv(text);
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return parseYaml(text);
  throw new Error('Choose a .csv, .yaml, or .yml file.');
}
