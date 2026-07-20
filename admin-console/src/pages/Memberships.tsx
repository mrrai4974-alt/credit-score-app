import React from 'react';

import { api } from '../api';
import { Badge, Button, Card, StatTile, inr } from '../components/ui';
import { useLoad } from '../hooks';

interface Plan {
  id: string;
  name: string;
  price: number;
  discountPct: number;
  freeServices: number;
  warrantyDays: number;
  vehicles: number;
  perks: string[];
  subscribers: number;
  active: boolean;
}

export const Memberships: React.FC = () => {
  const { data, loading, reload } = useLoad<Plan[]>('/plans');

  const toggle = async (p: Plan) => {
    await api.patch(`/plans/${p.id}`, { active: !p.active });
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading plans…</p></div>;

  const totalSubs = data.reduce((s, p) => s + p.subscribers, 0);
  const mrr = data.reduce((s, p) => s + (p.subscribers * p.price) / 12, 0);

  return (
    <div className="page">
      <p className="page-intro">Configure membership tiers, pricing, entitlements and renewal rules (FR-32).</p>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <StatTile label="Total subscribers" value={totalSubs.toLocaleString('en-IN')} foot="active memberships" />
        <StatTile label="Estimated MRR" value={inr(Math.round(mrr))} foot="from annual plans" />
        <StatTile label="Attach rate" value="10.4%" delta={1.2} up foot="target ≥ 10%" />
      </div>

      <div className="grid three">
        {data.map((p) => (
          <Card key={p.id} title={p.name} action={<Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? 'Active' : 'Paused'}</Badge>}>
            <div className="stat-value" style={{ fontSize: 24 }}>{inr(p.price)}<span className="t-muted" style={{ fontSize: 13, fontWeight: 600 }}> / year</span></div>
            <div style={{ margin: '12px 0', fontSize: 13, lineHeight: 1.9 }}>
              {p.perks.map((perk) => <div key={perk}>✓ {perk}</div>)}
            </div>
            <div className="flex between" style={{ marginBottom: 12 }}>
              <span className="t-muted">Subscribers</span>
              <span className="t-strong">{p.subscribers.toLocaleString('en-IN')}</span>
            </div>
            <Button variant={p.active ? 'outline' : 'primary'} sm onClick={() => toggle(p)}>{p.active ? 'Pause plan' : 'Activate plan'}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
