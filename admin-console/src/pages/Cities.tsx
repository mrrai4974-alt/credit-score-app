import React, { useState } from 'react';

import { Badge, Button, Card, StatTile } from '../components/ui';
import { hubs as seed } from '../data/mockData';
import { Hub } from '../types';

export const Cities: React.FC = () => {
  const [rows, setRows] = useState<Hub[]>(seed);

  const goLive = (id: string) =>
    setRows((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: 'live', areaRequests: 0 } : h)),
    );

  const live = rows.filter((h) => h.status === 'live');
  const comingSoon = rows.filter((h) => h.status === 'coming_soon');
  const totalNeighborhoods = live.reduce((s, h) => s + h.neighborhoods, 0);

  return (
    <div className="page">
      <p className="page-intro">
        Manage cities, hubs and serviceability zones, and review "Request Area"
        demand for not-yet-live neighbourhoods (FR-27).
      </p>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <StatTile label="Live hubs" value={String(live.length)} foot={`${new Set(live.map((h) => h.city)).size} cities`} />
        <StatTile label="Neighbourhoods served" value={`${totalNeighborhoods}+`} foot="across live hubs" />
        <StatTile label="Area requests" value={String(comingSoon.reduce((s, h) => s + h.areaRequests, 0))} foot="in coming-soon zones" />
      </div>

      <Card title="Live hubs" className="section-gap">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Hub</th>
                <th>City</th>
                <th className="t-num">Neighbourhoods</th>
                <th className="t-num">Mechanics</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {live.map((h) => (
                <tr key={h.id}>
                  <td className="t-strong">{h.name}</td>
                  <td>{h.city}</td>
                  <td className="t-num">{h.neighborhoods}</td>
                  <td className="t-num">{h.mechanics}</td>
                  <td><Badge tone="success">● Live</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Coming soon" sub="Prioritise launch by demand" className="section-gap">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Hub</th>
                <th>City</th>
                <th className="t-num">Area requests</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comingSoon.map((h) => (
                <tr key={h.id}>
                  <td className="t-strong">{h.name}</td>
                  <td>{h.city}</td>
                  <td className="t-num t-strong">{h.areaRequests}</td>
                  <td>
                    <Button variant="primary" sm onClick={() => goLive(h.id)}>
                      Launch hub
                    </Button>
                  </td>
                </tr>
              ))}
              {comingSoon.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty">All planned hubs are live 🎉</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
