import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
import { prisma } from '../../src/data';

const data = {
  transactions: [
    {
      id: 1,
      user_id: 1,
      place_id: 1,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      user_id: 1,
      place_id: 1,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      user_id: 1,
      place_id: 1,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    },
  ],
  places: [
    {
      id: 1,
      name: 'Test place',
      rating: 3,
    },
  ],
  users: [
    {
      id: 1,
      name: 'Test User',
    },
  ],
};

const dataToDelete = {
  transactions: [1, 2, 3],
  places: [1],
  users: [1],
};

describe('Transactions', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/transactions';

  describe('GET /api/transactions', () => {
    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 200 and return all transactions', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            user: {
              id: 1,
              name: 'Test User',
            },
            place: {
              id: 1,
              name: 'Test place',
              rating: 3,
            },
            amount: -220,
            date: new Date(2021, 4, 8, 20, 0).toJSON(),
          },
          {
            id: 3,
            user: {
              id: 1,
              name: 'Test User',
            },
            place: {
              id: 1,
              name: 'Test place',
              rating: 3,
            },
            amount: -74,
            date: new Date(2021, 4, 21, 14, 30).toJSON(),
          },
        ]),
      );
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/transactions/:id', () => {

    const url = '/api/transactions';

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 200 and return the requested transaction', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        id: 1,
        user: {
          id: 1,
          name: 'Test User',
        },
        place: {
          id: 1,
          name: 'Test place',
          rating: 3,
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });

    it('should 404 when requesting not existing transaction', async () => {
      const response = await request.get(`${url}/200`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No transaction with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('POST /api/transactions', () => {
    const transactionsToDelete: number[] = [];

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: transactionsToDelete } },
      });

      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });

      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 201 and return the created transaction', async () => {
      const response = await request.post(url).send({
        amount: 102,
        date: '2021-05-27T13:00:00.000Z',
        placeId: 1,
        userId: 1,
      });
    
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        rating: 3,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
      });
    
      transactionsToDelete.push(response.body.id);
    });

    it('should 404 when place does not exist', async () => {
      const response = await request.post(url)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing amount', async () => {
      const response = await request.post(url)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 4,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          placeId: 4,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });
  });

  describe('PUT /api/transactions/:id', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });

      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });

      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 200 and return the updated transaction', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        rating: 3,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
      });
    });

    it('should 404 when updating not existing transaction', async () => {
      const response = await request.put(`${url}/200`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No transaction with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when place does not exist', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing amount', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          amount: 102,
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });

  });

  describe('DELETE /api/transactions/:id', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.create({ data: data.transactions[0]! });
    });

    afterAll(async () => {
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });

      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing place', async () => {
      const response = await request.delete(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No transaction with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});
