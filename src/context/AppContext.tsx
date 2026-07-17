import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  currentMechanic as seedMechanic,
  initialJobs,
} from '../data/mockData';
import {
  AdditionalIssue,
  Job,
  JobStatus,
  Mechanic,
} from '../types';

interface AppState {
  authenticated: boolean;
  mechanic: Mechanic;
  jobs: Job[];

  login: () => void;
  logout: () => void;
  register: (name: string, phone: string, city: string) => void;
  setOnline: (online: boolean) => void;

  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string) => void;
  advanceStatus: (jobId: string, status: JobStatus) => void;
  toggleChecklistItem: (jobId: string, itemId: string) => void;
  addIssue: (jobId: string, title: string, price: number) => void;
  removeIssue: (jobId: string, issueId: string) => void;
  requestApproval: (jobId: string) => void;
  simulateCustomerDecision: (jobId: string, approve: boolean) => void;
  setPhoto: (jobId: string, kind: 'before' | 'after') => void;
  confirmCompletion: (jobId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

let issueCounter = 0;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [mechanic, setMechanic] = useState<Mechanic>(seedMechanic);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const patchJob = useCallback(
    (jobId: string, updater: (job: Job) => Job) => {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updater(j) : j)));
    },
    [],
  );

  const login = useCallback(() => setAuthenticated(true), []);
  const logout = useCallback(() => setAuthenticated(false), []);

  const register = useCallback((name: string, phone: string, city: string) => {
    setMechanic((prev) => ({
      ...prev,
      name: name || prev.name,
      phone: phone || prev.phone,
      city: city || prev.city,
      verification: 'in_review',
      jobsCompleted: 0,
      rating: 0,
      avatarInitials: name
        ? name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : prev.avatarInitials,
    }));
    setAuthenticated(true);
  }, []);

  const setOnline = useCallback((online: boolean) => {
    setMechanic((prev) => ({ ...prev, online }));
  }, []);

  const acceptJob = useCallback(
    (jobId: string) => patchJob(jobId, (j) => ({ ...j, status: 'accepted' })),
    [patchJob],
  );

  const declineJob = useCallback(
    (jobId: string) => patchJob(jobId, (j) => ({ ...j, status: 'declined' })),
    [patchJob],
  );

  const advanceStatus = useCallback(
    (jobId: string, status: JobStatus) =>
      patchJob(jobId, (j) => ({ ...j, status })),
    [patchJob],
  );

  const toggleChecklistItem = useCallback(
    (jobId: string, itemId: string) =>
      patchJob(jobId, (j) => ({
        ...j,
        checklist: j.checklist.map((c) =>
          c.id === itemId ? { ...c, done: !c.done } : c,
        ),
      })),
    [patchJob],
  );

  const addIssue = useCallback(
    (jobId: string, title: string, price: number) =>
      patchJob(jobId, (j) => {
        const issue: AdditionalIssue = {
          id: `ai-${++issueCounter}`,
          title,
          price,
          approved: 'pending',
        };
        return { ...j, additionalIssues: [...j.additionalIssues, issue] };
      }),
    [patchJob],
  );

  const removeIssue = useCallback(
    (jobId: string, issueId: string) =>
      patchJob(jobId, (j) => ({
        ...j,
        additionalIssues: j.additionalIssues.filter((i) => i.id !== issueId),
      })),
    [patchJob],
  );

  const requestApproval = useCallback(
    (jobId: string) =>
      patchJob(jobId, (j) => ({ ...j, status: 'awaiting_approval' })),
    [patchJob],
  );

  // Stand-in for the customer app responding to the approval request (FR-09/FR-21).
  const simulateCustomerDecision = useCallback(
    (jobId: string, approve: boolean) =>
      patchJob(jobId, (j) => ({
        ...j,
        status: 'in_progress',
        additionalIssues: j.additionalIssues.map((i) =>
          i.approved === 'pending'
            ? { ...i, approved: approve ? 'approved' : 'rejected' }
            : i,
        ),
      })),
    [patchJob],
  );

  const setPhoto = useCallback(
    (jobId: string, kind: 'before' | 'after') =>
      patchJob(jobId, (j) => ({
        ...j,
        beforePhotoTaken: kind === 'before' ? true : j.beforePhotoTaken,
        afterPhotoTaken: kind === 'after' ? true : j.afterPhotoTaken,
      })),
    [patchJob],
  );

  const confirmCompletion = useCallback(
    (jobId: string) => {
      patchJob(jobId, (j) => ({
        ...j,
        status: 'completed',
        customerConfirmed: true,
      }));
      setMechanic((prev) => ({
        ...prev,
        jobsCompleted: prev.jobsCompleted + 1,
      }));
    },
    [patchJob],
  );

  const value = useMemo<AppState>(
    () => ({
      authenticated,
      mechanic,
      jobs,
      login,
      logout,
      register,
      setOnline,
      acceptJob,
      declineJob,
      advanceStatus,
      toggleChecklistItem,
      addIssue,
      removeIssue,
      requestApproval,
      simulateCustomerDecision,
      setPhoto,
      confirmCompletion,
    }),
    [
      authenticated,
      mechanic,
      jobs,
      login,
      logout,
      register,
      setOnline,
      acceptJob,
      declineJob,
      advanceStatus,
      toggleChecklistItem,
      addIssue,
      removeIssue,
      requestApproval,
      simulateCustomerDecision,
      setPhoto,
      confirmCompletion,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
