import {
  int,
  mysqlTable,
  varchar,
  tinyint,
} from 'drizzle-orm/mysql-core';

export const places = mysqlTable('places', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 })
    .notNull()
    .unique('idx_place_name_unique'),
  rating: tinyint('rating', { unsigned: true }),
});
