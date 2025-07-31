import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FavoriteButton from './FavoriteButton.tsx';

interface AnimeCardProps {
  anime: any;
  favorited: boolean;
  onFavorite: () => void;
  index?: number;
}

const AnimeCard = ({
  anime,
  favorited,
  onFavorite,
  index = 0,
}: AnimeCardProps) => {
  const navigation = useNavigation();

  return (
    <Animated.View
      className="mb-3"
      entering={FadeInDown.duration(400).delay(index * 80)}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AnimeDetail' as never, { anime } as never)
        }
        activeOpacity={0.8}
      >
        <View className="flex-row items-center bg-white rounded-xl mx-3 p-3 shadow-md">
          <Image
            source={{ uri: anime.images.jpg.image_url }}
            className="w-[70px] h-[100px] rounded-lg mr-3"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-base font-bold text-black">
              {anime.title}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Score: {anime.score || '--'}
            </Text>
          </View>
          <FavoriteButton active={favorited} onToggle={onFavorite} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(AnimeCard);
