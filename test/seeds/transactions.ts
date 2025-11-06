import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { transactions } from '../../src/drizzle/schema';

export const TRANSACTIONS_SEED = [
  {
    id: 1,
    userId: 1,
    placeId: 1,
    amount: 3500,
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: 2,
    userId: 2,
    placeId: 1,
    amount: -220,
    date: new Date(2021, 4, 8, 20, 0),
  },
  {
    id: 3,
    userId: 1,
    placeId: 1,
    amount: -74,
    date: new Date(2021, 4, 21, 14, 30),
  },
];

export async function seedTransactions(drizzle: DatabaseProvider) {
  await drizzle.insert(transactions).values(TRANSACTIONS_SEED);
}

export async function clearTransactions(drizzle: DatabaseProvider) {
  await drizzle.delete(transactions);
}
