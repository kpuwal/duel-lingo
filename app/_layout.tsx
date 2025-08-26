import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Dutch Duo' }} />
        {/* <Stack.Screen name="game" options={{ title: 'Round' }} /> */}
        <Stack.Screen name="results" options={{ title: 'Results' }} />
        <Stack.Screen name="single_game" options={{ title: 'Single Game' }} />
        <Stack.Screen name="add_words" options={{ title: 'Add Words' }} />
        <Stack.Screen name="multi_round" options={{ title: 'Multi Round Game' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}