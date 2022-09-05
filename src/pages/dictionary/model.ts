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
      const wordsForAuthUser: (IAggregatedWord | IWord) [] = await this.getUserWords(
        words,
      );
      this.makeWordsforAuthUser(wordsForAuthUser);
    } else {
      this.makeWords(words);
    }
  }

  async getHardWords() {
    const aggregatedWords = await userApi.getUserAggregatedWordsFilter(
      encodeURIComponent(
        JSON.stringify({
          $and: [{ 'userWord.optional.hard': true }],
        }),
      ),
    );

    const hardWords: IAggregatedWord[] | [] = aggregatedWords
      ? aggregatedWords[0]?.paginatedResults
      : [];
    const hardWordsAddId = hardWords.map((word) => {
      const wordAddId = { ...word };
      wordAddId.id = word._id;
      return wordAddId;
    });
    this.makeWordsforAuthUser(hardWordsAddId);
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
      const wordInDictionary = new WordAuth(word);
      this.wordsForAuthUser.push(wordInDictionary);
    });
    if (this.onUpdateWordsAuth) this.onUpdateWordsAuth(this.wordsForAuthUser);
  }
}

export default DictionaryModel;
