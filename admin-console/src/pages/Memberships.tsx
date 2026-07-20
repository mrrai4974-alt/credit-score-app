import React, { useState } from 'react';

import { Badge, Button, Card, StatTile, inr } from '../components/ui';
import { plans as seed } from '../data/mockData';
import { Plan } from '../types';

export const Memberships: React.FC = () => {
  const [rows, setRows] = useState<Plan[]>(seed);

  const toggle = (id: string) =>
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const totalSubs = rows.reduce((s, p) => s + p.subscribers, 0);
  const mrr = rows.reduce((s, p) => s + (p.subscribers * p.price) / 12, 0);
  const attach = 10.4;

  return (
    <div className="page">
      <p className="page-intro">
        Configure membership tiers, pricing, entitlements and renewal rules
        (FR-32). Recurring plans lift repeat bookings and lifetime value.
      </p>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <StatTile label="Total subscribers" value={totalSubs.toLocaleString('en-IN')} foot="active memberships" />
        <StatTile label="Estimated MRR" value={inr(Math.round(mrr))} foot="from annual plans" />
        <StatTile label="Attach rate" value={`${attach}%`} delta={1.2} up foot="target ≥ 10%" />
      </div>

      <div className="grid three">
        {rows.map((p) => (
          <Card
            key={p.id}
            title={p.name}
            action={<Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? 'Active' : 'Paused'}</Badge>}
          >
            <div className="stat-value" style={{ fontSize: 24 }}>
              {inr(p.price)}
              <span className="t-muted" style={{ fontSize: 13, fontWeight: 600 }}> / year</span>
            </div>
            <div style={{ margin: '12px 0', fontSize: 13, lineHeight: 1.9 }}>
              <div>✓ {p.discountPct}% off all services</div>
              <div>✓ {p.freeServices || 'No'} free service{p.freeServices === 1 ? '' : 's'} / year</div>
              <div>✓ {p.warrantyDays}-day warranty</div>
              <div>✓ Covers {p.vehicles} vehicle{p.vehicles > 1 ? 's' : ''}</div>
            </div>
            <div className="flex between" style={{ marginBottom: 12 }}>
              <span className="t-muted">Subscribers</span>
              <span className="t-strong">{p.subscribers.toLocaleString('en-IN')}</span>
            </div>
            <Button variant={p.active ? 'outline' : 'primary'} sm onClick={() => toggle(p.id)}>
              {p.active ? 'Pause plan' : 'Activate plan'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
