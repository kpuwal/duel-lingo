import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
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

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isDisabled ? 0.3 : 1,
      duration: 500,
      useNativeDriver: true, // safe for opacity
    }).start();
  }, [isDisabled]);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled}>
        <View style={buttonStyle}>
          <Text style={textStyle}>{word}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
