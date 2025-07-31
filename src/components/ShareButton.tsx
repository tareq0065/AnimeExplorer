import React from 'react';
import { TouchableOpacity, Text, Share, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface ShareButtonProps {
  anime: { mal_id: number; title: string; animeUrl?: string };
}

const ShareButton: React.FC<ShareButtonProps> = ({ anime }) => {
  const handleShare = () => {
    // Generate your app deep link as well
    const deepLink = `animeexplorer://anime/${anime.mal_id}`;

    // Example: Share *both* links in the message, or pick one (uncomment as needed)
    // To share only the web link, use animeUrl; for only deep link, use deepLink.
    Share.share({
      title: anime.title,
      message: `${anime.title}\n\nCheck it out on MyAnimeList:\n${anime.animeUrl}\n\nOr open in app:\n${deepLink}`,
      url: anime.animeUrl,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      className="flex-row items-center self-center"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Feather name="share-2" size={20} color="#4f46e5" />
        <Text className="ml-2 text-indigo-600 font-medium text-base">
          Share
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShareButton;
