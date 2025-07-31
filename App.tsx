/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import AnimeExplorer from './src/AnimeExplorer.tsx';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import { useEffect } from 'react';
import { loadFavorites } from './src/utils/storage.ts';
import { setFavorites } from './src/store/favoritesSlice.ts';

function InitApp() {
  const isDarkMode = useColorScheme() === 'dark';

  const dispatch = useDispatch();
  useEffect(() => {
    loadFavorites().then(list => dispatch(setFavorites(list)));
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AnimeExplorer />
    </SafeAreaView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <InitApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
