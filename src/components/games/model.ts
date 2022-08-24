import API from '../api/api';
import { IGameWord, IWord } from '../interfaces';
import generateIndex from '../utils/utils';
import WordList from '../utils/testWord';

class GamesModel {
  private api?: API;

  constructor() {
    this.api = API.getInstance();
  }

  getWordsForGame = async (group: number) => {
    const wordList = await this.getWords(group);

    if (!wordList) return [];

    return this.formatWords(wordList);
  };

  private async getWords(group: number) {
    return (await this.api?.getWords(group, 1)) || WordList;
  }

  private formatWords(words: IWord[]): IGameWord[] {
    return words.map(({ word, wordTranslate }, idx) => {
      const randomIndex = Math.random() > 0.5 ? idx : generateIndex(words.length);
      return {
        word,
        wordTranslate,
        pseudoTranslate: words[randomIndex].wordTranslate,
      };
    });
  }

  // bindReadyWords(handler: (words: IGameWord[]) => void) {
  //   this.onReadyWordsHandler = handler;
  // }
}

export default GamesModel;
