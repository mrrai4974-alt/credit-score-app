import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getBureauClient } from '../services/bureau';
import type { CreditReport } from '../services/bureau/types';
import { useAuth } from './AuthContext';

/**
 * Owns the user's credit report: fetches it on sign-in and exposes a
 * `refresh` for pull-to-refresh. Screens read from here rather than calling
 * the bureau directly, so caching/refresh policy lives in one place.
 */
interface CreditState {
  report: CreditReport | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CreditContext = createContext<CreditState | undefined>(undefined);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [report, setReport] = useState<CreditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!user) return;
      mode === 'initial' ? setLoading(true) : setRefreshing(true);
      setError(null);
      try {
        const client = getBureauClient();
        const next = await client.fetchReport({
          fullName: user.fullName,
          mobile: user.mobile,
          pan: user.pan,
          dateOfBirth: user.dateOfBirth,
        });
        setReport(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not fetch your report.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  // Fetch whenever a user signs in; clear when they sign out.
  useEffect(() => {
    if (user) {
      void load('initial');
    } else {
      setReport(null);
      setError(null);
    }
  }, [user, load]);

  const refresh = useCallback(() => load('refresh'), [load]);

  const value = useMemo<CreditState>(
    () => ({ report, loading, refreshing, error, refresh }),
    [report, loading, refreshing, error, refresh],
  );

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

export function useCredit(): CreditState {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error('useCredit must be used within a CreditProvider');
  return ctx;
}
