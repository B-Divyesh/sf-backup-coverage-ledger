import type { LedgerRecord } from './types';

export interface ImportComparison {
  added: LedgerRecord[];
  updated: LedgerRecord[];
  unchanged: LedgerRecord[];
  conflicts: Array<{ current: LedgerRecord; imported: LedgerRecord }>;
}

const comparedFields: Array<keyof LedgerRecord> = [
  'asset', 'owner', 'criticality', 'backupTarget', 'recoveryLocation', 'retention',
  'extractionMethod', 'lastProofDate', 'proofNotes', 'proofCadenceDays'
];

function sameRecord(left: LedgerRecord, right: LedgerRecord): boolean {
  return comparedFields.every((field) => left[field] === right[field]);
}

export function compareImport(current: LedgerRecord[], imported: LedgerRecord[]): ImportComparison {
  const byId = new Map(current.map((record) => [record.id, record]));
  const result: ImportComparison = { added: [], updated: [], unchanged: [], conflicts: [] };
  for (const record of imported) {
    const existing = byId.get(record.id);
    if (!existing) result.added.push(record);
    else if (sameRecord(existing, record)) result.unchanged.push(record);
    else if (Date.parse(record.updatedAt) > Date.parse(existing.updatedAt)) result.updated.push(record);
    else result.conflicts.push({ current: existing, imported: record });
  }
  return result;
}

export function mergeImport(
  current: LedgerRecord[], comparison: ImportComparison, conflictChoices: Record<string, 'current' | 'imported'>
): LedgerRecord[] {
  const replacements = new Map(comparison.updated.map((record) => [record.id, record]));
  for (const conflict of comparison.conflicts) {
    if (conflictChoices[conflict.current.id] === 'imported') replacements.set(conflict.current.id, conflict.imported);
  }
  return [...comparison.added, ...current.map((record) => replacements.get(record.id) || record)];
}
