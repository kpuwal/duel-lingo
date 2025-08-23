import { ProgressBar } from '@/components/progress_bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { shuffleArray, Word } from '../utils';

interface RoundData {
  dutchWords: string[];
  englishWords: string[];
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
  const [matchedCount, setMatchedCount] = useState<number>(0);

  const [selectedDutch, setSelectedDutch] = useState<number | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [secondColumn, setSecondColumn] = useState<'foreign' | 'translation' | null>(null);

  // 🔵 Animated progress
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: matchedCount / 20,
      duration: 400,
      useNativeDriver: false, // width can't use native driver
    }).start();
  }, [matchedCount]);

  function makeRoundData(pairs: Word[]): RoundData {
    return {
      dutchWords: pairs.map(w => w.foreign),
      englishWords: shuffleArray(pairs.map(w => w.translation)),
      correctPairs: pairs,
    };
  }

  const handleCorrectMatch = (foreignIdx: number, transIdx: number) => {
    const matchedForeign = roundData.dutchWords[foreignIdx];
    const matchedTranslation = roundData.englishWords[transIdx];

    const newActive = activePairs.filter(
      w => !(w.foreign === matchedForeign && w.translation === matchedTranslation)
    );

    if (remaining.length > 0) {
      newActive.push(remaining[0]);
      setRemaining(prev => prev.slice(1));
    }

    setActivePairs(newActive);
    setMatchedCount(prev => prev + 1);

    if (newActive.length === 0 && remaining.length === 0) {
      router.push({
        pathname: '/results',
        params: { score: (score + 1).toString(), total: (total + 1).toString() },
      });
    } else {
      setRoundData(makeRoundData(newActive));
    }
  };

  const handleForeignPress = (index: number) => {
    if (selectedEnglish !== null) {
      const correct =
        roundData.correctPairs[index].translation ===
        roundData.englishWords[selectedEnglish];

      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('foreign');

      setTimeout(() => {
        if (correct) {
          handleCorrectMatch(index, selectedEnglish);
        }
        setFeedback(null);
        setSelectedDutch(null);
        setSelectedEnglish(null);
        setSecondColumn(null);
      }, 800);
    } else {
      setSelectedDutch(index);
      setSelectedEnglish(null);
    }
  };

  const handleTranslationPress = (index: number) => {
    if (selectedDutch !== null) {
      const correct =
        roundData.correctPairs[selectedDutch].translation ===
        roundData.englishWords[index];

      setScore(prev => prev + (correct ? 1 : 0));
      setTotal(prev => prev + 1);
      setFeedback(correct ? 'correct' : 'incorrect');
      setSecondColumn('translation');

      setTimeout(() => {
        if (correct) {
          handleCorrectMatch(selectedDutch, index);
        }
        setFeedback(null);
        setSelectedDutch(null);
        setSelectedEnglish(null);
        setSecondColumn(null);
      }, 800);
    } else {
      setSelectedEnglish(index);
      setSelectedDutch(null);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar progressAnim={progressAnim} matchedCount={matchedCount} />

      {/* Columns */}
      <View style={styles.columns}>
        {/* Foreign column */}
        <View style={styles.column}>
          {roundData.dutchWords.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedDutch === idx ? styles.selected : null,
                feedback === 'correct' && selectedDutch === idx ? styles.correct : null,
                feedback === 'correct' &&
                secondColumn === 'foreign' &&
                selectedEnglish !== null &&
                roundData.correctPairs[idx].translation ===
                  roundData.englishWords[selectedEnglish]
                  ? styles.correct
                  : null,
                feedback === 'incorrect' &&
                secondColumn === 'foreign' &&
                roundData.correctPairs[idx].translation !==
                  (selectedEnglish !== null
                    ? roundData.englishWords[selectedEnglish]
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

        {/* Translation column */}
        <View style={styles.column}>
          {roundData.englishWords.map((trans, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedEnglish === idx ? styles.selected : null,
                feedback === 'correct' && selectedEnglish === idx ? styles.correct : null,
                feedback === 'correct' &&
                secondColumn === 'translation' &&
                selectedDutch !== null &&
                roundData.correctPairs[selectedDutch].translation === trans
                  ? styles.correct
                  : null,
                feedback === 'incorrect' &&
                secondColumn === 'translation' &&
                roundData.correctPairs.find(w => w.translation === trans)?.foreign !==
                  (selectedDutch !== null
                    ? roundData.dutchWords[selectedDutch]
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
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold', color: '#000' },
  progressWrapper: { width: '90%', marginBottom: 20 },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#4CAF50' },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  scaleText: { fontSize: 12, color: '#000' },
  columns: { flexDirection: 'row', justifyContent: 'space-around', flex: 1, width: '100%' },
  column: { flex: 1, justifyContent: 'center' },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  selected: { backgroundColor: '#D3D3D3' },
  correct: { backgroundColor: '#90EE90' },
  incorrect: { backgroundColor: '#FF6347' },
  itemText: { fontSize: 18, color: '#000' },
});
