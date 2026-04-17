import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
});

async function main() {
  const db = drizzle(pool);

  await migrate(db, {
    migrationsFolder: './drizzle',
  });

  console.log('✅ migrations applied');

  await pool.end();
}

pool.on('error', (err) => {
  console.error('PG CLIENT ERROR:', err);
});

main().catch((err: Error) => {
  console.error('❌ migration error:', err);
  process.exit(1);
});
