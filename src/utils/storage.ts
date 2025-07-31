import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES_LIST';

export const saveFavorites = async (favorites: any[]) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const loadFavorites = async () => {
  const str = await AsyncStorage.getItem(FAVORITES_KEY);
  return str ? JSON.parse(str) : [];
};
