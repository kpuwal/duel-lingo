import { AnimatedWord } from "@/components/animated_word";
import { ProgressBar } from "@/components/progress_bar";
import { loadWords, shuffleArray, Word } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface AnimatedWordData {
  id: string;
  word: string;
  isDisabled: boolean;
}

interface Data {
  dutchWords: AnimatedWordData[];
  englishWords: AnimatedWordData[];
  correctPairs: Word[];
}

export default function MultiRoundGame() {
  const router = useRouter();
  const emptyRound: Data = { dutchWords: [], englishWords: [], correctPairs: [] };
  const [roundData, setRoundData] = useState<Data>(emptyRound);
  const [selectedWords, setSelectedWords] = useState<{ dutch: string | null; english: string | null }>({
    dutch: null,
    english: null,
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);

  const [mistakes, setMistakes] = useState(0);
  
  const params = useLocalSearchParams<{ rounds: string }>();
  const totalRounds = params.rounds ? parseInt(params.rounds, 10) : 1;

  const progressAnim = useRef(new Animated.Value(0)).current;

  const loadRound = async () => {
    const words = await loadWords();
    const pool = shuffleArray(words).slice(0, 6);
    setRoundData(sortWords(pool));
    setMatchedCount(0);
    progressAnim.setValue(0);
  };

  useEffect(() => {
    loadRound();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: matchedCount / 6,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [matchedCount]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        router.dismissAll();
        router.replace("/");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  function sortWords(pairs: Word[]): Data {
    return {
      dutchWords: shuffleArray(pairs.map((w) => ({ id: w.dutch, word: w.dutch, isDisabled: false }))),
      englishWords: shuffleArray(pairs.map((w) => ({ id: w.english, word: w.english, isDisabled: false }))),
      correctPairs: pairs,
    };
  }

  const handleCorrectMatch = (dutch: string, english: string) =>
    roundData.correctPairs.some((p) => p.dutch === dutch && p.english === english);

  const checkRoundComplete = (updated: Data) => {
    const allDisabled =
      updated.dutchWords.every((w) => w.isDisabled) &&
      updated.englishWords.every((w) => w.isDisabled);

    if (allDisabled) {
      if (currentRound < totalRounds) {
        setCurrentRound((r) => r + 1);
        loadRound();
      } else {
        setGameOver(true);
      }
    }
  };

  const handleDutchPress = (id: string) => {
    if (selectedWords.english) {
      const dutchWord = id;
      const englishWord = selectedWords.english;
      if (handleCorrectMatch(dutchWord, englishWord)) {
        const updated = {
          ...roundData,
          dutchWords: roundData.dutchWords.map((w) =>
            w.id === dutchWord ? { ...w, isDisabled: true } : w
          ),
          englishWords: roundData.englishWords.map((w) =>
            w.id === englishWord ? { ...w, isDisabled: true } : w
          ),
        };
        setRoundData(updated);
        setMatchedCount((prev) => prev + 1);
        checkRoundComplete(updated);
      } else {
        setMistakes((prev) => prev + 1);
      }
      setSelectedWords({ dutch: null, english: null });
    } else {
      setSelectedWords({ dutch: id, english: null });
    }
  };

  const handleEnglishPress = (id: string) => {
    if (selectedWords.dutch) {
      const dutchWord = selectedWords.dutch;
      const englishWord = id;
      if (handleCorrectMatch(dutchWord, englishWord)) {
        const updated = {
          ...roundData,
          dutchWords: roundData.dutchWords.map((w) =>
            w.id === dutchWord ? { ...w, isDisabled: true } : w
          ),
          englishWords: roundData.englishWords.map((w) =>
            w.id === englishWord ? { ...w, isDisabled: true } : w
          ),
        };
        setRoundData(updated);
        setMatchedCount((prev) => prev + 1);
        checkRoundComplete(updated);
      } else {
        setMistakes((prev) => prev + 1);
      }
      setSelectedWords({ dutch: null, english: null });
    } else {
      setSelectedWords({ dutch: null, english: id });
    }
  };

  const mistakesStyle = () => {
    return (
      <Text style={{color: "#A4DD00", fontWeight: "bold"}}>{mistakes}</Text>
    )
  }

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverText}>Game Over!</Text>
        <Text style={[styles.text, { color: 'red', marginTop: 10 }]}>
        Mistakes: <Text style={styles.mistakesText}>{mistakes}</Text>
      </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { marginBottom: 10 }]}>Round {currentRound} / {totalRounds}</Text>

      <ProgressBar progressAnim={progressAnim} matchedCount={matchedCount} />

      <View style={styles.columns}>
        <View style={styles.column}>
          {roundData.dutchWords.map((item) => (
            <AnimatedWord
              key={item.id}
              word={item.word}
              isDisabled={item.isDisabled}
              onPress={() => handleDutchPress(item.id)}
              buttonStyle={[styles.item, item.isDisabled && styles.disabledItem]}
              textStyle={styles.text}
            />
          ))}
        </View>
        <View style={styles.column}>
          {roundData.englishWords.map((item) => (
            <AnimatedWord
              key={item.id}
              word={item.word}
              isDisabled={item.isDisabled}
              onPress={() => handleEnglishPress(item.id)}
              buttonStyle={[styles.item, item.isDisabled && styles.disabledItem]}
              textStyle={styles.text}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 15, backgroundColor: "#161a1d" },
  columns: { flexDirection: "row", justifyContent: "space-around", flex: 1, width: "100%" },
  column: { flex: 1, justifyContent: "center" },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#495057",
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#161a1d",
  },
  disabledItem: {
    backgroundColor: "#343a40",
  },
  text: { color: "#adb5bd", fontSize: 20, textAlign: "center", flexShrink: 1 },
  gameOverText: { color: "#adb5bd", fontSize: 28, paddingBottom: 15, fontWeight: "bold" },
  mistakesText: {
    color: '#A4DD00',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
