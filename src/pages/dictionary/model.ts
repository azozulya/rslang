import Api from '../../api/api';
import {
  IWord,
  IWordApp,
  IWordAppForAuthUser,
  IWordWithUserWord,
} from '../../interfaces/interfaces';
import Word from '../../components/word/word';
import WordAuth from '../../components/word/wordAuth';

class DictionaryModel {
  words: IWordApp[];

  wordsForAuthUser: IWordAppForAuthUser[];

  api: Api;

  onUpdateWords?: (words: IWordApp[]) => void;

  onUpdateWordsAuth?: (words:IWordAppForAuthUser[]) => void;

  constructor() {
    this.words = [];
    this.wordsForAuthUser = [];
    this.api = Api.getInstance();
  }

  bindUpdateWords(callback: (words: IWordApp[]) => void) {
    this.onUpdateWords = callback;
  }

  bindUpdateWordsAuth(callback: (words: IWordAppForAuthUser[]) => void) {
    this.onUpdateWordsAuth = callback;
  }

  async getWords(group: number, page: number, auth = false) {
    const words = await this.api.getWords(group, page);
    if (auth) {
      const wordsForAuthUser: IWordWithUserWord[] = await this.getUserWords(
        words,
      );
      this.makeWordsforAuthUser(wordsForAuthUser);
    } else {
      this.makeWords(words);
    }
  }

  async getHardWords(auth = false) {
    const userWords = await this.api.getUserWords();
    const hardWords = userWords.filter((word) => word.optional?.hard === true);
    const words: Promise<IWord>[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const userHardWord of hardWords) {
      const { wordId } = userHardWord;
      if (wordId) {
        const wordInDictionary = this.api.getWord(wordId);
        words.push(wordInDictionary);
      }
    }
    const fullWords = await Promise.all(words);

    if (auth) {
      const wordsForAuthUser: IWordWithUserWord[] = await this.getUserWords(
        fullWords,
      );
      this.makeWordsforAuthUser(wordsForAuthUser);
    } else {
      this.makeWords(fullWords);
    }
  }

  async getUserWords(words: IWord[]) {
    const wordsForAuthUser: IWordWithUserWord[] = [];
    const userWords = await this.api.getUserWords();
    words.forEach((word) => {
      const found = userWords.find((userWord) => word.id === userWord.wordId);
      if (found) {
        const wordAuth: IWordWithUserWord = { ...word };
        wordAuth.optional = found.optional;
        wordsForAuthUser.push(wordAuth);
      } else {
        wordsForAuthUser.push(word);
      }
    });

    return wordsForAuthUser;
  }

  async makeWords(words: Array<IWord>) {
    this.words = [];
    words.forEach((word) => {
      const wordInDictionary = new Word(word);
      this.words.push(wordInDictionary);
    });
    if (this.onUpdateWords) this.onUpdateWords(this.words);
  }

  async makeWordsforAuthUser(words: Array<IWordWithUserWord>) {
    this.wordsForAuthUser = [];
    words.forEach((word) => {
      const wordInDictionary = new WordAuth(word);
      this.wordsForAuthUser.push(wordInDictionary);
    });
    if (this.onUpdateWordsAuth) this.onUpdateWordsAuth(this.wordsForAuthUser);
  }
}

export default DictionaryModel;
