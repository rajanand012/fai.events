import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var _db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function createDatabase() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./data/fai.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

let db: ReturnType<typeof drizzle<typeof schema>>;

if (process.env.NODE_ENV === 'production') {
  db = createDatabase();
} else {
  if (!global._db) {
    global._db = createDatabase();
  }
  db = global._db;
}

export { db };
