import { INestApplication } from '@nestjs/common';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { createTestApp } from './helpers/create-app';
import { PLACES_SEED, seedPlaces, clearPlaces } from './seeds/places';
import request from 'supertest';

describe('Places', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;

  const url = '/api/places';

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await seedPlaces(drizzle);
  });

  afterAll(async () => {
    await clearPlaces(drizzle);
    await app.close();
  });

  describe('GET /api/places', () => {
    it('should 200 and return all places', async () => {
      const response = await request(app.getHttpServer()).get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toEqual(expect.arrayContaining(PLACES_SEED));
    });
  });
});
