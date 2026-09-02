import { users } from '../drizzle/schema';

export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;
