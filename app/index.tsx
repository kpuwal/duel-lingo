import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadWords, Word } from '../utils';

export default function HomeScreen() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
      (async () => {
        const words = await loadWords();
        setWords(words)
      })();
    }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/owl.png")}
        style={{ width: 150, height: 200, borderRadius: 10 }}/>
      <TouchableOpacity onPress={() => router.push({ pathname: '/add_words', params: { words: JSON.stringify(words) } })}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Add New Words</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: '/single_game', params: { words: JSON.stringify(words) } })} disabled={words.length < 6}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Start Single Game</Text>
        </View>
      </TouchableOpacity>
      {words.length < 6 && <Text style={styles.error}>Need at least 6 words!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: "#161a1d" },
  title: { fontSize: 24, marginBottom: 20 },
  button: { width: 200, backgroundColor: "#161a1d", padding: 20, margin: 5, borderRadius: 10, borderColor: "#495057", borderWidth: 1 },
  buttonText: { color: "#adb5bd", fontSize: 15, fontWeight: "bold", textAlign: "center"},
  error: { color: 'red', marginTop: 10 },
});