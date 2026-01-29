import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface TypingIndicatorProps {
  name: string;
}

export default function TypingIndicator({ name }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => animateDots());
    };

    animateDots();
  }, [dot1, dot2, dot3]);

  const dotStyle = (animValue: Animated.Value) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} is typing</Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, dotStyle(dot1)]} />
        <Animated.View style={[styles.dot, dotStyle(dot2)]} />
        <Animated.View style={[styles.dot, dotStyle(dot3)]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
  },
  text: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    marginLeft: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 2,
  },
});
