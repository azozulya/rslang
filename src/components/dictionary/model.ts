import Api from '../api/api';
import { IWord, IWordApp } from '../interfaces';
import Word from '../word/word';

class DictionaryModel {
  words: IWordApp[];

  api: Api;

  constructor() {
    this.words = [];
    this.api = Api.getInstance();
  }

  bindUpdateWords(callback: (words: IWordApp[]) => void) {
    this.onUpdateWords = callback;
  }

  async getWords(group:number, page:number) {
    const words = await this.api.getWords(group, page);
    this.makeWords(words);
  }

  async getHardWords() {
    const words: Promise<IWord>[] = [];
    const hardWords = await this.api.getUserWords();
    // eslint-disable-next-line no-restricted-syntax
    for (const userHardWord of hardWords) {
      const { wordId } = userHardWord;
      if (wordId) {
        const wordInDictionary = this.api.getWord(wordId);
        words.push(wordInDictionary);
      }
    }
    const fullWords = await Promise.all(words);
    this.makeWords(fullWords);
  }

  makeWords(words: Array<IWord>) {
    this.words = [];
    words.forEach((word) => {
      const wordInDictionary = new Word(word);
      this.words.push(wordInDictionary);
    });
    this.onUpdateWords(this.words);
  }
}

export default DictionaryModel;
