import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { score: scoreParam, total: totalParam } = useLocalSearchParams<{ score: string; total: string }>();
  const score = parseInt(scoreParam || '0', 10);
  const total = parseInt(totalParam || '0', 10);
  const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.score}>Score: {score}/{total} ({percentage}%)</Text>
      <Button title="Play Again" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  score: { fontSize: 18, marginBottom: 20 },
});