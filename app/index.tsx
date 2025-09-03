import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadWords, Word } from '../utils';

export default function HomeScreen() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [rounds, setRounds] = useState(2);

  useEffect(() => {
    (async () => {
      const words = await loadWords();
      setWords(words);
    })();
  }, []);

  const incrementRounds = () => setRounds((prev) => Math.min(prev + 1, 10));
  const decrementRounds = () => setRounds((prev) => Math.max(prev - 1, 1));

  const printCorrectWord = (round: number) => {
    if (round === 1) {
      return <Text style={styles.roundsText}>{round} round</Text>;
    } else {
      return <Text style={styles.roundsText}>{round} rounds</Text>;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/duel05.jpeg')}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={decrementRounds} style={styles.counterButton}>
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          {printCorrectWord(rounds)}
          <TouchableOpacity onPress={incrementRounds} style={styles.counterButton}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/multi_round',
              params: { rounds },
            })
          }
          disabled={words.length < 6}
        >
          <View style={styles.button2}>
            <Text style={styles.buttonText2}>Start Game</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: '/add_words', params: { words: JSON.stringify(words) } })
          }
        >
          <View style={styles.button2}>
            <Text style={styles.buttonText2}>Manage Words</Text>
          </View>
        </TouchableOpacity>

        {words.length < 6 && <Text style={styles.error}>Need at least 6 words!</Text>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  counterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#A4DD00',
    borderRadius: 10,
  },
  counterText: {
    color: '#A4DD00',
    fontSize: 20,
  },
  roundsText: {
    width: 70,
    color: '#A4DD00',
    fontSize: 20,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  button: {
    width: 200,
    // backgroundColor: '#161a1d',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    borderColor: '#093FB4',
    borderWidth: 1,
  },
  buttonText: {
    color: '#093FB4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button2: {
    width: 200,
    // backgroundColor: '#161a1d',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    borderColor: '#A4DD00',
    borderWidth: 1,
  },
  buttonText2: {
    color: '#A4DD00',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});