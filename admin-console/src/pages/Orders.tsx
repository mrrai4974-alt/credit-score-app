import React, { useMemo, useState } from 'react';

import { Badge, Button, Card, PillTabs, inr } from '../components/ui';
import { mechanicsForDispatch, orders as seed } from '../data/mockData';
import { Order, OrderStatus } from '../types';

const STATUS_META: Record<OrderStatus, { label: string; tone: any }> = {
  unassigned: { label: 'Unassigned', tone: 'danger' },
  assigned: { label: 'Assigned', tone: 'info' },
  en_route: { label: 'En route', tone: 'info' },
  in_service: { label: 'In service', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

const sla = (mins: number) => {
  if (mins < 0) return <Badge tone="danger">Breached {Math.abs(mins)}m</Badge>;
  if (mins <= 15) return <Badge tone="warning">{mins}m left</Badge>;
  return <Badge tone="success">{mins}m left</Badge>;
};

export const Orders: React.FC = () => {
  const [rows, setRows] = useState<Order[]>(seed);
  const [tab, setTab] = useState('active');

  const assign = (id: string, mechanic: string) =>
    setRows((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, mechanic, status: o.status === 'unassigned' ? 'assigned' : o.status }
          : o,
      ),
    );

  const counts = useMemo(
    () => ({
      active: rows.filter((o) => !['completed', 'cancelled'].includes(o.status)).length,
      completed: rows.filter((o) => o.status === 'completed').length,
    }),
    [rows],
  );

  const filtered = rows.filter((o) =>
    tab === 'active'
      ? !['completed', 'cancelled'].includes(o.status)
      : o.status === 'completed',
  );

  return (
    <div className="page">
      <p className="page-intro">
        Assign and reassign mechanics, and monitor the 60-minute turnaround SLA in
        real time (FR-29). Unassigned jobs and SLA breaches are flagged first.
      </p>

      <div className="flex between" style={{ marginBottom: 16 }}>
        <PillTabs
          value={tab}
          onChange={setTab}
          options={[
            { key: 'active', label: `Active (${counts.active})` },
            { key: 'completed', label: `Completed (${counts.completed})` },
          ]}
        />
        <Button variant="outline" sm>
          🗺️ Live map view
        </Button>
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer / vehicle</th>
                <th>City</th>
                <th>Slot</th>
                <th>Status</th>
                <th>SLA</th>
                <th className="t-num">Amount</th>
                <th>Mechanic</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="t-strong">
                    {o.code}
                    <div className="t-muted">{o.service}</div>
                  </td>
                  <td>
                    {o.customer}
                    <div className="t-muted">{o.vehicle}</div>
                  </td>
                  <td>{o.city}</td>
                  <td>{o.slot}</td>
                  <td>
                    <Badge tone={STATUS_META[o.status].tone}>
                      {STATUS_META[o.status].label}
                    </Badge>
                  </td>
                  <td>{o.status === 'completed' ? <span className="t-muted">—</span> : sla(o.slaMinsLeft)}</td>
                  <td className="t-num t-strong">{inr(o.amount)}</td>
                  <td>
                    {o.status === 'completed' ? (
                      <span className="t-muted">{o.mechanic}</span>
                    ) : (
                      <select
                        className="select"
                        style={{ minWidth: 130 }}
                        value={o.mechanic ?? ''}
                        onChange={(e) => assign(o.id, e.target.value)}
                      >
                        <option value="" disabled>
                          Assign…
                        </option>
                        {mechanicsForDispatch.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
