import { Pool } from 'pg';

import { seed } from './seed';
import { DB } from './types';

/**
 * Postgres-backed store.
 *
 * The whole dataset is held in memory (`db.data`) for fast, synchronous access
 * from the route handlers, and persisted to Postgres through-write on every
 * `save()`. Each collection is a real table (`id TEXT PRIMARY KEY, doc JSONB`);
 * the bookings table adds generated columns (status/city/customer_id/
 * mechanic_id) so the data is queryable with plain SQL:
 *
 *   SELECT doc->>'code', status, city FROM bookings WHERE status = 'booked';
 *
 * Writes are serialized so overlapping saves can't interleave.
 */

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://doorstep:doorstep@localhost:5432/doorstep';

// collection name -> { table, idKey }
const COLLECTIONS: { key: keyof DB; table: string; idKey: string }[] = [
  { key: 'users', table: 'users', idKey: 'id' },
  { key: 'mechanics', table: 'mechanics', idKey: 'id' },
  { key: 'services', table: 'services', idKey: 'id' },
  { key: 'brands', table: 'brands', idKey: 'id' },
  { key: 'vehicles', table: 'vehicles', idKey: 'id' },
  { key: 'bookings', table: 'bookings', idKey: 'id' },
  { key: 'disputes', table: 'disputes', idKey: 'id' },
  { key: 'plans', table: 'plans', idKey: 'id' },
  { key: 'coupons', table: 'coupons', idKey: 'id' },
  { key: 'leads', table: 'leads', idKey: 'id' },
  { key: 'content', table: 'content', idKey: 'id' },
  { key: 'memberships', table: 'memberships', idKey: 'customerId' },
];

const SCHEMA = `
${COLLECTIONS.filter((c) => c.table !== 'bookings')
  .map(
    (c) => `CREATE TABLE IF NOT EXISTS ${c.table} (
  id TEXT PRIMARY KEY,
  doc JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  )
  .join('\n')}

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  doc JSONB NOT NULL,
  status TEXT GENERATED ALWAYS AS (doc->>'status') STORED,
  city TEXT GENERATED ALWAYS AS (doc->>'city') STORED,
  customer_id TEXT GENERATED ALWAYS AS (doc->>'customerId') STORED,
  mechanic_id TEXT GENERATED ALWAYS AS (doc->>'mechanicId') STORED,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_city ON bookings(city);
`;

class Store {
  data: DB = seed();
  private pool = new Pool({ connectionString: DATABASE_URL });
  private writing: Promise<void> = Promise.resolve();
  private dirty = false;

  async init() {
    await this.pool.query(SCHEMA);
    const { rows } = await this.pool.query<{ c: string }>('SELECT count(*) AS c FROM users');
    if (Number(rows[0].c) === 0) {
      this.data = seed();
      await this.persist();
      console.log('Seeded Postgres with demo data.');
    } else {
      await this.load();
      console.log('Loaded dataset from Postgres.');
    }
  }

  private async load() {
    const next = seed(); // shape template
    for (const c of COLLECTIONS) {
      const { rows } = await this.pool.query<{ doc: unknown }>(`SELECT doc FROM ${c.table}`);
      (next as unknown as Record<string, unknown>)[c.key] = rows.map((r) => r.doc);
    }
    this.data = next;
  }

  private async persist() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const c of COLLECTIONS) {
        const rows = (this.data[c.key] as unknown as Record<string, unknown>[]) ?? [];
        const ids = rows.map((r) => String(r[c.idKey]));
        await client.query(
          `DELETE FROM ${c.table} WHERE NOT (id = ANY($1::text[]))`,
          [ids.length ? ids : ['__none__']],
        );
        for (const r of rows) {
          await client.query(
            `INSERT INTO ${c.table} (id, doc, updated_at) VALUES ($1, $2::jsonb, now())
             ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc, updated_at = now()`,
            [String(r[c.idKey]), JSON.stringify(r)],
          );
        }
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  }

  /** Schedule a through-write. Handlers stay synchronous; writes are serialized. */
  save() {
    this.dirty = true;
    this.writing = this.writing.then(async () => {
      if (!this.dirty) return;
      this.dirty = false;
      try {
        await this.persist();
      } catch (e) {
        console.error('Persist failed:', e);
      }
    });
  }

  /** Await all pending writes (used on shutdown). */
  async flush() {
    await this.writing;
  }

  reset() {
    this.data = seed();
    this.save();
  }
}

export const db = new Store();
