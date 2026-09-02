import { transactions } from '../drizzle/schema';

export type Transaction = typeof transactions.$inferSelect;
export type CreateTransaction = typeof transactions.$inferInsert;
