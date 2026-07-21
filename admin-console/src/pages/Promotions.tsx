import React, { useState } from 'react';

import { api } from '../api';
import { Button, Card } from '../components/ui';
import { useLoad } from '../hooks';

interface Coupon {
  id: string;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  cap?: number;
  uses: number;
  limit: number;
  expiry: string;
  active: boolean;
}

export const Promotions: React.FC = () => {
  const { data, loading, reload } = useLoad<Coupon[]>('/coupons');
  const [form, setForm] = useState({ code: '', type: 'flat' as Coupon['type'], value: '', cap: '', limit: '', expiry: '' });

  const toggle = async (c: Coupon) => {
    await api.patch(`/coupons/${c.id}`, { active: !c.active });
    reload();
  };

  const add = async () => {
    if (!form.code.trim() || !form.value) return;
    await api.post('/coupons', {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      cap: form.cap ? Number(form.cap) : undefined,
      limit: Number(form.limit) || 1000,
      expiry: form.expiry || '31 Dec 2026',
    });
    setForm({ code: '', type: 'flat', value: '', cap: '', limit: '', expiry: '' });
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading coupons…</p></div>;
  const discountLabel = (c: Coupon) => (c.type === 'flat' ? `₹${c.value} off` : `${c.value}% off${c.cap ? ` (max ₹${c.cap})` : ''}`);

  return (
    <div className="page">
      <p className="page-intro">Create and manage promotional codes with usage caps and expiry (FR-33). Codes validate live at customer checkout.</p>

      <div className="grid two" style={{ alignItems: 'start' }}>
        <Card title="Active & past coupons">
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Code</th><th>Discount</th><th className="t-num">Used</th><th>Expiry</th><th>Status</th></tr></thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id}>
                    <td className="t-strong">{c.code}</td>
                    <td>{discountLabel(c)}</td>
                    <td className="t-num">{c.uses.toLocaleString('en-IN')}<span className="t-muted"> / {c.limit.toLocaleString('en-IN')}</span></td>
                    <td className="t-muted">{c.expiry}</td>
                    <td><button className={`chip ${c.active ? 'active' : ''}`} style={{ padding: '3px 10px' }} onClick={() => toggle(c)}>{c.active ? 'Active' : 'Disabled'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Create coupon">
          <div className="row-2">
            <div className="field"><label>Code</label><input className="input" value={form.code} placeholder="MONSOON20" onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
            <div className="field"><label>Type</label><select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon['type'] })}><option value="flat">Flat ₹</option><option value="percent">Percent %</option></select></div>
          </div>
          <div className="row-2">
            <div className="field"><label>{form.type === 'flat' ? 'Amount (₹)' : 'Percent (%)'}</label><input className="input" inputMode="numeric" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value.replace(/\D/g, '') })} /></div>
            <div className="field"><label>Max cap (₹, optional)</label><input className="input" inputMode="numeric" value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value.replace(/\D/g, '') })} disabled={form.type === 'flat'} /></div>
          </div>
          <div className="row-2">
            <div className="field"><label>Usage limit</label><input className="input" inputMode="numeric" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value.replace(/\D/g, '') })} /></div>
            <div className="field"><label>Expiry</label><input className="input" placeholder="31 Dec 2026" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></div>
          </div>
          <Button onClick={add} disabled={!form.code.trim() || !form.value}>+ Create coupon</Button>
        </Card>
      </div>
    </div>
  );
};
