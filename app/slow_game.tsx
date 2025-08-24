import { shuffleArray, Word } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Data {
  dutchWords: string[];
  englishWords: string[];
  correctPairs: Word[];
}

export default function SlowGame() {
    const router = useRouter();
    const { words: wordsParam } = useLocalSearchParams<{ words: string }>();
    const poolWords = wordsParam ? JSON.parse(wordsParam as string) : [];
    const initialPool: Word[] = shuffleArray([...poolWords]).slice(0, 6);

    const [roundData, setRoundData] = useState<Data>(sortWords(initialPool.slice(0, 6)));

    function sortWords(pairs: Word[]): Data {
        return {
            dutchWords: shuffleArray(pairs.map(w => w.dutch)),
            englishWords: pairs.map(w => w.english),
            correctPairs: pairs
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.columns}>
                <View style={styles.column}>
                    {roundData.dutchWords.map((word, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.item}
                            onPress={() => console.log("word: ", word)}>
                                <Text style={styles.text}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.column}>
                    {roundData.englishWords.map((word, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.item}
                            onPress={() => console.log("word: ", word)}>
                                <Text style={styles.text}>{word}</Text>
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