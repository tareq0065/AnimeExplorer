import { createSlice } from '@reduxjs/toolkit';
import { saveFavorites } from '../utils/storage';

const initialState = { list: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const anime = action.payload;
      // @ts-ignore
      const index = state.list.findIndex(a => a.mal_id === anime.mal_id);
      if (index === -1) {
        // @ts-ignore
        state.list.push(anime);
      } else state.list.splice(index, 1);
      saveFavorites(state.list);
    },
    setFavorites: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
