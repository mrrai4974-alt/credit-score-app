import React, { useState } from 'react';

import { api } from '../api';
import { Badge, Button, Card, PillTabs, inr } from '../components/ui';
import { useLoad } from '../hooks';

type BookingStatus = 'booked' | 'assigned' | 'en_route' | 'in_service' | 'awaiting_approval' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  code: string;
  customerName: string;
  serviceName: string;
  city: string;
  vehicle: string;
  slot: string;
  status: BookingStatus;
  mechanicId: string | null;
  mechanicName: string | null;
  basePrice: number;
  paid: boolean;
}

interface Mechanic {
  id: string;
  name: string;
  verification: string;
}

const STATUS_META: Record<BookingStatus, { label: string; tone: any }> = {
  booked: { label: 'Unassigned', tone: 'danger' },
  assigned: { label: 'Assigned', tone: 'info' },
  en_route: { label: 'En route', tone: 'info' },
  in_service: { label: 'In service', tone: 'warning' },
  awaiting_approval: { label: 'Awaiting approval', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

const withGst = (n: number) => Math.round(n * 1.18);

export const Orders: React.FC = () => {
  const { data: bookings, loading, reload } = useLoad<Booking[]>('/bookings');
  const { data: mechanics } = useLoad<Mechanic[]>('/mechanics');
  const [tab, setTab] = useState('active');

  const assign = async (id: string, mechanicId: string) => {
    await api.post(`/bookings/${id}/assign`, { mechanicId });
    reload();
  };

  if (loading || !bookings) return <div className="page"><p className="page-intro">Loading orders…</p></div>;

  const verified = (mechanics ?? []).filter((m) => m.verification === 'verified');
  const active = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'completed');
  const rows = tab === 'active' ? active : completed;

  return (
    <div className="page">
      <p className="page-intro">
        Assign and reassign mechanics to live bookings coming from the customer app
        (FR-29). New bookings appear as "Unassigned" until dispatched.
      </p>

      <div className="flex between" style={{ marginBottom: 16 }}>
        <PillTabs
          value={tab}
          onChange={setTab}
          options={[
            { key: 'active', label: `Active (${active.length})` },
            { key: 'completed', label: `Completed (${completed.length})` },
          ]}
        />
        <Button variant="outline" sm onClick={reload}>↻ Refresh</Button>
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
                <th className="t-num">Amount</th>
                <th>Mechanic</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="t-strong">{o.code}<div className="t-muted">{o.serviceName}</div></td>
                  <td>{o.customerName}<div className="t-muted">{o.vehicle}</div></td>
                  <td>{o.city}</td>
                  <td>{o.slot}</td>
                  <td><Badge tone={STATUS_META[o.status].tone}>{STATUS_META[o.status].label}</Badge></td>
                  <td className="t-num t-strong">{inr(withGst(o.basePrice))}</td>
                  <td>
                    {o.status === 'completed' ? (
                      <span className="t-muted">{o.mechanicName ?? '—'}</span>
                    ) : (
                      <select
                        className="select"
                        style={{ minWidth: 130 }}
                        value={o.mechanicId ?? ''}
                        onChange={(e) => assign(o.id, e.target.value)}
                      >
                        <option value="" disabled>Assign…</option>
                        {verified.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="empty">No {tab} orders.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
