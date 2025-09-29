import { relations } from 'drizzle-orm';
import {
  int,
  mysqlTable,
  varchar,
  uniqueIndex,
  tinyint,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const places = mysqlTable(
  'places',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    rating: tinyint('rating', { unsigned: true }).notNull(),
  },
  (table) => [uniqueIndex('idx_place_name_unique').on(table.name)],
);

export const users = mysqlTable('users', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const transactions = mysqlTable('transactions', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  amount: int('amount').notNull(),
  date: datetime('date').notNull(),
  userId: int('user_id', { unsigned: true })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  placeId: int('place_id', { unsigned: true })
    .references(() => places.id, { onDelete: 'no action' })
    .notNull(),
});

export const userFavoritePlaces = mysqlTable(
  'user_favorite_places',
  {
    userId: int('user_id', { unsigned: true })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    placeId: int('place_id', { unsigned: true })
      .references(() => places.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.placeId] })],
);

export const placesRelations = relations(places, ({ many }) => ({
  transactions: many(transactions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  place: one(places, {
    fields: [transactions.placeId],
    references: [places.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const userFavoritePlacesRelations = relations(
  userFavoritePlaces,
  ({ one }) => ({
    // Relatie in de richting van user niet gebruikt
    place: one(places, {
      fields: [userFavoritePlaces.placeId],
      references: [places.id],
    }),
  }),
);
