import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './animeSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
