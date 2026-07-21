import React, { useState } from 'react';

import { api } from '../api';
import { Badge, Button, Card, PillTabs } from '../components/ui';
import { useLoad } from '../hooks';

interface ContentPage {
  id: string;
  title: string;
  type: 'Service' | 'Brand' | 'City' | 'Blog' | 'Media';
  slug: string;
  status: 'published' | 'draft';
  updated: string;
}

const TYPES: ContentPage['type'][] = ['Service', 'Brand', 'City', 'Blog', 'Media'];

export const Content: React.FC = () => {
  const { data, loading, reload } = useLoad<ContentPage[]>('/content');
  const [tab, setTab] = useState('all');

  const togglePublish = async (p: ContentPage) => {
    await api.patch(`/content/${p.id}`, { status: p.status === 'published' ? 'draft' : 'published' });
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading content…</p></div>;
  const filtered = data.filter((p) => tab === 'all' || p.type === tab);
  const published = data.filter((p) => p.status === 'published').length;

  return (
    <div className="page">
      <p className="page-intro">Manage SEO marketing pages — service, brand, city, blog and media/press content (FR-35). {published} of {data.length} pages published.</p>

      <div className="flex between" style={{ marginBottom: 16 }}>
        <PillTabs value={tab} onChange={setTab} options={[{ key: 'all', label: 'All' }, ...TYPES.map((t) => ({ key: t, label: t }))]} />
        <Button variant="primary" sm>+ New page</Button>
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Title</th><th>Type</th><th>Slug</th><th>Updated</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="t-strong">{p.title}</td>
                  <td><Badge tone="brand">{p.type}</Badge></td>
                  <td className="t-muted">{p.slug}</td>
                  <td className="t-muted">{p.updated}</td>
                  <td><Badge tone={p.status === 'published' ? 'success' : 'warning'}>{p.status}</Badge></td>
                  <td><Button variant="outline" sm onClick={() => togglePublish(p)}>{p.status === 'published' ? 'Unpublish' : 'Publish'}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
