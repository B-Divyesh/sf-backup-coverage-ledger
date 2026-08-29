import { describe, expect, it } from 'vitest';
import { createRecord } from '../src/ledger';
import { compareImport, mergeImport } from '../src/merge';

describe('portable ledger reconciliation', () => {
  it('classifies additions, updates, unchanged records, and conflicts', () => {
    const old = '2026-01-01T00:00:00.000Z';
    const recent = '2026-08-01T00:00:00.000Z';
    const current = [createRecord({ id: 'same', asset: 'Same', updatedAt: old }), createRecord({ id: 'update', asset: 'Old name', updatedAt: old }), createRecord({ id: 'conflict', asset: 'Current name', updatedAt: recent })];
    const imported = [createRecord({ ...current[0] }), createRecord({ id: 'update', asset: 'New name', updatedAt: recent }), createRecord({ id: 'conflict', asset: 'Imported name', updatedAt: old }), createRecord({ id: 'added', asset: 'Added', updatedAt: recent })];
    const result = compareImport(current, imported);
    expect(result).toMatchObject({ added: [{ id: 'added' }], updated: [{ id: 'update' }], unchanged: [{ id: 'same' }] });
    expect(result.conflicts[0]?.current.id).toBe('conflict');
  });

  it('applies newer versions and explicit conflict choices without duplicates', () => {
    const current = [createRecord({ id: 'update', asset: 'Old', updatedAt: '2026-01-01T00:00:00.000Z' }), createRecord({ id: 'conflict', asset: 'Current', updatedAt: '2026-08-01T00:00:00.000Z' })];
    const imported = [createRecord({ id: 'update', asset: 'New', updatedAt: '2026-08-01T00:00:00.000Z' }), createRecord({ id: 'conflict', asset: 'Imported', updatedAt: '2026-01-01T00:00:00.000Z' })];
    const comparison = compareImport(current, imported);
    const merged = mergeImport(current, comparison, { conflict: 'imported' });
    expect(merged.map((record) => record.asset)).toEqual(['New', 'Imported']);
    expect(compareImport(merged, imported).unchanged).toHaveLength(2);
  });
});
