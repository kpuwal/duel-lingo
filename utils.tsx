import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Word {
  dutch: string;
  english: string;
}

export const defaultWords: Word[] = [
  { dutch: "opbouwend", english: "constructive" },
  { dutch: "toestemming", english: "permission" },
  { dutch: "feit", english: "fact" },
  { dutch: "beoordelen", english: "judge" },
  { dutch: "opmerking", english: "comment" },
  { dutch: "oordeel", english: "judgement" },
  { dutch: "onredelijk", english: "unreasonable" },
  { dutch: "houding", english: "position" },
  { dutch: "overtuigen", english: "convince" },
  { dutch: "gelijk", english: "right" },
  { dutch: "eerlijk", english: "honest" },
];


// export function shuffleArray<T>(array: T[]): T[] {
//   return [...array].sort(() => Math.random() - 0.5);
// }
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// export async function loadWords(): Promise<Word[]> {
//   try {
//     const words: Word[] = require('./assets/words2.json');
//     return words.filter(word => word.dutch && word.english);
//   } catch (error) {
//     console.error('Error loading JSON:', error);
//     return [];
//   }
// }


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
