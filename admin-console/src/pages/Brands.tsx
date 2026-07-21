import React, { useState } from 'react';

import { api } from '../api';
import { Badge, Button, Card } from '../components/ui';
import { useLoad } from '../hooks';

interface Brand {
  id: string;
  name: string;
  type: 'Petrol' | 'EV' | 'Both';
  models: string[];
}

export const Brands: React.FC = () => {
  const { data, loading, reload } = useLoad<Brand[]>('/brands');
  const [name, setName] = useState('');
  const [type, setType] = useState<Brand['type']>('Petrol');
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({});

  const addBrand = async () => {
    if (!name.trim()) return;
    await api.post('/brands', { name: name.trim(), type });
    setName('');
    reload();
  };

  const addModel = async (b: Brand) => {
    const m = (modelInputs[b.id] ?? '').trim();
    if (!m) return;
    await api.post(`/brands/${b.id}/models`, { model: m });
    setModelInputs((prev) => ({ ...prev, [b.id]: '' }));
    reload();
  };

  if (loading || !data) return <div className="page"><p className="page-intro">Loading brands…</p></div>;
  const totalModels = data.reduce((s, b) => s + b.models.length, 0);

  return (
    <div className="page">
      <p className="page-intro">
        Two-wheeler make/model master data that drives service recommendations and
        pricing (FR-26). Currently {data.length} brands · {totalModels} models.
      </p>

      <Card title="Add brand" className="section-gap">
        <div className="flex gap-12 wrap">
          <input className="input" style={{ maxWidth: 260 }} placeholder="Brand name (e.g. Suzuki)" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="select" style={{ maxWidth: 160 }} value={type} onChange={(e) => setType(e.target.value as Brand['type'])}>
            <option>Petrol</option><option>EV</option><option>Both</option>
          </select>
          <Button onClick={addBrand} disabled={!name.trim()}>+ Add brand</Button>
        </div>
      </Card>

      <div className="grid two section-gap">
        {data.map((b) => (
          <Card key={b.id} title={b.name} action={<Badge tone={b.type === 'EV' ? 'info' : b.type === 'Both' ? 'brand' : 'neutral'}>{b.type}</Badge>} sub={`${b.models.length} models`}>
            <div className="chips" style={{ marginBottom: 12 }}>
              {b.models.length === 0 && <span className="t-muted">No models yet</span>}
              {b.models.map((m) => <span key={m} className="chip active" style={{ cursor: 'default' }}>{m}</span>)}
            </div>
            <div className="flex gap-8">
              <input className="input" placeholder="Add model…" value={modelInputs[b.id] ?? ''} onChange={(e) => setModelInputs((prev) => ({ ...prev, [b.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addModel(b)} />
              <Button variant="outline" sm onClick={() => addModel(b)}>Add</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
