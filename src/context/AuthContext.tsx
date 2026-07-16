import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BureauSubject } from '../services/bureau/types';

/**
 * Auth is modelled on GoodScore's flow: enter mobile -> receive OTP ->
 * verify -> you're in. There is no real SMS gateway here; `requestOtp`
 * simulates one and returns the code so the demo is self-contained. Swap
 * `requestOtp`/`verifyOtp` for calls to your backend to go live.
 */

export interface User extends BureauSubject {
  id: string;
}

interface AuthState {
  user: User | null;
  initialising: boolean;
  /** Sends an OTP to the mobile. Returns the demo code (remove in prod). */
  requestOtp: (mobile: string) => Promise<string>;
  /** Verifies the OTP and signs the user in. */
  verifyOtp: (
    mobile: string,
    code: string,
    profile: { fullName: string; pan?: string },
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = '@goodcredit/user';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialising, setInitialising] = useState(true);
  // Holds the last OTP we "sent", keyed by mobile, for verification.
  const [pendingOtp, setPendingOtp] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw) as User);
      } catch {
        // Corrupt/absent session — start signed out.
      } finally {
        setInitialising(false);
      }
    })();
  }, []);

  const requestOtp = useCallback(async (mobile: string) => {
    await new Promise((r) => setTimeout(r, 500));
    // A real implementation would POST to /auth/otp and send an SMS.
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPendingOtp((prev) => ({ ...prev, [mobile]: code }));
    return code;
  }, []);

  const verifyOtp = useCallback(
    async (
      mobile: string,
      code: string,
      profile: { fullName: string; pan?: string },
    ) => {
      await new Promise((r) => setTimeout(r, 500));
      const expected = pendingOtp[mobile];
      if (!expected || expected !== code) {
        throw new Error('Incorrect OTP. Please try again.');
      }
      const signedIn: User = {
        id: `usr_${mobile}`,
        mobile,
        fullName: profile.fullName.trim() || 'GoodCredit User',
        pan: profile.pan?.trim().toUpperCase(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(signedIn));
      setUser(signedIn);
    },
    [pendingOtp],
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, initialising, requestOtp, verifyOtp, signOut }),
    [user, initialising, requestOtp, verifyOtp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
