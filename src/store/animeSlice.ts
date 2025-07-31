import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAnime } from '../utils/animeApi';

export interface LoadAnimeProps {
  page: number;
  genreId: undefined | number;
}

export const loadAnime = createAsyncThunk(
  'anime/loadAnime',
  async ({ page, genreId }: LoadAnimeProps, { getState, rejectWithValue }) => {
    // @ts-ignore
    const { lastLoadedPage, lastLoadedGenre } = getState().anime;
    if (lastLoadedPage === page && lastLoadedGenre === genreId) {
      // Already loaded, skip
      return rejectWithValue('already_loaded');
    }
    return await fetchAnime(page, genreId);
  },
);

const animeSlice = createSlice({
  name: 'anime',
  initialState: {
    list: [],
    loading: false,
    error: null,
    page: 1,
    genreId: undefined,
    loadedPages: [],
  },
  reducers: {
    setGenre: (state, action) => {
      state.genreId = action.payload;
      state.list = [];
      state.page = 1;
      state.loadedPages = [];
      state.error = null;
    },
    nextPage: state => {
      state.page += 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAnime.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAnime.fulfilled, (state, action) => {
        // @ts-ignore
        if (!state.loadedPages.includes(action.meta.arg.page)) {
          // @ts-ignore
          state.list = [...state.list, ...action.payload];
          // @ts-ignore
          state.loadedPages.push(action.meta.arg.page);
        }
        state.loading = false;
      })
      .addCase(loadAnime.rejected, (state, action) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.error.message;
      });
  },
});

export const { setGenre, nextPage } = animeSlice.actions;
export default animeSlice.reducer;
