import fs from 'fs';
import path from 'path';

import { seed } from './seed';
import { DB } from './types';

/**
 * Lightweight JSON-file persistence. The whole DB is a single JSON document,
 * loaded into memory and written back on change. The repository surface
 * (`db.data` + `db.save()`) is storage-agnostic, so this is trivially swappable
 * for Postgres/Prisma in production without touching the route handlers.
 */
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

class Store {
  data: DB;

  constructor() {
    if (fs.existsSync(DATA_FILE)) {
      this.data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } else {
      this.data = seed();
      this.save();
    }
  }

  save() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  reset() {
    this.data = seed();
    this.save();
  }
}

export const db = new Store();
