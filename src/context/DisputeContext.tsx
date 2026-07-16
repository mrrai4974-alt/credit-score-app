import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Dispute, DisputeStatus } from '../services/bureau/types';

/**
 * Tracks disputes filed in-session (FR-10). In production these would be
 * persisted and their status advanced by the bureau/back-office; here we seed
 * one example and let the user file more.
 */
interface DisputeState {
  disputes: Dispute[];
  fileDispute: (subjectLabel: string, reason: string) => void;
}

const seed: Dispute[] = [
  {
    id: 'dsp-seed',
    subjectLabel: 'HDFC Bank Credit Card',
    reason: 'Incorrect “payment missed” marker on my statement.',
    status: 'Under Review',
    filedOn: isoDaysAgo(9),
    updatedOn: isoDaysAgo(2),
  },
];

const DisputeContext = createContext<DisputeState | undefined>(undefined);

export function DisputeProvider({ children }: { children: React.ReactNode }) {
  const [disputes, setDisputes] = useState<Dispute[]>(seed);

  const fileDispute = useCallback((subjectLabel: string, reason: string) => {
    const now = new Date().toISOString();
    const dispute: Dispute = {
      id: `dsp-${Date.now()}`,
      subjectLabel,
      reason,
      status: 'Submitted' as DisputeStatus,
      filedOn: now,
      updatedOn: now,
    };
    setDisputes((prev) => [dispute, ...prev]);
  }, []);

  const value = useMemo<DisputeState>(() => ({ disputes, fileDispute }), [disputes, fileDispute]);
  return <DisputeContext.Provider value={value}>{children}</DisputeContext.Provider>;
}

export function useDisputes(): DisputeState {
  const ctx = useContext(DisputeContext);
  if (!ctx) throw new Error('useDisputes must be used within a DisputeProvider');
  return ctx;
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
