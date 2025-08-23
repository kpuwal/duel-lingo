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

  // 🎲 pick 20 random words once
  const initialPool: Word[] = shuffleArray([...words]).slice(0, 20);

  const [remaining, setRemaining] = useState<Word[]>(initialPool.slice(6));
  const [activePairs, setActivePairs] = useState<Word[]>(initialPool.slice(0, 6));
  const [roundData, setRoundData] = useState<RoundData>(makeRoundData(initialPool.slice(0, 6)));

  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0); // ✅ progress tracker
  const [selectedForeign, setSelectedForeign] = useState<number | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [secondColumn, setSecondColumn] = useState<'foreign' | 'translation' | null>(null);

  function makeRoundData(pairs: Word[]): RoundData {
    return {
      foreignWords: pairs.map(w => w.foreign),
      translations: shuffleArray(pairs.map(w => w.translation)),
      correctPairs: pairs,
    };
  }

  // 🟩 handle successful match
  const handleCorrectMatch = (foreignIdx: number, transIdx: number) => {
    const matchedForeign = roundData.foreignWords[foreignIdx];
    const matchedTranslation = roundData.translations[transIdx];

    const newActive = activePairs.filter(
      w => !(w.foreign === matchedForeign && w.translation === matchedTranslation)
    );

    // refill from pool if available
    if (remaining.length > 0) {
      newActive.push(remaining[0]);
      setRemaining(prev => prev.slice(1));
    }

    setActivePairs(newActive);
    setMatchedCount(prev => prev + 1); // ✅ increment progress

    if (newActive.length === 0 && remaining.length === 0) {
      // game finished
      router.push({
        pathname: '/results',
        params: { score: (score + 1).toString(), total: (total + 1).toString() },
      });
    } else {
      setRoundData(makeRoundData(newActive));
    }
  };

  const handleForeignPress = (index: number) => {
    if (selectedTranslation !== null) {
      const correct =
        roundData.correctPairs[index].translation ===
        roundData.translations[selectedTranslation];

      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('foreign');

      setTimeout(() => {
        if (correct) {
          handleCorrectMatch(index, selectedTranslation);
        }
        setFeedback(null);
        setSelectedForeign(null);
        setSelectedTranslation(null);
        setSecondColumn(null);
      }, 800);
    } else {
      setSelectedForeign(index);
      setSelectedTranslation(null);
    }
  };

  const handleTranslationPress = (index: number) => {
    if (selectedForeign !== null) {
      const correct =
        roundData.correctPairs[selectedForeign].translation ===
        roundData.translations[index];

      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('translation');

      setTimeout(() => {
        if (correct) {
          handleCorrectMatch(selectedForeign, index);
        }
        setFeedback(null);
        setSelectedForeign(null);
        setSelectedTranslation(null);
        setSecondColumn(null);
      }, 800);
    } else {
      setSelectedTranslation(index);
      setSelectedForeign(null);
    }
  };

  // 🔵 calculate progress %
  const progress = matchedCount / 20;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Match</Text>
      <Text style={styles.score}>Score: {score}/{total}</Text>
      <Text style={styles.progressText}>Matched: {matchedCount}/20</Text>

      {/* ✅ Progress bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.columns}>
        {/* Foreign words */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Spanish</Text>
          {roundData.foreignWords.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedForeign === idx ? styles.selected : null,
                feedback === 'correct' && selectedForeign === idx ? styles.correct : null,
                feedback === 'correct' &&
                secondColumn === 'foreign' &&
                selectedTranslation !== null &&
                roundData.correctPairs[idx].translation ===
                  roundData.translations[selectedTranslation]
                  ? styles.correct
                  : null,
                feedback === 'incorrect' &&
                secondColumn === 'foreign' &&
                roundData.correctPairs[idx].translation !==
                  (selectedTranslation !== null
                    ? roundData.translations[selectedTranslation]
                    : null)
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

        {/* Translations */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>English</Text>
          {roundData.translations.map((trans, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedTranslation === idx ? styles.selected : null,
                feedback === 'correct' && selectedTranslation === idx ? styles.correct : null,
                feedback === 'correct' &&
                secondColumn === 'translation' &&
                selectedForeign !== null &&
                roundData.correctPairs[selectedForeign].translation === trans
                  ? styles.correct
                  : null,
                feedback === 'incorrect' &&
                secondColumn === 'translation' &&
                roundData.correctPairs.find(w => w.translation === trans)?.foreign !==
                  (selectedForeign !== null
                    ? roundData.foreignWords[selectedForeign]
                    : null)
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
    marginBottom: 5,
    color: '#000000',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
    fontWeight: '500',
  },
  progressBarBackground: {
    width: '90%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50', // green fill
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
    backgroundColor: '#90EE90',
  },
  incorrect: {
    backgroundColor: '#FF6347',
  },
  itemText: {
    color: '#000000',
    fontSize: 16,
  },
});
