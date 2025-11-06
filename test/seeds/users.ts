import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { users } from '../../src/drizzle/schema';
import { Role } from '../../src/auth/roles';

export async function seedUsers(
  app: INestApplication,
  drizzle: DatabaseProvider,
) {
  const authService = app.get(AuthService);
  const passwordHash = await authService.hashPassword('12345678');

  await drizzle.insert(users).values([
    {
      id: 1,
      name: 'Test User',
      email: 'test.user@hogent.be',
      passwordHash,
      roles: [Role.USER],
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin.user@hogent.be',
      passwordHash,
      roles: [Role.ADMIN, Role.USER],
    },
  ]);
}

export async function clearUsers(drizzle: DatabaseProvider) {
  await drizzle.delete(users);
}
