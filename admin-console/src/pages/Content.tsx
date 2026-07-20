import React, { useState } from 'react';

import { Badge, Button, Card, PillTabs } from '../components/ui';
import { contentPages as seed } from '../data/mockData';
import { ContentPage } from '../types';

const TYPES: ContentPage['type'][] = ['Service', 'Brand', 'City', 'Blog', 'Media'];

export const Content: React.FC = () => {
  const [rows, setRows] = useState<ContentPage[]>(seed);
  const [tab, setTab] = useState('all');

  const togglePublish = (id: string) =>
    setRows((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'published' ? 'draft' : 'published', updated: 'just now' }
          : p,
      ),
    );

  const filtered = rows.filter((p) => tab === 'all' || p.type === tab);
  const published = rows.filter((p) => p.status === 'published').length;

  return (
    <div className="page">
      <p className="page-intro">
        Manage SEO marketing pages — service, brand, city, blog and media/press
        content (FR-35). {published} of {rows.length} pages published.
      </p>

      <div className="flex between" style={{ marginBottom: 16 }}>
        <PillTabs
          value={tab}
          onChange={setTab}
          options={[{ key: 'all', label: 'All' }, ...TYPES.map((t) => ({ key: t, label: t }))]}
        />
        <Button variant="primary" sm>
          + New page
        </Button>
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Slug</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="t-strong">{p.title}</td>
                  <td><Badge tone="brand">{p.type}</Badge></td>
                  <td className="t-muted">{p.slug}</td>
                  <td className="t-muted">{p.updated}</td>
                  <td>
                    <Badge tone={p.status === 'published' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline" sm onClick={() => togglePublish(p.id)}>
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
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
