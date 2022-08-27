import API from '../../api/api';
import {
  IGameWord,
  IUserWord,
  IUserWordOption,
  IWord,
} from '../../interfaces/interfaces';
import { createDefaultWord, generateIndex } from '../../utils/utils';
import WordList from '../../utils/testWord';
import userApi from '../../components/user/user';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import { SPRINT_WORDS_STATISTIC } from '../../utils/constants';

class GamesModel {
  private api?: API;

  constructor() {
    this.api = API.getInstance();
  }

  async updateUserWord(wordId: string, isRightAnswer: boolean) {
    const isUser = await userApi.isAuthenticated();
    console.log('model, isUser:', isUser);
    console.log('isRightAnswer: ', isRightAnswer);

    if (!isUser) return;

    const userWord: IUserWord | null = await userApi.getUserWord(wordId);
    console.log('1 userWord: ', userWord);
    if (!userWord) {
      const newUserWord = createDefaultWord(wordId);

      if (isRightAnswer) newUserWord.optional.sprint.rightAnswer += 1;
      else newUserWord.optional.sprint.wrongAnswer += 1;

      console.log('create newUserWord: ', newUserWord);

      await userApi.createUserWord(wordId, newUserWord);
      return;
    }
    console.log('2 userWord: ', userWord);
    if (isRightAnswer) userWord.optional.sprint.rightAnswer += 1;
    else userWord.optional.sprint.wrongAnswer += 1;

    await userApi.updateUserWord(wordId, userWord);

    console.log('model, userWord: ', userWord);
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
    return words.map(({ word, wordTranslate, id }, idx) => {
      const randomIndex =
        Math.random() > 0.5 ? idx : generateIndex(words.length);
      return {
        id,
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
