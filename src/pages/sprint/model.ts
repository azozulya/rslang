/* eslint-disable max-lines-per-function */
import API from '../../api/api';
import {
  IAggregatedWord,
  IGameWord,
  IUserWord,
  IWord,
} from '../../interfaces/interfaces';
import {
  createDefaultWord,
  generateIndex,
  getDateWithoutTime,
  isFromDictionaryPage,
} from '../../utils/utils';
import userApi from '../../components/user/user';
import {
  POINTS_TO_LEARNED_HARD_WORD,
  POINTS_TO_LEARNED_WORD,
  SPRINT_WORDS_STATISTIC,
  WORDS_PER_PAGE,
} from '../../utils/constants';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';

interface IWordStat {
  [x: number]: {
    wordID: string;
    learned: boolean;
    new: boolean;
    rightAnswer: boolean;
  };
}

class GamesModel {
  private api?: API;

  isMenuLink = true;

  private gameState = {
    learnedWords: 0,
    newWords: 0,
  };

  constructor() {
    this.api = API.getInstance();
  }

  getGameStatistic = () => {
    console.log('model, getGameStatistic:  ', this.gameState);
    return this.gameState;
  };

  resetGameStatistic() {
    this.gameState = {
      learnedWords: 0,
      newWords: 0,
    };
  }

  private async updateStatisctic(wordStat: IWordStat) {
    // await this.sendStatistic(wordStat);

    const storageObj = getLocalStorage<IWordStat[]>(SPRINT_WORDS_STATISTIC);

    if (!storageObj) {
      setLocalStorage(SPRINT_WORDS_STATISTIC, wordStat);
      return;
    }

    setLocalStorage(SPRINT_WORDS_STATISTIC, [...storageObj, wordStat]);
  }

  updateUserWord = async (wordId: string, isRightAnswer: boolean) => {
    const isUser = await userApi.isAuthenticated();
    console.log(`model: isUser: ${isUser}, isRightAnswer: ${isRightAnswer}`);

    if (!isUser) return;

    const userWord: IUserWord | undefined = await userApi.getUserWord(wordId);

    if (!userWord) {
      this.addNewUserWord(wordId, isRightAnswer);
      return;
    }

    this.updateExistWord(userWord, isRightAnswer);
  };

  private updateExistWord = async (
    userWord: IUserWord,
    isRightAnswer: boolean,
  ) => {
    const { sprint } = userWord.optional;
    let { hard, learned } = userWord.optional;

    if (isRightAnswer) sprint.rightAnswer += 1;
    else sprint.wrongAnswer += 1;

    const diff = sprint.rightAnswer - sprint.wrongAnswer;

    if (
      (hard && diff === POINTS_TO_LEARNED_HARD_WORD)
      || (!hard && diff === POINTS_TO_LEARNED_WORD)
    ) {
      this.gameState.learnedWords += 1;
      learned = true;
      hard = false;
    }

    await userApi.updateUserWord(userWord.wordId, userWord);

    const date = getDateWithoutTime();

    this.updateStatisctic({
      [date]: {
        wordID: userWord.wordId,
        learned,
        new: false,
        rightAnswer: isRightAnswer,
      },
    });

    console.log('update userWord: ', userWord);
  };

  private addNewUserWord = async (wordID: string, isRightAnswer: boolean) => {
    this.gameState.newWords += 1;

    const newUserWord = createDefaultWord(wordID);

    if (isRightAnswer) newUserWord.optional.sprint.rightAnswer += 1;
    else newUserWord.optional.sprint.wrongAnswer += 1;

    console.log('create newUserWord: ', newUserWord);

    await userApi.createUserWord(wordID, newUserWord);

    const date = getDateWithoutTime();

    this.updateStatisctic({
      [date]: {
        wordID,
        learned: false,
        new: true,
        rightAnswer: isRightAnswer,
      },
    });
  };

  private async sendStatistic(wordStat: IWordStat) {
    const date = getDateWithoutTime();
    const currentStatistic = await userApi.getUserStatistics();

    console.log('current stat: ', currentStatistic);

    const statistic = await userApi.updateUserStatistics({
      learnedWords: 0,
      optional: {
        ...currentStatistic?.optional,
        wordStat,
      },
    });
    console.log('stat: ', statistic);
  }

  getWordsForGame = async (group: number, page: number) => {
    if (
      (await userApi.isAuthenticated())
      && isFromDictionaryPage()
      && !this.isMenuLink
    ) {
      const words = await this.getAgreggatedUserWords(group, page);

      console.log('getWOrds, user&&dictionary&&!menuLink, words: ', words);

      return words;
    }

    console.log(
      `getWords, fromMenuLink || notAuth, page: ${page}, group: ${group}`,
    );

    const wordList = await this.getWords(group, page);

    if (!wordList) return null;

    if (wordList && wordList.length) return this.formatWords(wordList);

    return null;
  };

  private async getAgreggatedUserWords(
    group = 3,
    page = 0,
  ): Promise<IGameWord[] | null> {
    const userLearnedWords = await userApi.getUserAggregatedWords(
      group,
      page,
      WORDS_PER_PAGE,
      encodeURIComponent(
        JSON.stringify({
          $and: [{ 'userWord.optional.learned': true }, { page }],
        }),
      ),
    );

    const learnedWords: IAggregatedWord[] | [] = userLearnedWords
      ? userLearnedWords[0]?.paginatedResults
      : [];

    const wordsList = await this.getWords(group, page);

    // console.log('learned: ', learnedWords, userLearnedWords);
    // console.log('all: ', wordsList);

    if (wordsList && learnedWords.length) {
      const excludeIDs: string[] = learnedWords.map(
        // eslint-disable-next-line no-underscore-dangle
        (word: IAggregatedWord) => word._id,
      );
      // console.log('excludeIDs: ', excludeIDs);

      const filteredWords = wordsList.filter(
        (word: IWord) => !excludeIDs.includes(word.id),
      );
      console.log('filteredWords: ', filteredWords);

      return this.formatWords(filteredWords);
    }
    return null;
  }

  private async getWords(group: number, page: number) {
    return (await this.api?.getWords(group, page)) || [];
  }

  private formatWords(words: IWord[]): IGameWord[] {
    return words.map(({
      word, wordTranslate, id, audio,
    }, idx) => {
      const randomIndex = Math.random() > 0.5 ? idx : generateIndex(words.length);
      return {
        id,
        audio,
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
