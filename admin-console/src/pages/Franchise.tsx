import React, { useState } from 'react';

import { Badge, Card, StatTile } from '../components/ui';
import { franchiseLeads as seed } from '../data/mockData';
import { FranchiseLead } from '../types';

const STAGES: FranchiseLead['stage'][] = ['new', 'qualified', 'onboarding', 'live', 'rejected'];
const STAGE_META: Record<FranchiseLead['stage'], { label: string; tone: any }> = {
  new: { label: 'New', tone: 'info' },
  qualified: { label: 'Qualified', tone: 'brand' },
  onboarding: { label: 'Onboarding', tone: 'warning' },
  live: { label: 'Live', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'neutral' },
};

export const Franchise: React.FC = () => {
  const [rows, setRows] = useState<FranchiseLead[]>(seed);

  const move = (id: string, stage: FranchiseLead['stage']) =>
    setRows((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));

  const byStage = (s: FranchiseLead['stage']) => rows.filter((l) => l.stage === s).length;

  return (
    <div className="page">
      <p className="page-intro">
        Capture, qualify and onboard franchise, mechanic-partner and vendor
        applicants through the growth pipeline (FR-31).
      </p>

      <div className="grid kpi" style={{ marginBottom: 16 }}>
        <StatTile label="New leads" value={String(byStage('new'))} foot="awaiting review" />
        <StatTile label="Qualified" value={String(byStage('qualified'))} foot="in discussion" />
        <StatTile label="Onboarding" value={String(byStage('onboarding'))} foot="paperwork / setup" />
        <StatTile label="Live partners" value={String(byStage('live'))} foot="operating" />
      </div>

      <Card title="Lead pipeline">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Type</th>
                <th>City</th>
                <th>Investment</th>
                <th>Submitted</th>
                <th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td className="t-strong">
                    {l.name}
                    <div className="t-muted">{l.phone}</div>
                  </td>
                  <td><Badge tone={l.type === 'Franchise' ? 'brand' : 'neutral'}>{l.type}</Badge></td>
                  <td>{l.city}</td>
                  <td>{l.investment}</td>
                  <td className="t-muted">{l.submitted}</td>
                  <td>
                    <select
                      className="select"
                      style={{ minWidth: 130 }}
                      value={l.stage}
                      onChange={(e) => move(l.id, e.target.value as FranchiseLead['stage'])}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {STAGE_META[s].label}
                        </option>
                      ))}
                    </select>
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
