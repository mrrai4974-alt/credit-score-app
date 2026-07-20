import React, { createContext, useContext, useEffect, useState } from 'react';

import { api, tokenStore } from './api';

interface AuthState {
  authed: boolean;
  name: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: { name: string } }>('/auth/me')
      .then((r) => {
        setName(r.user.name);
        setAuthed(true);
      })
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.adminLogin(email, password);
    tokenStore.set(r.token);
    setName(r.user.name);
    setAuthed(true);
  };

  const logout = () => {
    tokenStore.clear();
    setAuthed(false);
  };

  return <Ctx.Provider value={{ authed, name, loading, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
