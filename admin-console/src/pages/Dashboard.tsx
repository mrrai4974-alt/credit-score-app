import React from 'react';

import { BarList, Meter, TrendChart } from '../components/charts';
import { Badge, Card, StatTile, inr } from '../components/ui';
import {
  bookingsByCategory,
  bookingsByCity,
  kpis,
  mechanics,
  orders,
  revenueTrend,
  utilizationTrend,
} from '../data/mockData';

const dayLabel = (i: number) => `Day ${i + 1}`;

export const Dashboard: React.FC = () => {
  const avgUtil = Math.round(
    mechanics.filter((m) => m.status === 'verified').reduce((s, m) => s + m.utilization, 0) /
      mechanics.filter((m) => m.status === 'verified').length,
  );
  const breaches = orders.filter((o) => o.slaMinsLeft < 0).length;

  return (
    <div className="page">
      <p className="page-intro">
        Live view of bookings, revenue, city performance and mechanic utilization
        across the network (FR-34). Figures are illustrative.
      </p>

      <div className="grid kpi">
        {kpis.map((k) => (
          <StatTile key={k.label} {...k} />
        ))}
      </div>

      <div className="grid two section-gap">
        <Card
          title="Revenue trend"
          sub="Last 14 days · ₹ lakh (incl. GST)"
          action={<Badge tone="success">▲ 9.1%</Badge>}
        >
          <TrendChart
            data={revenueTrend}
            labelFor={dayLabel}
            valueFormat={(v) => `₹${v.toFixed(1)}L`}
          />
        </Card>

        <Card title="Mechanic utilization" sub="Last 14 days · % of available hours">
          <TrendChart
            data={utilizationTrend}
            labelFor={dayLabel}
            valueFormat={(v) => `${v}%`}
            color="var(--series-2)"
          />
        </Card>
      </div>

      <div className="grid three section-gap">
        <Card title="Bookings by city" sub="Last 30 days">
          <BarList data={bookingsByCity} />
        </Card>

        <Card title="Bookings by category" sub="Last 30 days">
          <BarList data={bookingsByCategory} color="var(--series-6)" />
        </Card>

        <Card title="Network health">
          <div className="flex between" style={{ alignItems: 'flex-start' }}>
            <Meter value={avgUtil} label="Avg utilization" />
            <Meter value={95} label="First-time fix" color="var(--series-2)" />
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="flex between" style={{ marginBottom: 8 }}>
              <span className="t-muted">Active mechanics</span>
              <span className="t-strong">{mechanics.filter((m) => m.status === 'verified').length}</span>
            </div>
            <div className="flex between" style={{ marginBottom: 8 }}>
              <span className="t-muted">Open orders</span>
              <span className="t-strong">{orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length}</span>
            </div>
            <div className="flex between">
              <span className="t-muted">SLA breaches (today)</span>
              <Badge tone={breaches ? 'danger' : 'success'}>{breaches}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="section-gap">
        <Card title="Today's revenue snapshot" sub="Collected vs pending">
          <div className="flex gap-12 wrap">
            <SnapTile label="Collected" value={inr(1240500)} tone="success" />
            <SnapTile label="Pending (COD)" value={inr(186400)} tone="warning" />
            <SnapTile label="Refunds issued" value={inr(4300)} tone="danger" />
            <SnapTile label="Membership MRR" value={inr(612000)} tone="info" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const SnapTile: React.FC<{ label: string; value: string; tone: string }> = ({
  label,
  value,
  tone,
}) => (
  <div style={{ flex: 1, minWidth: 160 }}>
    <div className="flex gap-8">
      <span className="dot-status" style={{ background: `var(--${tone === 'info' ? 'info' : tone})` }} />
      <span className="t-muted">{label}</span>
    </div>
    <div className="stat-value" style={{ fontSize: 22, marginTop: 2 }}>
      {value}
    </div>
  </div>
);
