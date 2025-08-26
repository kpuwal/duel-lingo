import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface AnimatedWordProps {
  word: string;
  isDisabled: boolean;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AnimatedWord({
  word,
  isDisabled,
  onPress,
  buttonStyle,
  textStyle,
}: AnimatedWordProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isDisabled ? 0.3 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (isDisabled) {
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 2000, // 2s green border
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isDisabled]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#495057", "#20bf55"],
  });

  return (
    <Animated.View style={[buttonStyle, { opacity, borderWidth: 2, borderColor }]}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled}>
        <Text style={textStyle}>{word}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
