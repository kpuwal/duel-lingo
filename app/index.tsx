import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { loadWords, Word } from '../utils';

export default function HomeScreen() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const loadedWords = await loadWords();
      setWords(loadedWords);
    };
    fetchWords();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Button
        title="Start Game"
        onPress={() => router.push({ pathname: '/game', params: { words: JSON.stringify(words) } })}
        disabled={words.length < 5}
      /> */}
      <Button
        title="Start Game"
        onPress={() => router.push({ pathname: '/slow_game', params: { words: JSON.stringify(words) } })}
        disabled={words.length < 5}
      />
      {words.length < 6 && <Text style={styles.error}>Need at least 5 words!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  error: { color: 'red', marginTop: 10 },
});