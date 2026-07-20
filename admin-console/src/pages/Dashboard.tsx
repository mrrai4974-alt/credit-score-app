import React from 'react';

import { BarList, Meter, TrendChart } from '../components/charts';
import { Badge, Card, StatTile, inr } from '../components/ui';
import { revenueTrend, utilizationTrend } from '../data/mockData';
import { useLoad } from '../hooks';

interface DashboardData {
  kpis: { bookings: number; revenue: number; avgRating: string; openOrders: number; unassigned: number };
  byCity: { label: string; value: number }[];
  byCategory: { label: string; value: number }[];
  mechanics: { total: number; avgUtilization: number };
  openDisputes: number;
}

const dayLabel = (i: number) => `Day ${i + 1}`;

export const Dashboard: React.FC = () => {
  const { data, loading, error } = useLoad<DashboardData>('/analytics/dashboard');

  if (loading) return <div className="page"><p className="page-intro">Loading live metrics…</p></div>;
  if (error || !data) return <div className="page"><p className="page-intro">Could not load analytics: {error}</p></div>;

  return (
    <div className="page">
      <p className="page-intro">
        Live view of bookings, revenue, city performance and mechanic utilization
        across the network (FR-34). Metrics update as bookings flow through the
        platform.
      </p>

      <div className="grid kpi">
        <StatTile label="Total bookings" value={data.kpis.bookings.toLocaleString('en-IN')} foot="all-time on platform" />
        <StatTile label="Revenue (completed)" value={inr(data.kpis.revenue)} foot="incl. GST & approved extras" />
        <StatTile label="Avg. rating" value={String(data.kpis.avgRating)} foot="across rated jobs" />
        <StatTile label="Open orders" value={String(data.kpis.openOrders)} foot={`${data.kpis.unassigned} unassigned`} />
      </div>

      <div className="grid two section-gap">
        <Card title="Revenue trend" sub="Last 14 days · ₹ lakh (illustrative)" action={<Badge tone="success">▲ 9.1%</Badge>}>
          <TrendChart data={revenueTrend} labelFor={dayLabel} valueFormat={(v) => `₹${v.toFixed(1)}L`} />
        </Card>
        <Card title="Mechanic utilization" sub="Last 14 days · % (illustrative)">
          <TrendChart data={utilizationTrend} labelFor={dayLabel} valueFormat={(v) => `${v}%`} color="var(--series-2)" />
        </Card>
      </div>

      <div className="grid three section-gap">
        <Card title="Bookings by city" sub="Live">
          {data.byCity.length ? <BarList data={data.byCity} /> : <p className="t-muted">No bookings yet.</p>}
        </Card>
        <Card title="Bookings by category" sub="Live">
          {data.byCategory.length ? <BarList data={data.byCategory} color="var(--series-6)" /> : <p className="t-muted">No bookings yet.</p>}
        </Card>
        <Card title="Network health">
          <div className="flex between" style={{ alignItems: 'flex-start' }}>
            <Meter value={data.mechanics.avgUtilization} label="Avg utilization" />
            <Meter value={95} label="First-time fix" color="var(--series-2)" />
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="flex between" style={{ marginBottom: 8 }}>
              <span className="t-muted">Active mechanics</span>
              <span className="t-strong">{data.mechanics.total}</span>
            </div>
            <div className="flex between" style={{ marginBottom: 8 }}>
              <span className="t-muted">Open orders</span>
              <span className="t-strong">{data.kpis.openOrders}</span>
            </div>
            <div className="flex between">
              <span className="t-muted">Open disputes</span>
              <Badge tone={data.openDisputes ? 'warning' : 'success'}>{data.openDisputes}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
