import { describe, expect, it } from 'vitest';
import { createRecord, getStatus, proofExpiry, successCoverage } from '../src/ledger';

const complete = () => createRecord({
  asset: 'Customer database',
  owner: 'Platform',
  backupTarget: 'Object store',
  recoveryLocation: 'Runbook §4',
  extractionMethod: 'Restore to isolated PostgreSQL',
  proofCadenceDays: 30
});

describe('coverage status', () => {
  it('puts missing paths ahead of proof state', () => {
    expect(getStatus(createRecord({ asset: 'Database' }), new Date('2026-08-27'))).toBe('gap');
  });

  it('marks complete records without a proof as unproven', () => {
    expect(getStatus(complete(), new Date('2026-08-27'))).toBe('unproven');
  });

  it('calculates current, due, and expired proof from each cadence', () => {
    expect(getStatus({ ...complete(), lastProofDate: '2026-08-10' }, new Date('2026-08-27'))).toBe('current');
    expect(getStatus({ ...complete(), lastProofDate: '2026-08-02' }, new Date('2026-08-27'))).toBe('due');
    expect(getStatus({ ...complete(), lastProofDate: '2026-07-01' }, new Date('2026-08-27'))).toBe('expired');
  });

  it('rejects future dates as expired evidence', () => {
    expect(getStatus({ ...complete(), lastProofDate: '2026-08-28' }, new Date('2026-08-27'))).toBe('expired');
  });

  it('calculates the proof expiry date', () => {
    expect(proofExpiry({ ...complete(), lastProofDate: '2026-08-10' })).toBe('2026-09-09');
  });
});

describe('30-day pilot measure', () => {
  it('requires owner, location, and recent proof for critical assets only', () => {
    const records = [
      { ...complete(), lastProofDate: '2026-08-10' },
      { ...complete(), recoveryLocation: '', lastProofDate: '2026-08-10' },
      { ...complete(), lastProofDate: '2026-06-01' },
      { ...complete(), criticality: 'routine' as const }
    ];
    expect(successCoverage(records, new Date('2026-08-27'))).toBe(33);
    expect(successCoverage([], new Date('2026-08-27'))).toBe(0);
  });

  it('does not let routine or important assets lower the critical-only target', () => {
    const records = [
      { ...complete(), criticality: 'critical' as const, lastProofDate: '2026-08-26' },
      { ...complete(), criticality: 'routine' as const },
      { ...complete(), criticality: 'important' as const }
    ];
    expect(successCoverage(records, new Date('2026-08-27'))).toBe(100);
  });

  it('returns zero when no critical assets are listed so the UI can show its explicit empty state', () => {
    expect(successCoverage([{ ...complete(), criticality: 'routine' }], new Date('2026-08-27'))).toBe(0);
  });
});
