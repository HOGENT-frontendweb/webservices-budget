import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { clearUsers, seedUsers } from './seeds/users';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { clearTransactions, seedTransactions } from './seeds/transactions';
import { clearPlaces, seedPlaces } from './seeds/places';
import { login } from './helpers/login';
import { createTestApp } from './helpers/create-app';
import testAuthHeader from './helpers/testAuthHeader';

describe('Transactions', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userAuthToken: string;

  const url = '/api/transactions';

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await seedUsers(app, drizzle);
    await seedPlaces(drizzle);
    await seedTransactions(drizzle);

    userAuthToken = await login(app);
  });

  afterAll(async () => {
    await clearTransactions(drizzle);
    await clearPlaces(drizzle);
    await clearUsers(drizzle);

    await app.close();
  });

  describe('GET /api/transactions', () => {
    it('should return all transactions for the signed-in user', async () => {
      const res = await request(app.getHttpServer())
        .get(url)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(2);

      expect(res.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            user: expect.objectContaining({
              id: 1,
              name: 'Test User',
              email: 'test.user@hogent.be',
            }),
            place: expect.objectContaining({
              id: 1,
              name: 'Loon',
              rating: 5,
            }),
            amount: 3500,
            date: new Date(2021, 4, 25, 19, 40).toISOString(),
          },
          {
            id: 3,
            user: expect.objectContaining({
              id: 1,
              name: 'Test User',
              email: 'test.user@hogent.be',
            }),
            place: expect.objectContaining({
              id: 1,
              name: 'Loon',
              rating: 5,
            }),
            amount: -74,
            date: new Date(2021, 4, 21, 14, 30).toISOString(),
          },
        ]),
      );
    });

    testAuthHeader(() => request(app.getHttpServer()).get(url));
  });

  describe('GET /api/transactions/:id', () => {
    it('should 200 and return the requested transaction', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/1`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        id: 1,
        user: {
          id: 1,
          name: 'Test User',
          email: 'test.user@hogent.be',
        },
        place: {
          id: 1,
          name: 'Loon',
          rating: 5,
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });

    it('should 404 when requesting not existing transaction', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/2`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'No transaction with this id exists',
      });
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('POST /api/transactions', () => {
    it('should 201 and return the created transaction', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Loon',
        rating: 5,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test.user@hogent.be',
      });
    });

    it('should 404 when place does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send({
          amount: 125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('No place with this id exists');
    });

    it('should 400 when missing amount', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('placeId');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).post(url).send({
        amount: 102,
        date: '2021-05-27T13:00:00.000Z',
        placeId: 1,
      }),
    );
  });

  describe('PUT /api/transactions/:id', () => {
    it('should 200 and return the updated transaction', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Loon',
        rating: 5,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test.user@hogent.be',
      });
    });

    it('should 404 when updating not existing transaction', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/200`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No transaction with this id exists');
    });

    it('should 404 when place does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('No place with this id exists');
    });

    it('should 400 when missing amount', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: 102,
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('placeId');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).put(`${url}/1`).send({
        amount: 102,
        date: '2021-05-27T13:00:00.000Z',
        placeId: 1,
      }),
    );
  });

  describe('DELETE /api/transactions/:id', () => {
    it('should 204 and return nothing', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/1`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing transaction', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/999`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No transaction with this id exists');
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/invalid`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    testAuthHeader(() => request(app.getHttpServer()).delete(`${url}/1`));
  });
});
