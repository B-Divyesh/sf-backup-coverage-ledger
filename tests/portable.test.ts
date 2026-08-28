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

  it('rejects malformed and impossible non-empty proof dates with the CSV row and field', () => {
    const header = 'asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays';
    const base = 'Database,Platform,critical,Object store,Runbook,30 days,Restore sample';
    expect(() => parseCsv(`${header}\n${base},not-a-date,Checked,30`)).toThrow('Row 2 has an invalid lastProofDate');
    expect(() => parseCsv(`${header}\n${base},2026-02-30,Checked,30`)).toThrow('Row 2 has an invalid lastProofDate');
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

  it('rejects malformed and impossible non-empty proof dates with the YAML record and field', () => {
    const yaml = `records:
  - asset: Database
    owner: Platform
    backupTarget: Object store
    recoveryLocation: Runbook
    extractionMethod: Restore sample
    lastProofDate: 2026-02-30`;
    expect(() => parseYaml(yaml)).toThrow('YAML record 1 has an invalid lastProofDate');
    expect(() => parseYaml(yaml.replace('2026-02-30', 'not-a-date'))).toThrow('YAML record 1 has an invalid lastProofDate');
  });
});
