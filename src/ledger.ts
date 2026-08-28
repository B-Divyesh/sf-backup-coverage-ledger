import type { CoverageStatus, LedgerRecord } from './types';

export const REQUIRED_FIELDS: Array<keyof LedgerRecord> = [
  'asset',
  'owner',
  'backupTarget',
  'recoveryLocation',
  'extractionMethod'
];

export function createRecord(input: Partial<LedgerRecord> = {}): LedgerRecord {
  const now = new Date().toISOString();
  return {
    id: input.id || crypto.randomUUID(),
    asset: input.asset?.trim() || '',
    owner: input.owner?.trim() || '',
    criticality: validCriticality(input.criticality),
    backupTarget: input.backupTarget?.trim() || '',
    recoveryLocation: input.recoveryLocation?.trim() || '',
    retention: input.retention?.trim() || '',
    extractionMethod: input.extractionMethod?.trim() || '',
    lastProofDate: input.lastProofDate || '',
    proofNotes: input.proofNotes?.trim() || '',
    proofCadenceDays: validCadence(input.proofCadenceDays),
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now
  };
}

function validCriticality(value: unknown): LedgerRecord['criticality'] {
  return value === 'important' || value === 'routine' ? value : 'critical';
}

function validCadence(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 3650 ? parsed : 30;
}

export function missingFields(record: LedgerRecord): Array<keyof LedgerRecord> {
  return REQUIRED_FIELDS.filter((field) => !String(record[field]).trim());
}

export function daysSince(date: string, today = new Date()): number {
  if (!date) return Number.POSITIVE_INFINITY;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((current.getTime() - parsed.getTime()) / 86_400_000);
}

/**
 * Accept only the portable format the ledger exports: a real YYYY-MM-DD
 * calendar date. `new Date()` alone is deliberately not enough here because
 * it silently normalizes impossible dates such as 2026-02-30.
 */
export function isIsoCalendarDate(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export function getStatus(record: LedgerRecord, today = new Date()): CoverageStatus {
  if (missingFields(record).length > 0) return 'gap';
  if (!record.lastProofDate) return 'unproven';
  const age = daysSince(record.lastProofDate, today);
  if (age < 0 || age > record.proofCadenceDays) return 'expired';
  if (age >= Math.max(0, record.proofCadenceDays - 7)) return 'due';
  return 'current';
}

export const STATUS_LABELS: Record<CoverageStatus, string> = {
  gap: 'Coverage gap',
  unproven: 'Never proven',
  expired: 'Proof expired',
  due: 'Proof due soon',
  current: 'Proof current'
};

export function proofExpiry(record: LedgerRecord): string {
  if (!record.lastProofDate) return '';
  const date = new Date(`${record.lastProofDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + record.proofCadenceDays);
  return date.toISOString().slice(0, 10);
}

export function successCoverage(records: LedgerRecord[], today = new Date()): number {
  const criticalRecords = records.filter((record) => record.criticality === 'critical');
  if (!criticalRecords.length) return 0;
  const covered = criticalRecords.filter((record) =>
    Boolean(record.owner && record.recoveryLocation && record.lastProofDate && daysSince(record.lastProofDate, today) <= 30 && daysSince(record.lastProofDate, today) >= 0)
  ).length;
  return Math.round((covered / criticalRecords.length) * 100);
}
