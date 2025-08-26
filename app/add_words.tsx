import { Word, addWord, defaultWords, loadWords } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddWords() {
  const [dutch, setDutch] = useState("");
  const [english, setEnglish] = useState("");
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    (async () => {
      const data = await loadWords();
      setWords(data);
    })();
  }, []);

  async function handleAdd() {
    if (!dutch.trim() || !english.trim()) return;

    const newWord: Word = { dutch: dutch.toLowerCase(), english: english.toLowerCase() };
    await addWord(newWord);

    const updated = await loadWords();
    setWords(updated);

    setDutch("");
    setEnglish("");
  }

  async function handleRemove(wordToRemove: Word) {
    const updated = words.filter(
      (w) => w.dutch !== wordToRemove.dutch || w.english !== wordToRemove.english
    );
    await AsyncStorage.setItem("words", JSON.stringify(updated));
    setWords(updated);
  }

  const isDefault = (word: Word) =>
    defaultWords.some((w) => w.dutch === word.dutch && w.english === word.english);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Dutch word"
        placeholderTextColor="#888"
        value={dutch}
        onChangeText={(text) => setDutch(text.toLowerCase())}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="English word"
        placeholderTextColor="#888"
        value={english}
        onChangeText={(text) => setEnglish(text.toLowerCase())}
        autoCapitalize="none"
      />

      {/* <Button title="Add Word" onPress={handleAdd} /> */}
      <TouchableOpacity onPress={handleAdd}>
        <View style={styles.button}>
            <Text style={styles.buttonText}>Add Words</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        style={{ marginTop: 20, width: "100%" }}
        contentContainerStyle={styles.listContainer}
        data={words}
        keyExtractor={(item) => item.dutch + item.english}
        renderItem={({ item }) => (
          <View style={styles.wordRow}>
            <Text style={styles.wordText}>
              {item.dutch} → {item.english}
            </Text>
            {
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            }
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#161a1d",
  },
  title: { color: "#adb5bd", fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 12,
    marginVertical: 6,
    width: "90%",
    color: "white",
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 50,
  },
  wordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e2125",
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    width: "100%",
  },
  wordText: {
    color: "#e0e0e0",
    fontSize: 18,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  button: { 
    width: 150, 
    backgroundColor: "#161a1d", padding: 5, margin: 5, borderRadius: 10, borderColor: "#093FB4", borderWidth: 1
  },
  buttonText: { color: "#093FB4", fontSize: 18, textAlign: "center", fontWeight: "bold" },
});
