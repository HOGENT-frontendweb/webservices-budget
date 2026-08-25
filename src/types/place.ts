import { places } from '../drizzle/schema';

export type Place = typeof places.$inferSelect;
export type CreatePlace = typeof places.$inferInsert;
