import { shuffleArray, Word } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Data {
  dutchWords: {
    word: string,
    isDisabled: boolean
  }[];
  englishWords: {
    word: string,
    isDisabled: boolean
  }[];
  correctPairs: Word[];
}

export default function SlowGame() {
    const router = useRouter();
    const { words: wordsParam } = useLocalSearchParams<{ words: string }>();
    const poolWords = wordsParam ? JSON.parse(wordsParam as string) : [];
    const initialPool: Word[] = shuffleArray([...poolWords]).slice(0, 6);

    const [roundData, setRoundData] = useState<Data>(sortWords(initialPool.slice(0, 6)));

    const userInteraction = {
        selectedWords: useState<{ dutch: number | null; english: number | null }>({
        dutch: null,
        english: null,
        }),
        feedback: useState<'correct' | 'incorrect' | null>(null),
        secondColumn: useState<'foreign' | 'translation' | null>(null),
    };
    const [selectedWords, setSelectedWords] = userInteraction.selectedWords;

    // useEffect(() => {
    //     console.log('--- State Update ---');
    //     console.log('Selected Words:', {
    //     dutch: selectedWords.dutch !== null ? roundData.dutchWords[selectedWords.dutch] : null,
    //     english: selectedWords.english !== null ? roundData.englishWords[selectedWords.english] : null,
    //     });
    //     console.log("Is correct? ", isCorrect)
    //     // console.log('Round Data:', {
    //     // dutchWords: roundData.dutchWords,
    //     // englishWords: roundData.englishWords,
    //     // correctPairs: roundData.correctPairs,
    //     // });
    // }, [selectedWords, roundData, isCorrect]);

    function sortWords(pairs: Word[]): Data {
        return {
            dutchWords: shuffleArray(
                pairs.map(w => ({ word: w.dutch, isDisabled: false }))
            ),
            englishWords: shuffleArray(
                pairs.map(w => ({ word: w.english, isDisabled: false }))
            ),
            correctPairs: pairs,
            };
    }

    const handleCorrectMatch = (dutchIdx: number, englishIdx: number) => {

    }

    const handleDutchWordPress = (index: number) => {
        if (selectedWords.english !== null) {
            const selectedDutchWord = roundData.dutchWords[index].word;
            const selectedEnglishWord = roundData.englishWords[selectedWords.english].word;

            const isMatch = roundData.correctPairs.some(
            (pair) => pair.dutch === selectedDutchWord && pair.english === selectedEnglishWord
            );

            if (isMatch) {
            setRoundData((prev) => ({
                ...prev,
                dutchWords: prev.dutchWords.map((w, idx) =>
                idx === index ? { ...w, isDisabled: true } : w
                ),
                englishWords: prev.englishWords.map((w, idx) =>
                idx === selectedWords.english ? { ...w, isDisabled: true } : w
                ),
                correctPairs: prev.correctPairs,
            }));

            setSelectedWords({ dutch: null, english: null });
            }
        } else {
            setSelectedWords({ dutch: index, english: null });
        }
        };

    const handleEnglishWordPress = (index: number) => {
        if (selectedWords.dutch !== null) {

            const selectedDutchWord = roundData.dutchWords[selectedWords.dutch].word;
            const selectedEnglishWord = roundData.englishWords[index].word;

            const isMatch = roundData.correctPairs.some(
            (pair) => pair.dutch === selectedDutchWord && pair.english === selectedEnglishWord
            );

            if (isMatch) {
            setRoundData((prev) => ({
                ...prev,
                dutchWords: prev.dutchWords.map((w, idx) =>
                idx === selectedWords.dutch ? { ...w, isDisabled: true } : w
                ),
                englishWords: prev.englishWords.map((w, idx) =>
                idx === index ? { ...w, isDisabled: true } : w
                ),
                correctPairs: prev.correctPairs,
            }));

            setSelectedWords({ dutch: null, english: null });
            }
        } else {
            setSelectedWords({ dutch: null, english: index });
        }
        };

    return (
        <View style={styles.container}>
            <View style={styles.columns}>
                <View style={styles.column}>
                    {/* DUTCH */}
                    {roundData.dutchWords.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.item, item.isDisabled ? { backgroundColor: '#4CAF50' } : {}]}
                            onPress={() => handleDutchWordPress(idx)}
                            disabled={item.isDisabled}>
                                <Text style={styles.text}>{item.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.column}>
                    {roundData.englishWords.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.item, item.isDisabled ? { backgroundColor: '#4CAF50' } : {}]}
                            onPress={() => handleEnglishWordPress(idx)}
                            disabled={item.isDisabled}>
                                <Text style={styles.text}>{item.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: "#383942" },
    title: { fontSize: 24, marginBottom: 20 },
    error: { color: 'red', marginTop: 10 },
    columns: { flexDirection: 'row', justifyContent: 'space-around', flex: 1, width: '100%' },
    column: { flex: 1, justifyContent: 'center' },
    item: {
        padding: 15,
        borderWidth: 0,
        borderColor: '#000',
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#575764',
    },
    text: {color: "#e0e0e0", fontSize: 18}
});