import React, { useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedIconProps {
  name: string;
  color: string;
  size: number;
  focused: boolean;
}

const AnimatedIcon = ({ name, color, size, focused }: AnimatedIconProps) => {
  const scaleY = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scaleY.value = withSequence(
        withTiming(0.6, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(1.2, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) }),
      );
    } else {
      scaleY.value = withTiming(1, { duration: 90 });
    }
  }, [focused, scaleY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: scaleY.value },
      { scaleX: 1.01 - (scaleY.value - 1) * 0.14 }, // tiny horizontal stretch as it squashes
    ],
    // Trick to squeeze from the top instead of the center
    alignSelf: 'center',
  }));

  return (
    <Animated.View style={[animatedStyle, { justifyContent: 'flex-start' }]}>
      <Feather name={name} color={color} size={size} />
    </Animated.View>
  );
};

export default AnimatedIcon;
