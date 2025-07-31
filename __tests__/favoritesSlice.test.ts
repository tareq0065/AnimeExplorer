import favoritesReducer, { toggleFavorite } from '../src/store/favoritesSlice';

const initialState = {
  list: [],
};

const sampleAnime = { mal_id: 1, title: 'Cowboy Bebop' };

test('should add an anime to favorites', () => {
  const nextState = favoritesReducer(initialState, toggleFavorite(sampleAnime));
  expect(nextState.list).toContainEqual(sampleAnime);
});

test('should remove an anime from favorites if already present', () => {
  const preState = { list: [sampleAnime] };
  // @ts-ignore
  const nextState = favoritesReducer(preState, toggleFavorite(sampleAnime));
  expect(nextState.list).not.toContainEqual(sampleAnime);
});
