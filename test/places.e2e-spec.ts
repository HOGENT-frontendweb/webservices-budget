import { INestApplication } from '@nestjs/common';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { createTestApp } from './helpers/create-app';
import { PLACES_SEED, seedPlaces, clearPlaces } from './seeds/places';
import request from 'supertest';
import { clearUsers, seedUsers } from './seeds/users';
import { seedTransactions, clearTransactions } from './seeds/transactions';
import { login, loginAdmin } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';

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
      const response = await request(app.getHttpServer())
        .get(url)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toEqual(expect.arrayContaining(PLACES_SEED));
    });

    testAuthHeader(() => request(app.getHttpServer()).get(url));
  });

  describe('GET /api/places/:id', () => {
    it('should 200 and return the requested place', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(userAuthToken, { type: 'bearer' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(PLACES_SEED[0]);
      expect(response.body).toHaveProperty('transactions');
    });

    it('should 404 when requesting not existing place', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/5`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No place with this id exists');
    });

    it('should 400 with invalid place id', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    testAuthHeader(() => request(app.getHttpServer()).get(url));
  });

  describe('POST /api/places', () => {
    it("should 200 and return the created place with it's rating", async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          name: 'Lovely place',
          rating: 5,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Lovely place',
          rating: 5,
          transactions: [],
        }),
      );
    });

    it('should 409 for duplicate place name', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({ name: 'Lovely place', rating: 5 })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        message: 'A place with this name already exists',
      });
    });

    it('should 400 when missing name', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({ rating: 3 })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          name: 'The wrong place',
          rating: 0,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          name: 'The wrong place',
          rating: 6,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).post(url).send({ name: 'New place' }),
    );
  });

  describe('PUT /api/places/:id', () => {
    it('should 200 and return the updated place', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          name: 'Changed name',
          rating: 1,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Changed name',
          rating: 1,
        }),
      );
    });

    it('should 409 for duplicate place name', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/2`)
        .send({
          name: 'Changed name',
          rating: 1,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toEqual(
        'A place with this name already exists',
      );
    });

    it('should 400 when missing name', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({ rating: 3 })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 0,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 6,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        })
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('rating');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).put(`${url}/1`).send({
        name: 'Changed name',
        rating: 1,
      }),
    );
  });

  describe('DELETE /api/places/:id', () => {
    it('should 204 and return nothing', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/3`)
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 400 with invalid place id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/invalid`)
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should 404 with not existing place', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/5`)
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No place with this id exists');
    });

    testAuthHeader(() => request(app.getHttpServer()).delete(`${url}/1`));
  });
});
