import {
  int,
  mysqlTable,
  varchar,
  uniqueIndex,
  tinyint,
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
