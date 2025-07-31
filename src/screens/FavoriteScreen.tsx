import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import AnimeCard from '../components/AnimeCard';
import { toggleFavorite } from '../store/favoritesSlice';

export default function FavoritesScreen() {
  const { list } = useSelector((state: RootState) => state.favorites);
  const dispatch = useDispatch();

  if (!list.length) {
    return (
      <Text className="mt-32 text-lg text-center text-gray-500">
        No favorites yet.
      </Text>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <FlatList
        data={list}
        // @ts-ignore
        keyExtractor={item => item.mal_id.toString()}
        renderItem={({ item }) => (
          <AnimeCard
            anime={item}
            favorited={true}
            onFavorite={() => dispatch(toggleFavorite(item))}
          />
        )}
      />
    </View>
  );
}
