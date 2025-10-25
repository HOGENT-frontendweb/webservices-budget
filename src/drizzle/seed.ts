import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';
import * as argon2 from 'argon2';
import { Role } from '../auth/roles';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,
});

const db = drizzle(connection, {
  schema,
  mode: 'default',
});

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: 32,
    timeCost: 2,
    memoryCost: 2 ** 16,
  });
}

async function resetDatabase() {
  console.log('🗑️ Resetting database...');

  await db.delete(schema.transactions);
  await db.delete(schema.places);
  await db.delete(schema.users);

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

async function seedUsers() {
  console.log('👥 Seeding users...');

  const passwordHash = await hashPassword('12345678');
  await db.insert(schema.users).values([
    {
      id: 1,
      name: 'Thomas Aelbrecht',
      email: 'thomas.aelbrecht@hogent.be',
      passwordHash: passwordHash,
      roles: [Role.ADMIN, Role.USER],
    },
    {
      id: 2,
      name: 'Pieter Van Der Helst',
      email: 'pieter.vanderhelst@hogent.be',
      passwordHash: passwordHash,
      roles: [Role.USER],
    },
    {
      id: 3,
      name: 'Karine Samyn',
      email: 'karine.samyn@hogent.be',
      passwordHash: passwordHash,
      roles: [Role.USER],
    },
  ]);

  console.log('✅ Users seeded successfully\n');
}

async function seedTransactions() {
  console.log('💰 Seeding transactions...');

  await db.insert(schema.transactions).values([
    // User Thomas
    // ===========
    {
      id: 1,
      userId: 1,
      placeId: 1,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      userId: 1,
      placeId: 2,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      userId: 1,
      placeId: 3,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    },
    // User Pieter
    // ===========
    {
      id: 4,
      userId: 2,
      placeId: 1,
      amount: 4000,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 5,
      userId: 2,
      placeId: 2,
      amount: -220,
      date: new Date(2021, 4, 9, 23, 0),
    },
    {
      id: 6,
      userId: 2,
      placeId: 3,
      amount: -74,
      date: new Date(2021, 4, 22, 12, 0),
    },
    // User Karine
    // ===========
    {
      id: 7,
      userId: 3,
      placeId: 1,
      amount: 4000,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 8,
      userId: 3,
      placeId: 2,
      amount: -220,
      date: new Date(2021, 4, 10, 10, 0),
    },
    {
      id: 9,
      userId: 3,
      placeId: 3,
      amount: -74,
      date: new Date(2021, 4, 19, 11, 30),
    },
  ]);

  console.log('✅ Transactions seeded successfully\n');
}

async function seedUserFavoritePlaces() {
  console.log('💰 Seeding UserFavoritePlaces...');

  await db.insert(schema.userFavoritePlaces).values([
    {
      userId: 1,
      placeId: 1,
    },
    {
      userId: 1,
      placeId: 2,
    },
    {
      userId: 2,
      placeId: 1,
    },
  ]);

  console.log('✅ UserFavoritePlaces seeded successfully\n');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();
  await seedUsers();
  await seedPlaces();
  await seedTransactions();
  await seedUserFavoritePlaces();

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
