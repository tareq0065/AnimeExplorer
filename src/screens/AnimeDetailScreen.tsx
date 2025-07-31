import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { Anime } from '../types/anime';
import ShareButton from '../components/ShareButton';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import FavoriteButton from '../components/FavoriteButton.tsx';
import { toggleFavorite } from '../store/favoritesSlice.ts';

interface AnimeDetailScreenProps {
  route: { params: { anime?: Anime; mal_id?: number } };
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AnimeDetailScreen: React.FC<AnimeDetailScreenProps> = ({ route }) => {
  const dispatch = useDispatch();

  // Support navigation with either full anime or just mal_id (for deep links)
  const { anime: passedAnime, mal_id } = route.params || {};
  const [anime, setAnime] = useState<Anime | undefined>(passedAnime);
  const [showBackground, setShowBackground] = useState(false);
  const { list: favorites } = useSelector(
    (state: RootState) => state.favorites,
  );

  // Dynamic image size
  const [imgHeight, setImgHeight] = useState<number>(screenWidth * 0.5625);
  const [loadingImg, setLoadingImg] = useState(true);

  // Fetch anime from API if missing
  useEffect(() => {
    if (!anime && mal_id) {
      axios.get(`https://api.jikan.moe/v4/anime/${mal_id}`).then(res => {
        setAnime(res.data.data);
      });
    }
  }, [anime, mal_id]);

  // Get image dimensions for max 80% screen height
  useEffect(() => {
    const url =
      anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url;
    if (!url) return;
    Image.getSize(
      url,
      (w, h) => {
        const maxHeight = screenHeight * 0.8;
        const ratio = h / w;
        let finalHeight = screenWidth * ratio;
        if (finalHeight > maxHeight) finalHeight = maxHeight;
        setImgHeight(finalHeight);
        setLoadingImg(false);
      },
      () => {
        setImgHeight(screenWidth * 0.5625);
        setLoadingImg(false);
      },
    );
  }, [anime?.images?.jpg?.large_image_url]);

  // Stats pop animation
  const scoreScale = useSharedValue(1);
  const handleScorePress = () => {
    scoreScale.value = withSpring(1.18, {}, () => {
      scoreScale.value = withSpring(1);
    });
  };
  const animatedScoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  // Parallax scroll
  const scrollY = useSharedValue(0);
  const handleScroll = (e: any) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  };
  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: scrollY.value > 0 ? scrollY.value * 0.5 : 0,
      },
      {
        scale: scrollY.value < 0 ? 1 - scrollY.value / 500 : 1,
      },
    ],
  }));

  // Card section wrapper
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View className="my-2 px-4">
      <Text className="text-lg font-bold text-indigo-700 mb-1">{title}</Text>
      <View className="bg-white rounded-xl shadow p-3">{children}</View>
    </View>
  );

  // Open YouTube trailer
  const openTrailer = () => {
    if (anime?.trailer?.url) Linking.openURL(anime.trailer.url);
  };

  const isFavorite = useCallback(
    // @ts-ignore
    (id: number) => favorites.some(a => a.mal_id === id),
    [favorites],
  );

  // Loading state
  if (!anime) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
        <Text className="mt-2 text-gray-400">Loading anime details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pb-8">
      <View
        className="absolute bottom-2 right-4 bg-gray-200 z-50
      rounded-lg p-2 flex flex-row justify-center items-center gap-4
      "
      >
        <FavoriteButton
          active={isFavorite(anime.mal_id)}
          onToggle={() => dispatch(toggleFavorite(anime))}
        />

        {/* Share Button */}
        <ShareButton
          anime={{
            mal_id: anime.mal_id,
            title: anime.title,
            animeUrl: anime.url,
          }}
        />
      </View>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 relative"
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image + Parallax */}
        <View className="h-[520px] w-full overflow-hidden bg-gray-200">
          <View className="w-full bg-gray-200 justify-center items-center overflow-hidden">
            {loadingImg ? (
              <ActivityIndicator className="mt-6" />
            ) : (
              <Animated.Image
                source={{
                  uri:
                    anime.images?.jpg?.large_image_url ||
                    anime.images?.jpg?.image_url,
                }}
                style={[
                  {
                    width: screenWidth,
                    height: imgHeight,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                  },
                  parallaxStyle,
                ]}
                resizeMode="cover"
                entering={FadeIn.duration(600)}
              />
            )}
          </View>
          {anime.trailer?.images?.maximum_image_url && (
            <Pressable
              className="absolute bottom-10 right-4 rounded-full p-3 bg-red-600"
              onPress={openTrailer}
            >
              <Image
                source={{ uri: anime.trailer?.images.maximum_image_url }}
                className="w-10 h-10 rounded-lg border-2 border-white"
                resizeMode="cover"
              />
              <View className="absolute inset-0 items-center justify-center flex-row">
                <Text className="text-2xl text-white font-bold text-center">
                  <Feather name="play" size={16} />
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Animated Score/Rank/Pop Card */}
        <View className="flex-row justify-center -mt-7 z-10">
          <Animated.View
            className="flex-row space-x-3 gap-2"
            entering={FadeInUp.duration(500).delay(200)}
          >
            <Pressable onPress={handleScorePress}>
              <Animated.View
                style={animatedScoreStyle}
                className="bg-white rounded-2xl shadow px-4 py-2 items-center"
              >
                <Text className="text-xl font-bold text-yellow-500">
                  {anime.score ?? '--'}
                </Text>
                <Text className="text-xs text-gray-500">Score</Text>
                <Text className="text-xs text-gray-400">
                  {anime.scored_by?.toLocaleString() ?? ''} votes
                </Text>
              </Animated.View>
            </Pressable>
            <View className="bg-white rounded-2xl shadow px-4 py-2 items-center">
              <Text className="text-xl font-bold text-indigo-600">
                #{anime.rank ?? '--'}
              </Text>
              <Text className="text-xs text-gray-500">Rank</Text>
              <Text className="text-xs text-gray-400">
                Popularity #{anime.popularity ?? '--'}
              </Text>
            </View>
            <View className="bg-white rounded-2xl shadow px-4 py-2 items-center">
              <Text className="text-xl font-bold text-pink-600">
                {anime.members?.toLocaleString() ?? '--'}
              </Text>
              <Text className="text-xs text-gray-500">Members</Text>
              <Text className="text-xs text-gray-400">
                {anime.favorites?.toLocaleString() ?? '--'} favs
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Titles */}
        <View className="px-4 mt-5 items-center">
          <Text
            className="text-3xl font-bold text-center text-indigo-900"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {anime.title}
          </Text>
          {anime.title_japanese ? (
            <Text className="text-lg text-gray-500 italic text-center mt-1">
              {anime.title_japanese}
            </Text>
          ) : null}
          {anime.title_english && anime.title_english !== anime.title ? (
            <Text className="text-base text-gray-600 text-center mt-1">
              {anime.title_english}
            </Text>
          ) : null}
          {anime.titles?.length && anime.titles.length > 1 && (
            <Text className="text-xs text-gray-400 text-center mt-1">
              {anime.titles.map(t => t.title).join(' / ')}
            </Text>
          )}
          <Text className="mt-2 text-xs text-gray-400">
            {anime.url ? (
              <Text
                className="underline"
                onPress={() => Linking.openURL(anime.url)}
              >
                MyAnimeList Page
              </Text>
            ) : null}
          </Text>
        </View>

        {/* Details Section */}
        <Section title="Details">
          <View className="flex-row flex-wrap items-center">
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Type:{' '}
                <Text className="text-gray-600">{anime.type ?? '--'}</Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Episodes:{' '}
                <Text className="text-gray-600">{anime.episodes ?? '--'}</Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Status:{' '}
                <Text className="text-gray-600">{anime.status ?? '--'}</Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Aired:{' '}
                <Text className="text-gray-600">
                  {anime.aired?.string ?? '--'}
                </Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Duration:{' '}
                <Text className="text-gray-600">{anime.duration ?? '--'}</Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Rating:{' '}
                <Text className="text-gray-600">{anime.rating ?? '--'}</Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Season:{' '}
                <Text className="text-gray-600">
                  {anime.season ?? '--'} {anime.year ?? ''}
                </Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Broadcast:{' '}
                <Text className="text-gray-600">
                  {anime.broadcast?.string ?? '--'}
                </Text>
              </Text>
            </View>
            <View className="mr-6 mb-2">
              <Text className="font-medium text-gray-800">
                Source:{' '}
                <Text className="text-gray-600">{anime.source ?? '--'}</Text>
              </Text>
            </View>
          </View>
        </Section>

        {/* Production Section */}
        <Section title="Production">
          <Text className="mb-1 text-gray-700">
            Producers:{' '}
            <Text className="text-gray-600">
              {anime.producers?.map(p => p.name).join(', ') || 'N/A'}
            </Text>
          </Text>
          <Text className="mb-1 text-gray-700">
            Studios:{' '}
            <Text className="text-gray-600">
              {anime.studios?.map(s => s.name).join(', ') || 'N/A'}
            </Text>
          </Text>
          <Text className="mb-1 text-gray-700">
            Licensors:{' '}
            <Text className="text-gray-600">
              {anime.licensors?.map(l => l.name).join(', ') || 'N/A'}
            </Text>
          </Text>
        </Section>

        {/* Genres & Themes */}
        <Section title="Genres & Themes">
          <View className="flex-row flex-wrap">
            {anime.genres?.map(g => (
              <Text
                key={g.mal_id}
                className="px-2 py-1 mr-2 mb-2 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold"
              >
                {g.name}
              </Text>
            ))}
            {anime.themes?.map(t => (
              <Text
                key={t.mal_id}
                className="px-2 py-1 mr-2 mb-2 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold"
              >
                {t.name}
              </Text>
            ))}
          </View>
        </Section>

        {/* Synopsis */}
        <Section title="Synopsis">
          <Text className="text-gray-800 text-base">
            {anime.synopsis ?? 'No synopsis available.'}
          </Text>
        </Section>

        {/* Background section (toggleable) */}
        <Section title="Background">
          <TouchableOpacity onPress={() => setShowBackground(!showBackground)}>
            <Text className="text-sm text-indigo-500">
              {showBackground ? 'Hide' : 'Show'} Background
            </Text>
          </TouchableOpacity>
          {showBackground && (
            <Animated.View entering={FadeInDown} exiting={FadeInUp}>
              <Text className="text-gray-700 mt-2">
                {anime.background ?? 'No background information.'}
              </Text>
            </Animated.View>
          )}
        </Section>

        <View className="h-8" />
      </Animated.ScrollView>
    </View>
  );
};

export default AnimeDetailScreen;
