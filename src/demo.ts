import { createRecord } from './ledger';
import type { LedgerRecord } from './types';

function daysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function demoRecords(): LedgerRecord[] {
  return [
    createRecord({
      id: 'demo-customer-db', asset: 'Customer database', owner: 'Platform team', criticality: 'critical',
      backupTarget: 'Encrypted object storage / daily snapshot', recoveryLocation: 'Operations runbook §4',
      retention: '30 daily, 12 monthly', extractionMethod: 'Restore the latest snapshot into isolated PostgreSQL, then open ten recent orders.',
      lastProofDate: daysAgo(12), proofNotes: 'Schema loaded and ten recent orders opened.', proofCadenceDays: 30
    }),
    createRecord({
      id: 'demo-shared-drive', asset: 'Finance shared drive', owner: 'Operations', criticality: 'important',
      backupTarget: 'Nightly encrypted archive', recoveryLocation: 'Finance continuity guide §2', retention: '90 daily',
      extractionMethod: 'Download one monthly folder and open three spreadsheets.', lastProofDate: daysAgo(25),
      proofNotes: 'July close folder opened without repair.', proofCadenceDays: 30
    }),
    createRecord({
      id: 'demo-support-export', asset: 'Support ticket export', owner: 'Customer support', criticality: 'routine',
      backupTarget: 'Weekly CSV archive', recoveryLocation: 'Support handbook §7', retention: '52 weekly',
      extractionMethod: 'Extract the newest archive and check ticket attachments.', proofCadenceDays: 90
    }),
    createRecord({
      id: 'demo-dns-zones', asset: 'DNS zone records', owner: '', criticality: 'critical',
      backupTarget: 'Repository export', recoveryLocation: '', retention: '12 monthly',
      extractionMethod: 'Import the export into a temporary test zone.', lastProofDate: daysAgo(8),
      proofNotes: 'Test import completed.', proofCadenceDays: 30
    }),
    createRecord({
      id: 'demo-payroll', asset: 'Payroll archive', owner: 'Finance', criticality: 'important',
      backupTarget: 'Encrypted yearly vault', recoveryLocation: 'Payroll runbook §5', retention: '7 yearly',
      extractionMethod: 'Restore one closed payroll period and compare totals.', lastProofDate: daysAgo(120),
      proofNotes: 'Last annual drill matched the signed totals.', proofCadenceDays: 90
    })
  ];
}
