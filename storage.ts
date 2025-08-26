import AsyncStorage from "@react-native-async-storage/async-storage";
import { Word, defaultWords } from "./utils"; // adjust path if needed

const STORAGE_KEY = "words";

export async function loadWords(): Promise<Word[]> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWords));
      return defaultWords;
    }
  } catch (error) {
    console.error("Error loading words:", error);
    return defaultWords;
  }
}

export async function addWord(newWord: Word): Promise<void> {
  try {
    const words = await loadWords();
    const updated = [...words, newWord];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error adding word:", error);
  }
}

export async function clearWords(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing words:", error);
  }
}
