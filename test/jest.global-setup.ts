import {
  MySqlContainer,
  type StartedMySqlContainer,
} from '@testcontainers/mysql';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as path from 'path';

declare global {
  var mySQLContainer: StartedMySqlContainer;
}

export default async () => {
  console.log('🚢 Pulling and starting MySQL container');
  const container = await new MySqlContainer('mysql:8.0').start();
  process.env.DATABASE_URL = container.getConnectionUri();
  globalThis.mySQLContainer = container;
  console.log('✅ MySQL container started');

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');
  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../migrations'),
  });
  console.log('✅ Migrations completed!');

  await connection.end();
};
