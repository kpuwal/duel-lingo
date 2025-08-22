export interface Word {
  foreign: string;
  translation: string;
}

export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export async function loadWords(): Promise<Word[]> {
  try {
    const words: Word[] = require('./assets/words.json');
    return words.filter(word => word.foreign && word.translation);
  } catch (error) {
    console.error('Error loading JSON:', error);
    return [];
  }
}