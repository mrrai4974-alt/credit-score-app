import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { api, setToken } from '../api';
import { currentMechanic as seedMechanic } from '../data/mockData';
import { Job, JobStatus, Mechanic } from '../types';

/* -------------------------------------------------- API response shapes */

interface ApiMechanic {
  id: string;
  name: string;
  phone: string;
  city: string;
  verification: 'pending' | 'in_review' | 'verified' | 'suspended';
  skills: string[];
  rating: number;
  jobsCompleted: number;
  serviceRadiusKm: number;
  online: boolean;
}
interface ApiExtra {
  id: string;
  title: string;
  price: number;
  approved: 'pending' | 'approved' | 'rejected';
}
interface ApiBooking {
  id: string;
  code: string;
  status: 'booked' | 'assigned' | 'en_route' | 'in_service' | 'awaiting_approval' | 'completed' | 'cancelled';
  serviceName: string;
  category: Job['category'];
  basePrice: number;
  inspectionPoints: number;
  estimatedDurationMin: number;
  slot: string;
  customerName: string;
  vehicle: string;
  address: string;
  mechanicId: string | null;
  checklist: { id: string; label: string; done: boolean }[];
  extras: ApiExtra[];
  beforePhoto: boolean;
  afterPhoto: boolean;
}

function mapStatus(b: ApiBooking): JobStatus {
  switch (b.status) {
    case 'booked': return 'available';
    case 'assigned': return 'accepted';
    case 'en_route': return 'en_route';
    case 'in_service': return 'in_progress';
    case 'awaiting_approval': return 'awaiting_approval';
    case 'completed': return 'completed';
    case 'cancelled': return 'declined';
    default: return 'available';
  }
}

// Deterministic pseudo-distance for display (backend has no geo).
const distanceFor = (id: string) => {
  const n = [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
  return Math.round(((n % 70) / 10 + 0.6) * 10) / 10;
};

function toJob(b: ApiBooking): Job {
  return {
    id: b.id,
    code: b.code,
    status: mapStatus(b),
    serviceName: b.serviceName,
    category: b.category,
    basePrice: b.basePrice,
    inspectionPoints: b.inspectionPoints,
    estimatedDurationMin: b.estimatedDurationMin,
    scheduledSlot: b.slot,
    customerName: b.customerName,
    vehicle: b.vehicle,
    address: b.address,
    distanceKm: distanceFor(b.id),
    checklist: b.checklist,
    additionalIssues: b.extras.map((e) => ({ id: e.id, title: e.title, price: e.price, approved: e.approved })),
    beforePhotoTaken: b.beforePhoto,
    afterPhotoTaken: b.afterPhoto,
    customerConfirmed: b.status === 'completed',
  };
}

function toMechanic(m: ApiMechanic): Mechanic {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    city: m.city,
    rating: m.rating,
    jobsCompleted: m.jobsCompleted,
    verification: m.verification === 'suspended' ? 'rejected' : m.verification,
    skills: m.skills,
    serviceRadiusKm: m.serviceRadiusKm,
    online: m.online,
    avatarInitials: m.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
  };
}

interface AppState {
  authenticated: boolean;
  mechanic: Mechanic;
  jobs: Job[];

  requestOtp: (phone: string) => Promise<string>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<void>;
  register: (name: string, phone: string, city: string) => Promise<void>;
  logout: () => void;
  setOnline: (online: boolean) => void;

  refreshJobs: () => Promise<void>;
  acceptJob: (jobId: string) => Promise<void>;
  declineJob: (jobId: string) => void;
  advanceStatus: (jobId: string, status: JobStatus) => Promise<void>;
  toggleChecklistItem: (jobId: string, itemId: string) => Promise<void>;
  addIssue: (jobId: string, title: string, price: number) => Promise<void>;
  removeIssue: (jobId: string, issueId: string) => Promise<void>;
  requestApproval: (jobId: string) => Promise<void>;
  setPhoto: (jobId: string, kind: 'before' | 'after') => Promise<void>;
  confirmCompletion: (jobId: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [mechanic, setMechanic] = useState<Mechanic>(seedMechanic);
  const [jobs, setJobs] = useState<Job[]>([]);

  const refreshJobs = useCallback(async () => {
    const [mine, available] = await Promise.all([
      api.get<ApiBooking[]>('/bookings'),
      api.get<ApiBooking[]>('/bookings?scope=available').catch(() => [] as ApiBooking[]),
    ]);
    const seen = new Set<string>();
    const merged: Job[] = [];
    for (const b of [...mine, ...available]) {
      if (seen.has(b.id)) continue;
      seen.add(b.id);
      merged.push(toJob(b));
    }
    setJobs(merged);
  }, []);

  const loadProfileAndJobs = useCallback(async () => {
    const m = await api.get<ApiMechanic>('/mechanics/me');
    setMechanic(toMechanic(m));
    if (m.verification === 'verified') await refreshJobs();
  }, [refreshJobs]);

  const requestOtp = useCallback(async (phone: string) => {
    const r = await api.post<{ devOtp: string }>('/auth/otp/request', { phone });
    return r.devOtp;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string, name?: string) => {
      const r = await api.post<{ token: string }>('/auth/otp/verify', {
        phone, otp, role: 'mechanic', name,
      });
      setToken(r.token);
      setAuthenticated(true);
      await loadProfileAndJobs();
    },
    [loadProfileAndJobs],
  );

  // Registration reuses the mechanic OTP path (dev OTP), creating an in_review
  // profile that is gated until operations verifies it.
  const register = useCallback(
    async (name: string, phone: string, _city: string) => {
      await verifyOtp(phone, '123456', name);
    },
    [verifyOtp],
  );

  const logout = useCallback(() => {
    setToken(null);
    setAuthenticated(false);
    setJobs([]);
  }, []);

  const setOnline = useCallback((online: boolean) => {
    setMechanic((prev) => ({ ...prev, online }));
    api.patch('/mechanics/me', { online }).catch(() => {});
  }, []);

  const applyBooking = useCallback((b: ApiBooking) => {
    const job = toJob(b);
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [job, ...prev];
    });
  }, []);

  const acceptJob = useCallback(
    async (jobId: string) => {
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/accept`);
      applyBooking(b);
    },
    [applyBooking],
  );

  // No backend "decline"; drop the offer from the local queue.
  const declineJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const advanceStatus = useCallback(
    async (jobId: string, status: JobStatus) => {
      const apiStatus = status === 'in_progress' ? 'in_service' : status;
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/status`, { status: apiStatus });
      applyBooking(b);
    },
    [applyBooking],
  );

  const toggleChecklistItem = useCallback(
    async (jobId: string, itemId: string) => {
      const job = jobs.find((j) => j.id === jobId);
      const item = job?.checklist.find((c) => c.id === itemId);
      const b = await api.patch<ApiBooking>(`/bookings/${jobId}/checklist`, {
        itemId, done: item ? !item.done : true,
      });
      applyBooking(b);
    },
    [applyBooking, jobs],
  );

  const addIssue = useCallback(
    async (jobId: string, title: string, price: number) => {
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/extras`, { title, price });
      applyBooking(b);
    },
    [applyBooking],
  );

  const removeIssue = useCallback(
    async (jobId: string, issueId: string) => {
      const b = await api.del<ApiBooking>(`/bookings/${jobId}/extras/${issueId}`);
      applyBooking(b);
    },
    [applyBooking],
  );

  const requestApproval = useCallback(
    async (jobId: string) => {
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/request-approval`);
      applyBooking(b);
    },
    [applyBooking],
  );

  const setPhoto = useCallback(
    async (jobId: string, kind: 'before' | 'after') => {
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/photo`, { kind });
      applyBooking(b);
    },
    [applyBooking],
  );

  const confirmCompletion = useCallback(
    async (jobId: string) => {
      const b = await api.post<ApiBooking>(`/bookings/${jobId}/complete`);
      applyBooking(b);
      setMechanic((prev) => ({ ...prev, jobsCompleted: prev.jobsCompleted + 1 }));
    },
    [applyBooking],
  );

  const value = useMemo<AppState>(
    () => ({
      authenticated, mechanic, jobs,
      requestOtp, verifyOtp, register, logout, setOnline,
      refreshJobs, acceptJob, declineJob, advanceStatus, toggleChecklistItem,
      addIssue, removeIssue, requestApproval, setPhoto, confirmCompletion,
    }),
    [
      authenticated, mechanic, jobs,
      requestOtp, verifyOtp, register, logout, setOnline,
      refreshJobs, acceptJob, declineJob, advanceStatus, toggleChecklistItem,
      addIssue, removeIssue, requestApproval, setPhoto, confirmCompletion,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
