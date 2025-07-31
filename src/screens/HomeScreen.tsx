import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadAnime, nextPage, setGenre } from '../store/animeSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { RootState } from '../store';
import AnimeCard from '../components/AnimeCard';
import GenreFilter from '../components/GenreFilter';
import { Anime } from '../types/anime.ts';

export default function HomeScreen() {
  const PAGE_SIZE = 25;
  const dispatch = useDispatch();
  const {
    list,
    loading,
    error,
    page,
    genreId,
    loadedPages = [],
  } = useSelector((state: RootState) => state.anime);
  const { list: favorites } = useSelector(
    (state: RootState) => state.favorites,
  );

  // On mount, load only if list empty (page 1)
  useEffect(() => {
    if ((!list || list.length === 0) && !loading) {
      dispatch<any>(loadAnime({ page: 1, genreId }));
    }
  }, [genreId]);

  // On page or genreId change, load if this page is not already loaded
  useEffect(() => {
    // @ts-ignore
    if (list && list.length > 0 && !loading && !loadedPages.includes(page)) {
      dispatch<any>(loadAnime({ page, genreId }));
    }
  }, [page, genreId]);

  const onEndReached = () => {
    if (!loading) {
      dispatch<any>(nextPage());
    }
  };

  const isFavorite = useCallback(
    // @ts-ignore
    (id: number) => favorites.some(a => a.mal_id === id),
    [favorites],
  );

  const handleRetry = () => {
    dispatch<any>(loadAnime({ page: 1, genreId }));
  };

  if (error && (!list || list.length === 0)) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-red-500 text-center mb-4 text-lg font-semibold">
          {error || 'Something went wrong.'}
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded px-5 py-2"
          onPress={handleRetry}
        >
          <Text className="text-white font-bold text-base">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <GenreFilter onChange={g => dispatch(setGenre(g))} />
      {loading && (!list || list.length === 0) ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList<Anime>
          data={list}
          keyExtractor={item => String(item.mal_id)}
          getItemLayout={(_, index) => ({
            length: 116, // Approximate height of your AnimeCard (adjust to your actual value)
            offset: 116 * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const localIndex = index % PAGE_SIZE;
            return (
              <AnimeCard
                index={localIndex}
                anime={item}
                favorited={isFavorite(item.mal_id)}
                onFavorite={() => dispatch(toggleFavorite(item))}
              />
            );
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.6}
          ListHeaderComponent={
            error && list && list.length > 0 ? (
              <View className="mx-3 mt-2 bg-red-100 border border-red-200 rounded p-2">
                <Text className="text-red-500 text-center text-sm">
                  {error}
                </Text>
                <TouchableOpacity
                  className="mt-2 bg-red-500 rounded px-4 py-1 self-center"
                  onPress={handleRetry}
                >
                  <Text className="text-white font-semibold text-sm">
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
}
