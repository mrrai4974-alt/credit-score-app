import React, { useState } from 'react';

import { useAuth } from '../auth';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@doorstepbike.example');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--navy)' }}>
      <form onSubmit={submit} className="card" style={{ width: 360, padding: 28 }}>
        <div className="flex gap-8" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>🔧</span>
          <strong style={{ fontSize: 18 }}>Doorstep Ops</strong>
        </div>
        <p className="t-muted" style={{ marginTop: 0, fontSize: 13 }}>Admin console sign in</p>

        <div className="field" style={{ marginTop: 12 }}>
          <label>Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && (
          <p className="badge danger" style={{ display: 'inline-block', marginBottom: 10 }}>
            {error}
          </p>
        )}

        <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="t-muted" style={{ fontSize: 11.5, marginTop: 12, marginBottom: 0 }}>
          Demo credentials are prefilled. Requires the backend running on
          <code> :4000</code>.
        </p>
      </form>
    </div>
  );
};
