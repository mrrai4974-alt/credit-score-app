import React, { useState } from 'react';

import { Button, Card } from '../components/ui';
import { coupons as seed } from '../data/mockData';
import { Coupon } from '../types';

export const Promotions: React.FC = () => {
  const [rows, setRows] = useState<Coupon[]>(seed);
  const [form, setForm] = useState({ code: '', type: 'flat' as Coupon['type'], value: '', cap: '', limit: '', expiry: '' });

  const toggle = (id: string) =>
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const add = () => {
    if (!form.code.trim() || !form.value) return;
    const coupon: Coupon = {
      id: `c${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: parseInt(form.value, 10),
      cap: form.cap ? parseInt(form.cap, 10) : undefined,
      uses: 0,
      limit: parseInt(form.limit, 10) || 1000,
      expiry: form.expiry || '31 Dec 2026',
      active: true,
    };
    setRows((prev) => [coupon, ...prev]);
    setForm({ code: '', type: 'flat', value: '', cap: '', limit: '', expiry: '' });
  };

  const discountLabel = (c: Coupon) =>
    c.type === 'flat' ? `₹${c.value} off` : `${c.value}% off${c.cap ? ` (max ₹${c.cap})` : ''}`;

  return (
    <div className="page">
      <p className="page-intro">
        Create and manage promotional codes with usage caps and expiry windows
        (FR-33). Codes apply at customer checkout.
      </p>

      <div className="grid two" style={{ alignItems: 'start' }}>
        <Card title="Active & past coupons">
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th className="t-num">Used</th>
                  <th>Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="t-strong">{c.code}</td>
                    <td>{discountLabel(c)}</td>
                    <td className="t-num">
                      {c.uses.toLocaleString('en-IN')}
                      <span className="t-muted"> / {c.limit.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="t-muted">{c.expiry}</td>
                    <td>
                      <button
                        className={`chip ${c.active ? 'active' : ''}`}
                        style={{ padding: '3px 10px' }}
                        onClick={() => toggle(c.id)}
                      >
                        {c.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Create coupon">
          <div className="row-2">
            <div className="field">
              <label>Code</label>
              <input
                className="input"
                value={form.code}
                placeholder="MONSOON20"
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon['type'] })}>
                <option value="flat">Flat ₹</option>
                <option value="percent">Percent %</option>
              </select>
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label>{form.type === 'flat' ? 'Amount (₹)' : 'Percent (%)'}</label>
              <input className="input" inputMode="numeric" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value.replace(/\D/g, '') })} />
            </div>
            <div className="field">
              <label>Max cap (₹, optional)</label>
              <input className="input" inputMode="numeric" value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value.replace(/\D/g, '') })} disabled={form.type === 'flat'} />
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label>Usage limit</label>
              <input className="input" inputMode="numeric" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value.replace(/\D/g, '') })} />
            </div>
            <div className="field">
              <label>Expiry</label>
              <input className="input" placeholder="31 Dec 2026" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            </div>
          </div>
          <Button onClick={add} disabled={!form.code.trim() || !form.value}>
            + Create coupon
          </Button>
        </Card>
      </div>
    </div>
  );
};
