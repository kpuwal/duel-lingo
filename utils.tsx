export interface Word_prev {
  foreign: string;
  translation: string;
}
export interface Word {
  dutch: string;
  english: string;
}

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

export async function loadWords(): Promise<Word[]> {
  try {
    const words: Word[] = require('./assets/words2.json');
    return words.filter(word => word.dutch && word.english);
  } catch (error) {
    console.error('Error loading JSON:', error);
    return [];
  }
}