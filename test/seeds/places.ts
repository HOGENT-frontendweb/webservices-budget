import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { places } from '../../src/drizzle/schema';

export const PLACES_SEED = [
  {
    id: 1,
    name: 'Loon',
    rating: 5,
  },
  {
    id: 2,
    name: 'Benzine',
    rating: 2,
  },
  {
    id: 3,
    name: 'Irish pub',
    rating: 4,
  },
];

export async function seedPlaces(drizzle: DatabaseProvider) {
  await drizzle.insert(places).values(PLACES_SEED);
}

export async function clearPlaces(drizzle: DatabaseProvider) {
  await drizzle.delete(places);
}
