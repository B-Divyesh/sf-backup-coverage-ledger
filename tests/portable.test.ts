import { describe, expect, it } from 'vitest';
import { createRecord } from '../src/ledger';
import { parseCsv, parsePortableFile, parseYaml, toCsv, toYaml } from '../src/portable';

const record = createRecord({
  asset: 'Orders, primary',
  owner: 'Data "A"',
  criticality: 'important',
  backupTarget: 'Restic / EU',
  recoveryLocation: 'Runbook §5',
  retention: '30 daily',
  extractionMethod: 'Restore, then\nopen a sample',
  lastProofDate: '2026-08-21',
  proofNotes: 'Opened five orders',
  proofCadenceDays: 45
});

describe('portable CSV', () => {
  it('round trips commas, quotes, and line breaks', () => {
    const result = parseCsv(toCsv([record]));
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toMatchObject({
      asset: record.asset,
      owner: record.owner,
      extractionMethod: record.extractionMethod,
      proofCadenceDays: 45
    });
  });

  it('reports required header and row errors', () => {
    expect(() => parseCsv('asset,owner\nthing,team')).toThrow('backupTarget');
    expect(() => parseCsv('asset,owner,backupTarget,recoveryLocation\n,team,target,runbook')).toThrow('Row 2');
  });
});

describe('portable YAML', () => {
  it('round trips the ledger subset', () => {
    const result = parseYaml(toYaml([record]));
    expect(result.records[0]).toMatchObject({
      asset: record.asset,
      owner: record.owner,
      criticality: 'important',
      proofCadenceDays: 45
    });
  });

  it('rejects unsupported or ambiguous documents', () => {
    expect(() => parseYaml('assets:\n  - name: thing')).toThrow('records');
    expect(() => parsePortableFile('ledger.txt', 'anything')).toThrow('.csv');
  });
});
