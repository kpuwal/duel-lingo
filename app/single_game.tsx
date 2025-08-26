import { AnimatedWord } from "@/components/animated_word";
import { loadWords, shuffleArray, Word } from "@/utils";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

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

export default function SingleGame() {
  const emptyRound: Data = { dutchWords: [], englishWords: [], correctPairs: [] };
  const [roundData, setRoundData] = useState<Data>(emptyRound);
  const [selectedWords, setSelectedWords] = useState<{ dutch: string | null; english: string | null }>({
    dutch: null,
    english: null,
  });

  useEffect(() => {
    (async () => {
      const words = await loadWords();
      const pool = shuffleArray(words).slice(0, 6);
      setRoundData(sortWords(pool));
    })();
  }, []);

  function sortWords(pairs: Word[]): Data {
    return {
      dutchWords: pairs.map((w) => ({ id: w.dutch, word: w.dutch, isDisabled: false })),
      englishWords: pairs.map((w) => ({ id: w.english, word: w.english, isDisabled: false })),
      correctPairs: pairs,
    };
  }

  const handleCorrectMatch = (dutch: string, english: string) =>
    roundData.correctPairs.some((p) => p.dutch === dutch && p.english === english);

  const handleDutchPress = (id: string) => {
    if (selectedWords.english) {
      const dutchWord = id;
      const englishWord = selectedWords.english;
      if (handleCorrectMatch(dutchWord, englishWord)) {
        setRoundData((prev) => ({
          ...prev,
          dutchWords: prev.dutchWords.map((w) => (w.id === dutchWord ? { ...w, isDisabled: true } : w)),
          englishWords: prev.englishWords.map((w) =>
            w.id === englishWord ? { ...w, isDisabled: true } : w
          ),
          correctPairs: prev.correctPairs,
        }));
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
        setRoundData((prev) => ({
          ...prev,
          dutchWords: prev.dutchWords.map((w) => (w.id === dutchWord ? { ...w, isDisabled: true } : w)),
          englishWords: prev.englishWords.map((w) =>
            w.id === englishWord ? { ...w, isDisabled: true } : w
          ),
          correctPairs: prev.correctPairs,
        }));
      }
      setSelectedWords({ dutch: null, english: null });
    } else {
      setSelectedWords({ dutch: null, english: id });
    }
  };

  return (
    <View style={styles.container}>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#161a1d" },
  columns: { flexDirection: "row", justifyContent: "space-around", flex: 1, width: "100%" },
  column: { flex: 1, justifyContent: "center" },
  item: {
    padding: 20,
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
  text: { color: "#adb5bd", fontSize: 20 },
});
