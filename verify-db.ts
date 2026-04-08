import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Dropping table candidatures...');
    await db.execute(sql`DROP TABLE IF EXISTS candidatures CASCADE`);
    console.log('Table dropped. Now syncing again...');
    process.exit(0);
  } catch (err) {
    console.error('Action failed:', err);
    process.exit(1);
  }
}

main();
