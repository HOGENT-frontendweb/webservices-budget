import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { userFavoritePlaces } from '../../src/drizzle/schema';

export const USERFAVORITEPLACES_SEED = [
  {
    userId: 1,
    placeId: 1,
  },
  {
    userId: 1,
    placeId: 2,
  },
  {
    userId: 2,
    placeId: 2,
  },
];

export async function seedUserFavoritePlaces(drizzle: DatabaseProvider) {
  await drizzle.insert(userFavoritePlaces).values(USERFAVORITEPLACES_SEED);
}

export async function clearUserFavoritePlaces(drizzle: DatabaseProvider) {
  await drizzle.delete(userFavoritePlaces);
}
