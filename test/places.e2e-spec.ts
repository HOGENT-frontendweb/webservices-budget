import { INestApplication } from '@nestjs/common';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { createTestApp } from './helpers/create-app';
import { PLACES_SEED, seedPlaces, clearPlaces } from './seeds/places';
import request from 'supertest';
import { clearUsers, seedUsers } from './seeds/users';
import { login, loginAdmin } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearTransactions, seedTransactions } from './seeds/transactions';

describe('Places', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userAuthToken: string;
  let adminToken: string;

  const url = '/api/places';

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await seedPlaces(drizzle);
    await seedUsers(app, drizzle);
    await seedTransactions(drizzle);

    userAuthToken = await login(app);
    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearTransactions(drizzle);
    await clearPlaces(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/places', () => {
    it('should 200 and return all places', async () => {
      return request(app.getHttpServer())
        .get(url)
        .auth(userAuthToken, { type: 'bearer' })
        .expect(200)
        .expect({ items: PLACES_SEED });
    });

    testAuthHeader(() => request(app.getHttpServer()).get(url));
  });
});
