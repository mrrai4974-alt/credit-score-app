import React, { useEffect, useState } from 'react';

import { api } from '../api';
import { Badge, Button, Card, StatTile, inr } from '../components/ui';
import { useLoad } from '../hooks';

type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

interface Dispute {
  id: string;
  bookingCode: string;
  customer: string;
  type: 'refund' | 'warranty' | 'quality';
  status: DisputeStatus;
  amount: number;
  opened: string;
  summary: string;
  audit: { time: string; actor: string; action: string }[];
}

const STATUS_META: Record<DisputeStatus, { label: string; tone: any }> = {
  open: { label: 'Open', tone: 'danger' },
  investigating: { label: 'Investigating', tone: 'warning' },
  resolved: { label: 'Resolved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'neutral' },
};
const TYPE_LABEL = { refund: 'Refund', warranty: 'Warranty', quality: 'Quality' };

export const Disputes: React.FC = () => {
  const { data, loading, reload } = useLoad<Dispute[]>('/disputes');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length && !selectedId) setSelectedId(data[0].id);
  }, [data, selectedId]);

  const act = async (id: string, status: DisputeStatus, action: string) => {
    await api.post(`/disputes/${id}/action`, { status, action });
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading disputes…</p></div>;
  const selected = data.find((d) => d.id === selectedId) ?? data[0];
  const open = data.filter((d) => d.status === 'open' || d.status === 'investigating').length;

  return (
    <div className="page">
      <p className="page-intro">Handle refund, warranty-claim and quality disputes with a full audit trail on every decision (FR-30).</p>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <StatTile label="Open / investigating" value={String(open)} foot="need action" />
        <StatTile label="Total disputes" value={String(data.length)} foot="all-time" />
        <StatTile label="Resolved" value={String(data.filter((d) => d.status === 'resolved').length)} foot="closed" />
      </div>

      {!selected ? (
        <Card><div className="empty">No disputes 🎉</div></Card>
      ) : (
        <div className="grid two" style={{ alignItems: 'start' }}>
          <Card title="Dispute queue">
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Order</th><th>Type</th><th>Status</th><th className="t-num">Amount</th></tr></thead>
                <tbody>
                  {data.map((d) => (
                    <tr key={d.id} onClick={() => setSelectedId(d.id)} style={{ cursor: 'pointer', background: d.id === selected.id ? 'var(--surface-alt)' : undefined }}>
                      <td className="t-strong">{d.bookingCode}<div className="t-muted">{d.customer}</div></td>
                      <td><Badge>{TYPE_LABEL[d.type]}</Badge></td>
                      <td><Badge tone={STATUS_META[d.status].tone}>{STATUS_META[d.status].label}</Badge></td>
                      <td className="t-num">{d.amount ? inr(d.amount) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title={`${selected.bookingCode} · ${TYPE_LABEL[selected.type]}`} sub={`Opened ${selected.opened} · ${selected.customer}`} action={<Badge tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</Badge>}>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 0 }}>{selected.summary}</p>
            {(selected.status === 'open' || selected.status === 'investigating') && (
              <div className="flex gap-8 wrap" style={{ marginBottom: 16 }}>
                {selected.status === 'open' && <Button variant="outline" sm onClick={() => act(selected.id, 'investigating', 'Marked as investigating')}>Investigate</Button>}
                <Button variant="primary" sm onClick={() => act(selected.id, 'resolved', `Resolved · ${selected.amount ? inr(selected.amount) + ' refunded' : 'no refund'}`)}>Resolve{selected.amount ? ` & refund ${inr(selected.amount)}` : ''}</Button>
                <Button variant="danger" sm onClick={() => act(selected.id, 'rejected', 'Claim rejected')}>Reject claim</Button>
              </div>
            )}
            <div className="card-title" style={{ marginBottom: 12 }}>Audit trail</div>
            <div className="audit">
              {selected.audit.map((a, i) => (
                <div className="audit-item" key={i}>
                  <div><span className="t-strong">{a.actor}</span> — {a.action}</div>
                  <div className="audit-time">{a.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
