import 'react-native-gesture-handler';
import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import FavoriteScreen from './screens/FavoriteScreen.tsx';
import AnimeDetailScreen from './screens/AnimeDetailScreen.tsx';
import { Anime } from './types/anime.ts';
import AnimatedIcon from './components/AnimatedIcon.tsx';

// Tab navigator types
type TabParamList = {
  HomeMain: undefined;
  Favorite: undefined;
};

// Root stack types
type RootStackParamList = {
  Home: undefined;
  AnimeDetail: { anime: Anime };
};

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

let tabIconKey = 0;

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let name: string;
          if (route.name === 'HomeMain') {
            name = 'home';
          } else {
            name = 'heart';
          }
          tabIconKey++;
          return (
            <AnimatedIcon
              key={
                focused
                  ? `${route.name}-focused-${tabIconKey}`
                  : `${route.name}-unfocused-${tabIconKey}`
              }
              name={name}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeMain" component={HomeScreen} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} />
    </Tab.Navigator>
  );
}

const linking: LinkingOptions<any> = {
  prefixes: ['animeexplorer://', 'https://animeexplorer.app'], // Add your actual app URL scheme if any
  config: {
    screens: {
      Home: {
        screens: {
          AnimeList: 'anime',
          AnimeDetail: 'anime/:mal_id',
        },
      },
      Favorite: 'favorites',
    },
  },
};

function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Tabs}
          options={{ headerShown: false, title: '' }}
        />
        <RootStack.Screen
          name="AnimeDetail"
          component={AnimeDetailScreen}
          options={{ title: 'Details' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
