import React from 'react';

import { api } from '../api';
import { Badge, Card, StatTile } from '../components/ui';
import { useLoad } from '../hooks';

type Stage = 'new' | 'qualified' | 'onboarding' | 'live' | 'rejected';

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  type: 'Franchise' | 'Mechanic Partner' | 'Vendor' | 'Callback';
  detail: string;
  stage: Stage;
  submittedAt: string;
}

const STAGES: Stage[] = ['new', 'qualified', 'onboarding', 'live', 'rejected'];
const STAGE_LABEL: Record<Stage, string> = {
  new: 'New', qualified: 'Qualified', onboarding: 'Onboarding', live: 'Live', rejected: 'Rejected',
};

export const Franchise: React.FC = () => {
  const { data, loading, reload } = useLoad<Lead[]>('/leads');

  const move = async (id: string, stage: Stage) => {
    await api.patch(`/leads/${id}`, { stage });
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading leads…</p></div>;
  const byStage = (s: Stage) => data.filter((l) => l.stage === s).length;

  return (
    <div className="page">
      <p className="page-intro">
        Capture, qualify and onboard franchise, mechanic-partner and vendor
        applicants (FR-31). Leads flow in live from the marketing site's forms.
      </p>

      <div className="grid kpi" style={{ marginBottom: 16 }}>
        <StatTile label="New leads" value={String(byStage('new'))} foot="awaiting review" />
        <StatTile label="Qualified" value={String(byStage('qualified'))} foot="in discussion" />
        <StatTile label="Onboarding" value={String(byStage('onboarding'))} foot="paperwork / setup" />
        <StatTile label="Live partners" value={String(byStage('live'))} foot="operating" />
      </div>

      <Card title="Lead pipeline">
        {data.length === 0 ? (
          <div className="empty">No leads yet. Submissions from the marketing site's franchise/partner/callback forms appear here.</div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Applicant</th><th>Type</th><th>City</th><th>Detail</th><th>Stage</th></tr></thead>
              <tbody>
                {data.map((l) => (
                  <tr key={l.id}>
                    <td className="t-strong">{l.name}<div className="t-muted">{l.phone}</div></td>
                    <td><Badge tone={l.type === 'Franchise' ? 'brand' : 'neutral'}>{l.type}</Badge></td>
                    <td>{l.city}</td>
                    <td className="t-muted">{l.detail || '—'}</td>
                    <td>
                      <select className="select" style={{ minWidth: 130 }} value={l.stage} onChange={(e) => move(l.id, e.target.value as Stage)}>
                        {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
