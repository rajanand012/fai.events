import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const DB_PATH = path.join(process.cwd(), 'data', 'fai.db');

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var _sqlite: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var _db: BetterSQLite3Database<typeof schema> | undefined;
}

function createDatabase(): {
  sqlite: Database.Database;
  db: BetterSQLite3Database<typeof schema>;
} {
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  return { sqlite, db };
}

// Use a global singleton in development to avoid creating multiple connections
// during hot reloads
let sqlite: Database.Database;
let db: BetterSQLite3Database<typeof schema>;

if (process.env.NODE_ENV === 'production') {
  const instance = createDatabase();
  sqlite = instance.sqlite;
  db = instance.db;
} else {
  if (!global._sqlite || !global._db) {
    const instance = createDatabase();
    global._sqlite = instance.sqlite;
    global._db = instance.db;
  }
  sqlite = global._sqlite;
  db = global._db;
}

export { db, sqlite };
