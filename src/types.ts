export type Criticality = 'critical' | 'important' | 'routine';

export interface LedgerRecord {
  id: string;
  asset: string;
  owner: string;
  criticality: Criticality;
  backupTarget: string;
  recoveryLocation: string;
  retention: string;
  extractionMethod: string;
  lastProofDate: string;
  proofNotes: string;
  proofCadenceDays: number;
  createdAt: string;
  updatedAt: string;
}

export type CoverageStatus = 'gap' | 'unproven' | 'expired' | 'due' | 'current';

export interface LedgerState {
  version: 1;
  records: LedgerRecord[];
}

export interface ImportResult {
  records: LedgerRecord[];
  warnings: string[];
}
