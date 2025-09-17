// src/data/mock_data.ts
export interface Place {
  id: number;
  name: string;
  rating: number;
}

export const PLACES: Place[] = [
  {
    id: 1,
    name: 'Dranken Geers',
    rating: 3,
  },
  {
    id: 2,
    name: 'Irish Pub',
    rating: 2,
  },
  {
    id: 3,
    name: 'Loon',
    rating: 4,
  },
];
