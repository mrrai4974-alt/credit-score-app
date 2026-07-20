import React, { useState } from 'react';

import { Badge, Button, Card } from '../components/ui';
import { brands as seed } from '../data/mockData';
import { BrandModel } from '../types';

export const Brands: React.FC = () => {
  const [rows, setRows] = useState<BrandModel[]>(seed);
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<BrandModel['type']>('Petrol');
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({});

  const addBrand = () => {
    if (!brand.trim()) return;
    setRows((prev) => [{ brand: brand.trim(), type, models: [] }, ...prev]);
    setBrand('');
  };

  const addModel = (b: string) => {
    const m = (modelInputs[b] ?? '').trim();
    if (!m) return;
    setRows((prev) =>
      prev.map((r) => (r.brand === b ? { ...r, models: [...r.models, m] } : r)),
    );
    setModelInputs((prev) => ({ ...prev, [b]: '' }));
  };

  const totalModels = rows.reduce((s, r) => s + r.models.length, 0);

  return (
    <div className="page">
      <p className="page-intro">
        Two-wheeler make/model master data that drives service recommendations and
        pricing (FR-26). Currently {rows.length} brands · {totalModels} models.
      </p>

      <Card title="Add brand" className="section-gap">
        <div className="flex gap-12 wrap">
          <input
            className="input"
            style={{ maxWidth: 260 }}
            placeholder="Brand name (e.g. Suzuki)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <select className="select" style={{ maxWidth: 160 }} value={type} onChange={(e) => setType(e.target.value as BrandModel['type'])}>
            <option>Petrol</option>
            <option>EV</option>
            <option>Both</option>
          </select>
          <Button onClick={addBrand} disabled={!brand.trim()}>
            + Add brand
          </Button>
        </div>
      </Card>

      <div className="grid two section-gap">
        {rows.map((r) => (
          <Card
            key={r.brand}
            title={r.brand}
            action={<Badge tone={r.type === 'EV' ? 'info' : r.type === 'Both' ? 'brand' : 'neutral'}>{r.type}</Badge>}
            sub={`${r.models.length} models`}
          >
            <div className="chips" style={{ marginBottom: 12 }}>
              {r.models.length === 0 && <span className="t-muted">No models yet</span>}
              {r.models.map((m) => (
                <span key={m} className="chip active" style={{ cursor: 'default' }}>
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-8">
              <input
                className="input"
                placeholder="Add model…"
                value={modelInputs[r.brand] ?? ''}
                onChange={(e) => setModelInputs((prev) => ({ ...prev, [r.brand]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addModel(r.brand)}
              />
              <Button variant="outline" sm onClick={() => addModel(r.brand)}>
                Add
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
