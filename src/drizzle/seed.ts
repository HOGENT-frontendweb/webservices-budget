import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,
});

const db = drizzle(connection, {
  schema,
  mode: 'default',
});

async function resetDatabase() {
  console.log('🗑️ Resetting database...');

  await db.delete(schema.places);

  console.log('✅ Database reset completed\n');
}

async function seedPlaces() {
  console.log('📍 Seeding places...');

  await db.insert(schema.places).values([
    {
      id: 1,
      name: 'Loon',
      rating: 5,
    },
    {
      id: 2,
      name: 'Dranken Geers',
      rating: 3,
    },
    {
      id: 3,
      name: 'Irish Pub',
      rating: 4,
    },
  ]);

  console.log('✅ Places seeded successfully\n');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();
  await seedPlaces();

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await connection.end();
  })
  .catch(async (e) => {
    console.error(e);
    await connection.end();
    process.exit(1);
  });
