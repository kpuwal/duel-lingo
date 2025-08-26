import { Word, addWord, loadWords } from "@/utils"; // adjust path
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

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

    const newWord: Word = { dutch, english };
    await addWord(newWord);

    // reload after adding
    const updated = await loadWords();
    setWords(updated);

    setDutch("");
    setEnglish("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new pair of Words:</Text>

      <TextInput
        style={styles.input}
        placeholder="Dutch word"
        placeholderTextColor="#888"
        value={dutch}
        onChangeText={setDutch}
      />
      <TextInput
        style={styles.input}
        placeholder="English word"
        placeholderTextColor="#888"
        value={english}
        onChangeText={setEnglish}
      />

      <Button title="Add Word" onPress={handleAdd} />

      <FlatList
        style={{ marginTop: 20 }}
        data={words}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={{ color: "white" }}>
            {item.dutch} → {item.english}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#161a1d",
  },
  title: { color: "#adb5bd", fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 10,
    marginVertical: 5,
    width: 200,
    color: "white",
    borderRadius: 5,
  },
});
