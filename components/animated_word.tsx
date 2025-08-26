import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
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
  }, [isDisabled]);

  useEffect(() => {
    if (isDisabled) {
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false, // color animations can't use native driver
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      borderAnim.setValue(0);
    }
  }, [isDisabled]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#343a40", "#20bf55"],
  });
  
  return (
    <Animated.View style={[{ opacity }]}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled}>
        <Animated.View style={[buttonStyle, {borderWidth: 2, borderColor}]}>
            <Text style={textStyle}>{word}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}
