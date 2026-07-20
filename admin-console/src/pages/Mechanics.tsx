import React, { useState } from 'react';

import { Badge, Button, Card, PillTabs, StatTile } from '../components/ui';
import { mechanics as seed } from '../data/mockData';
import { Mechanic, MechanicStatus } from '../types';

const STATUS_META: Record<MechanicStatus, { label: string; tone: any }> = {
  pending: { label: 'KYC pending', tone: 'neutral' },
  in_review: { label: 'In review', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  suspended: { label: 'Suspended', tone: 'danger' },
};

export const Mechanics: React.FC = () => {
  const [rows, setRows] = useState<Mechanic[]>(seed);
  const [tab, setTab] = useState('all');

  const setStatus = (id: string, status: MechanicStatus) =>
    setRows((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

  const verified = rows.filter((m) => m.status === 'verified').length;
  const pending = rows.filter((m) => m.status === 'in_review' || m.status === 'pending').length;
  const avgRating = (
    rows.filter((m) => m.rating > 0).reduce((s, m) => s + m.rating, 0) /
    rows.filter((m) => m.rating > 0).length
  ).toFixed(1);

  const filtered = rows.filter((m) =>
    tab === 'all'
      ? true
      : tab === 'verified'
      ? m.status === 'verified'
      : m.status === 'in_review' || m.status === 'pending',
  );

  return (
    <div className="page">
      <p className="page-intro">
        Onboard and verify mechanics, review KYC and training records, and track
        performance scorecards (FR-28). Verification gates the "verified mechanic"
        trust badge.
      </p>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <StatTile label="Verified mechanics" value={String(verified)} foot="active on network" />
        <StatTile label="Awaiting verification" value={String(pending)} foot="KYC / review queue" />
        <StatTile label="Avg. rating" value={avgRating} foot="verified mechanics" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <PillTabs
          value={tab}
          onChange={setTab}
          options={[
            { key: 'all', label: 'All' },
            { key: 'verified', label: 'Verified' },
            { key: 'queue', label: `Verification queue (${pending})` },
          ]}
        />
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Mechanic</th>
                <th>City</th>
                <th>Skills</th>
                <th>Status</th>
                <th className="t-num">Rating</th>
                <th className="t-num">Jobs</th>
                <th className="t-num">Utilization</th>
                <th className="t-num">Training</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td className="t-strong">
                    {m.name}
                    <div className="t-muted">{m.phone}</div>
                  </td>
                  <td>{m.city}</td>
                  <td>
                    <div className="flex wrap gap-8">
                      {m.skills.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge tone={STATUS_META[m.status].tone}>{STATUS_META[m.status].label}</Badge>
                    {!m.kycComplete && <div className="t-muted">KYC incomplete</div>}
                  </td>
                  <td className="t-num">{m.rating || '—'}</td>
                  <td className="t-num">{m.jobs}</td>
                  <td className="t-num">{m.utilization ? `${m.utilization}%` : '—'}</td>
                  <td className="t-num">{m.trainingComplete}%</td>
                  <td>
                    {m.status === 'verified' ? (
                      <Button variant="danger" sm onClick={() => setStatus(m.id, 'suspended')}>
                        Suspend
                      </Button>
                    ) : m.status === 'suspended' ? (
                      <Button variant="outline" sm onClick={() => setStatus(m.id, 'verified')}>
                        Reinstate
                      </Button>
                    ) : (
                      <div className="flex gap-8">
                        <Button variant="primary" sm onClick={() => setStatus(m.id, 'verified')}>
                          Verify
                        </Button>
                        <Button variant="outline" sm onClick={() => setStatus(m.id, 'suspended')}>
                          Reject
                        </Button>
                      </div>
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
