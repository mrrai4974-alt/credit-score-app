import React, { useState } from 'react';

import { Badge, Button, Card } from '../components/ui';
import { catalog as seed } from '../data/mockData';
import { CatalogService, ServiceCategory } from '../types';

const CATEGORIES: ServiceCategory[] = ['General', 'EV', 'Premium', 'Brand-specific', 'Special Services'];
const withGst = (n: number) => Math.round(n * 1.18);

export const Catalog: React.FC = () => {
  const [rows, setRows] = useState<CatalogService[]>(seed);
  const [filter, setFilter] = useState<ServiceCategory | 'All'>('All');
  const [form, setForm] = useState({
    name: '',
    category: 'General' as ServiceCategory,
    price: '',
    durationMin: '',
    inspectionPoints: '',
  });

  const toggle = (id: string) =>
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  const add = () => {
    if (!form.name.trim()) return;
    const svc: CatalogService = {
      id: `s${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price: form.price ? parseInt(form.price, 10) : null,
      durationMin: parseInt(form.durationMin, 10) || 60,
      inspectionPoints: parseInt(form.inspectionPoints, 10) || 0,
      active: true,
    };
    setRows((prev) => [svc, ...prev]);
    setForm({ name: '', category: 'General', price: '', durationMin: '', inspectionPoints: '' });
  };

  const shown = rows.filter((s) => filter === 'All' || s.category === filter);

  return (
    <div className="page">
      <p className="page-intro">
        Manage services, pricing, GST, duration, inspection points and category
        tags across the five-category structure (FR-25). Prices are base (excl.
        18% GST); the customer app shows GST-inclusive totals.
      </p>

      <div className="grid two" style={{ alignItems: 'start' }}>
        <Card title="Services" sub={`${shown.length} shown`}>
          <div className="chips" style={{ marginBottom: 12 }}>
            {(['All', ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                className={`chip ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th className="t-num">Base</th>
                  <th className="t-num">Incl. GST</th>
                  <th className="t-num">Dur.</th>
                  <th className="t-num">Points</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s.id}>
                    <td className="t-strong">{s.name}</td>
                    <td><Badge tone="brand">{s.category}</Badge></td>
                    <td className="t-num">{s.price === null ? 'Quote' : `₹${s.price}`}</td>
                    <td className="t-num">{s.price === null ? '—' : `₹${withGst(s.price)}`}</td>
                    <td className="t-num">{s.durationMin}m</td>
                    <td className="t-num">{s.inspectionPoints || '—'}</td>
                    <td>
                      <button
                        className={`chip ${s.active ? 'active' : ''}`}
                        onClick={() => toggle(s.id)}
                        style={{ padding: '3px 10px' }}
                      >
                        {s.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Add a service">
          <div className="field">
            <label>Service name</label>
            <input
              className="input"
              value={form.name}
              placeholder="e.g. General Service (up to 200cc)"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Category</label>
            <select
              className="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="row-2">
            <div className="field">
              <label>Base price (₹, blank = quote)</label>
              <input
                className="input"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <div className="field">
              <label>Duration (min)</label>
              <input
                className="input"
                inputMode="numeric"
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
          <div className="field">
            <label>Inspection points</label>
            <input
              className="input"
              inputMode="numeric"
              value={form.inspectionPoints}
              onChange={(e) => setForm({ ...form, inspectionPoints: e.target.value.replace(/\D/g, '') })}
            />
          </div>
          {form.price && (
            <p className="t-muted" style={{ marginTop: 0 }}>
              Customer pays ₹{withGst(parseInt(form.price, 10) || 0)} incl. GST.
            </p>
          )}
          <Button onClick={add} disabled={!form.name.trim()}>
            + Add service
          </Button>
        </Card>
      </div>
    </div>
  );
};
