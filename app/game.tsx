import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { shuffleArray, Word } from '../utils';

interface RoundData {
  foreignWords: string[];
  translations: string[];
  correctPairs: Word[];
}

export default function GameScreen() {
  const router = useRouter();
  const { words: wordsParam } = useLocalSearchParams<{ words: string }>();
  const words: Word[] = wordsParam ? JSON.parse(wordsParam) : [];
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [selectedForeign, setSelectedForeign] = useState<number | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [secondColumn, setSecondColumn] = useState<'foreign' | 'translation' | null>(null);
  const [roundData, setRoundData] = useState<RoundData>(getRoundWords(words));
  const rounds: number = 3;

  function getRoundWords(allWords: Word[], numPerRound: number = 6): RoundData {
    const shuffled: Word[] = shuffleArray<Word>([...allWords]);
    const selected: Word[] = shuffled.slice(0, numPerRound);
    const translations = shuffleArray<string>(selected.map((word: Word) => word.translation));
    return {
      foreignWords: selected.map((word: Word) => word.foreign), // Fixed order
      translations, // Shuffled
      correctPairs: selected,
    };
  }

  const handleForeignPress = (index: number) => {
    if (selectedTranslation !== null) {
      // If translation is selected, check match
      const correct = roundData.correctPairs[index].translation === roundData.translations[selectedTranslation];
      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('foreign');
      setTimeout(() => {
        setFeedback(null);
        setSelectedForeign(null);
        setSelectedTranslation(null);
        setSecondColumn(null);
      }, 1000);
    } else {
      // Select foreign word
      setSelectedForeign(index);
      setSelectedTranslation(null);
    }
  };

  const handleTranslationPress = (index: number) => {
    if (selectedForeign !== null) {
      // If foreign word is selected, check match
      const correct = roundData.correctPairs[selectedForeign].translation === roundData.translations[index];
      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('translation');
      setTimeout(() => {
        setFeedback(null);
        setSelectedForeign(null);
        setSelectedTranslation(null);
        setSecondColumn(null);
      }, 1000);
    } else {
      // Select translation
      setSelectedTranslation(index);
      setSelectedForeign(null);
    }
  };

  const nextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(prev => prev + 1);
      setRoundData(getRoundWords(words));
      setSelectedForeign(null);
      setSelectedTranslation(null);
      setFeedback(null);
      setSecondColumn(null);
    } else {
      router.push({ pathname: '/results', params: { score: score.toString(), total: total.toString() } });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round {currentRound}/{rounds}</Text>
      <Text style={styles.score}>Score: {score}/{total}</Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Spanish</Text>
          {roundData.foreignWords.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedForeign === idx ? styles.selected : null,

                // ✅ turn green if this is the chosen foreign in a correct match
                feedback === 'correct' && selectedForeign === idx ? styles.correct : null,

                // ✅ also turn green if this foreign is the correct match for a selected translation
                feedback === 'correct' &&
                secondColumn === 'foreign' &&
                selectedTranslation !== null &&
                roundData.correctPairs[idx].translation === roundData.translations[selectedTranslation]
                    ? styles.correct
                    : null,

                // ❌ don't mark main word red
                feedback === 'incorrect' &&
                secondColumn === 'foreign' &&
                roundData.correctPairs[idx].translation !==
                    (selectedTranslation !== null ? roundData.translations[selectedTranslation] : null)
                    ? styles.incorrect
                    : null,
                ]}


              onPress={() => handleForeignPress(idx)}
              disabled={feedback !== null}
            >
              <Text style={styles.itemText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>English</Text>
          {roundData.translations.map((trans, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedTranslation === idx ? styles.selected : null,

                // ✅ turn green if this is the chosen translation in a correct match
                feedback === 'correct' && selectedTranslation === idx ? styles.correct : null,

                // ✅ also turn green if this translation is the correct match for a selected foreign
                feedback === 'correct' &&
                secondColumn === 'translation' &&
                selectedForeign !== null &&
                roundData.correctPairs[selectedForeign].translation === trans
                    ? styles.correct
                    : null,

                // ❌ don't mark main word red
                feedback === 'incorrect' &&
                secondColumn === 'translation' &&
                roundData.correctPairs.find(w => w.translation === trans)?.foreign !==
                    (selectedForeign !== null ? roundData.foreignWords[selectedForeign] : null)
                    ? styles.incorrect
                    : null,
                ]}


              onPress={() => handleTranslationPress(idx)}
              disabled={feedback !== null}
            >
              <Text style={styles.itemText}>{trans}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={nextRound} disabled={feedback !== null}>
        <Text style={styles.buttonText}>Next Round</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000000',
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    width: '100%',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  selected: {
    backgroundColor: '#D3D3D3',
  },
  correct: {
    backgroundColor: '#90EE90', // Green
  },
  incorrect: {
    backgroundColor: '#FF6347', // Red
  },
  itemText: {
    color: '#000000',
    fontSize: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});