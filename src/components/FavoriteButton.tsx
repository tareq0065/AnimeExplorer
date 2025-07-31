import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
}

const FLYERS = [
  { dx: -14, dy: -24, angle: -25, color: '#f472b6' }, // left
  { dx: 0, dy: -28, angle: 0, color: '#fb7185' }, // center
  { dx: 14, dy: -22, angle: 25, color: '#fca5a5' }, // right
];

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  active,
  onToggle,
  size = 28,
}) => {
  const scale = useSharedValue(1);
  const flyers = useRef(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    FLYERS.map(() => ({ progress: useSharedValue(0) })),
  ).current;

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animateFlyers = () => {
    FLYERS.forEach((_, i) => {
      flyers[i].progress.value = 0;
      flyers[i].progress.value = withTiming(
        1,
        { duration: 480, easing: Easing.out(Easing.ease) },
        () => {
          flyers[i].progress.value = 0;
        },
      );
    });
  };

  const handlePress = () => {
    scale.value = withSpring(1.3, {}, () => {
      scale.value = withSpring(1);
    });
    animateFlyers();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="w-10 h-10 items-center justify-center">
        {FLYERS.map((flyer, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const flyerStyle = useAnimatedStyle(() => {
            const t = flyers[i].progress.value;
            return {
              position: 'absolute',
              opacity: t === 0 ? 0 : 1 - t,
              transform: [
                { translateX: flyer.dx * t },
                { translateY: flyer.dy * t },
                { scale: 0.6 + t * 1.2 },
                { rotate: `${flyer.angle * t}deg` },
              ],
            };
          });
          return (
            <Animated.View key={i} style={flyerStyle}>
              <Feather name="heart" size={16} color={flyer.color} />
            </Animated.View>
          );
        })}
        <Animated.View style={heartStyle}>
          <Feather
            name="heart"
            size={size}
            color={active ? '#fb7185' : '#d1d5db'}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FavoriteButton);
