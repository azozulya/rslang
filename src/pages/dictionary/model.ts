/* eslint-disable no-underscore-dangle */
import Api from '../../api/api';
import {
  IAggregatedWord,
  IWord,
  IWordApp,
  IWordAppForAuthUser,
} from '../../interfaces/interfaces';
import Word from '../../components/word/word';
import WordAuth from '../../components/word/wordAuth';
import userApi from '../../components/user/user';
import { WORDS_PER_PAGE } from '../../utils/constants';

class DictionaryModel {
  words: IWordApp[];

  wordsForAuthUser: IWordAppForAuthUser[];

  api: Api;

  onUpdateWords?: (words: IWordApp[]) => void;

  onUpdateWordsAuth?: (words:(IWordAppForAuthUser | IWordApp)[]) => void;

  constructor() {
    this.words = [];
    this.wordsForAuthUser = [];
    this.api = Api.getInstance();
  }

  bindUpdateWords(callback: (words: IWordApp[]) => void) {
    this.onUpdateWords = callback;
  }

  bindUpdateWordsAuth(callback: (words: (IWordAppForAuthUser | IWordApp)[]) => void) {
    this.onUpdateWordsAuth = callback;
  }

  async getWords(group: number, page: number, auth = false) {
    const words = await this.api.getWords(group, page);
    if (!words) throw new Error('Not found words');
    if (auth) {
      // const wordsForAuthUser: (IAggregatedWord | IWord) [] = await this.getUserWords(
      const aggregatedWords: (IAggregatedWord) [] = await this.getAgreggatedWords(group, page);
      const wordsForAuthUser:
      (IWord | IAggregatedWord)[] = this.collectWords(aggregatedWords, words);
      console.log('words aggregated', wordsForAuthUser);
      this.makeWordsforAuthUser(wordsForAuthUser);
    } else {
      this.makeWords(words);
    }
  }

  async getHardWords(auth = false) {
    const userWords = await userApi.getUserWords();
    if (userWords) {
      const hardWords = userWords.filter((word) => word.optional?.hard === true);
      const words: Promise<IWord | undefined>[] = [];
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
        const wordsForAuthUser: (IWord | IAggregatedWord)[] = await this.getUserWords(
          fullWords,
        );
        this.makeWordsforAuthUser(wordsForAuthUser);
      } else {
        this.makeWords(fullWords);
      }
    }
  }

  private async getAgreggatedWords(
    group: number,
    page: number,
  ): Promise<IAggregatedWord[]> {
    const aggregatedWords = await userApi.getUserAggregatedWords(
      group,
      page,
      WORDS_PER_PAGE,
      encodeURIComponent(
        JSON.stringify({
          $and: [{ page }],
        }),
      ),
    );
    const userWords: IAggregatedWord[] | [] = aggregatedWords
      ? aggregatedWords[0]?.paginatedResults
      : [];
    return userWords;
  }

  collectWords(aggregatedWords: IAggregatedWord[], words: IWord[]) {
    const resultWords: (IWord | IAggregatedWord) [] = [];
    words.forEach((word) => {
      const wordIndex = aggregatedWords
        .findIndex((aggregatedWord) => word.id === aggregatedWord._id);
      if (wordIndex >= 0) resultWords.push(aggregatedWords[wordIndex]);
      else resultWords.push(word);
    });
    return resultWords;
  }

  private async getUserWords(words: (IWord | undefined)[]) {
    const wordsForAuthUser: (IAggregatedWord | IWord)[] = [];
    const userWords = await userApi.getUserWords();
    if (!userWords) throw new Error('Not found saved user words');
    words.forEach((word) => {
      if (word) {
        const found = userWords.find((userWord) => word.id === userWord.wordId);
        if (found) {
          const wordAuth: IAggregatedWord = {
            ...word,
            _id: found.wordId,
            userWord: {
              difficulty: found.difficulty,
              optional: found.optional,
            },
          };
          wordsForAuthUser.push(wordAuth);
        } else {
          wordsForAuthUser.push(word);
        }
      }
    });

    return wordsForAuthUser;
  }

  private async makeWords(words: Array<IWord | undefined>) {
    this.words = [];
    words.forEach((word) => {
      if (word) {
        const wordInDictionary = new Word(word);
        this.words.push(wordInDictionary);
      }
    });
    if (this.onUpdateWords) this.onUpdateWords(this.words);
  }

  private async makeWordsforAuthUser(words: Array<IAggregatedWord | IWord>) {
    this.wordsForAuthUser = [];
    words.forEach((word) => {
      console.log('meke word', word);
      const wordInDictionary = new WordAuth(word);
      this.wordsForAuthUser.push(wordInDictionary);
    });
    if (this.onUpdateWordsAuth) this.onUpdateWordsAuth(this.wordsForAuthUser);
  }
}

export default DictionaryModel;
