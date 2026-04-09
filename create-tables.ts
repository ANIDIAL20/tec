import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Creating tables in Neon...');
  
  // Create enum type
  try {
    await sql`
      CREATE TYPE statut AS ENUM ('nouveau', 'contacté', 'entretien', 'accepté', 'refusé')
    `;
    console.log('✓ Enum "statut" created');
  } catch (e: any) {
    if (e.message.includes('already exists')) {
      console.log('ℹ Enum "statut" already exists, skipping.');
    } else {
      throw e;
    }
  }

  // Create candidatures table
  await sql`
    CREATE TABLE IF NOT EXISTS candidatures (
      id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
      nom_complet TEXT NOT NULL,
      age         TEXT,
      telephone   TEXT NOT NULL,
      email       TEXT,
      region      TEXT NOT NULL,
      ville       TEXT NOT NULL,
      niveau      TEXT NOT NULL,
      motivations TEXT,
      groupe      TEXT NOT NULL DEFAULT 'G06',
      statut      statut NOT NULL DEFAULT 'nouveau',
      notes       TEXT
    )
  `;
  console.log('✓ Table "candidatures" created successfully!');

  // Verify
  const rows = await sql`SELECT COUNT(*) as count FROM candidatures`;
  console.log(`✓ Table ready — ${rows[0].count} rows currently`);
}

main().catch((err) => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
