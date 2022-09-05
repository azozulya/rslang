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
  isFromDictionaryPage,
  isFromHardWords,
} from '../../utils/utils';
import userApi from '../../components/user/user';
import {
  DICTIONARY_KEY,
  POINTS_TO_LEARNED_HARD_WORD,
  POINTS_TO_LEARNED_WORD,
  WORDS_PER_PAGE,
} from '../../utils/constants';
import { getLocalStorage } from '../../utils/localStorage';

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

  getGameStatistic = () => this.gameState;

  private resetGameStatistic() {
    this.gameState = {
      learnedWords: 0,
      newWords: 0,
    };
  }

  sendStatistic = async (
    rightAnswers: number,
    wrongAnswers: number,
    bestSeries: number
  ) => {
    if (await userApi.isAuthenticated()) {
      await userApi.updateSprintStatistic(
        this.gameState.learnedWords,
        this.gameState.newWords,
        rightAnswers,
        wrongAnswers,
        bestSeries
      );
    }

    this.resetGameStatistic();
  };

  updateUserWord = async (wordId: string, isRightAnswer: boolean) => {
    const isUser = await userApi.isAuthenticated();

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
    isRightAnswer: boolean
  ) => {
    const { sprint, audiocall } = userWord.optional;
    let { hard, learned } = userWord.optional;

    if (sprint.rightAnswer === 0 && sprint.wrongAnswer === 0) {
      this.gameState.newWords += 1;
    }

    if (isRightAnswer) {
      sprint.rightAnswer += 1;

      const diff =
        sprint.rightAnswer -
        sprint.wrongAnswer +
        (audiocall.rightAnswer - audiocall.wrongAnswer);

      console.log(hard, diff, POINTS_TO_LEARNED_WORD);
      if (
        (hard && diff >= POINTS_TO_LEARNED_HARD_WORD) ||
        (!hard && diff >= POINTS_TO_LEARNED_WORD)
      ) {
        this.gameState.learnedWords += 1;
        learned = true;
        hard = false;
      }
    } else {
      sprint.wrongAnswer += 1;

      if (learned) learned = false;
    }

    await userApi.updateUserWord(userWord.wordId, {
      ...userWord,
      optional: {
        ...userWord.optional,
        learned,
        hard,
        sprint,
      },
    });
  };

  private addNewUserWord = async (wordID: string, isRightAnswer: boolean) => {
    this.gameState.newWords += 1;

    const newUserWord = createDefaultWord(wordID);

    if (isRightAnswer) newUserWord.optional.sprint.rightAnswer += 1;
    else newUserWord.optional.sprint.wrongAnswer += 1;

    console.log('create newUserWord: ', newUserWord);

    await userApi.createUserWord(wordID, newUserWord);
  };

  getWordsForGame = async (group: number, page: number) => {
    if (isFromHardWords()) {
      const hardWords = await this.getAgreggatedHardWords();
      if (!hardWords) return null;
      console.log('hardWords: ', hardWords);
      console.log(this.formatWords(hardWords));
      return this.formatWords(hardWords);
    }

    if (
      (await userApi.isAuthenticated()) &&
      isFromDictionaryPage() &&
      !this.isMenuLink
    ) {
      const words = await this.getAgreggatedUserWords(group, page);

      console.log('getWOrds, user&&dictionary&&!menuLink, words: ', words);

      return words;
    }

    console.log(
      `getWords, fromMenuLink || notAuth, page: ${page}, group: ${group}`
    );

    const wordList = await this.getWords(group, page);

    if (!wordList) return null;

    if (wordList && wordList.length) return this.formatWords(wordList);

    return null;
  };

  private async getAgreggatedHardWords() {
    const aggregateHardWords = await userApi.getUserAggregatedWordsFilter(
      encodeURIComponent(
        JSON.stringify({
          $and: [{ 'userWord.optional.hard': true }],
        })
      )
    );
    const hardWords: IAggregatedWord[] | [] = aggregateHardWords
      ? aggregateHardWords[0]?.paginatedResults
      : [];

    return hardWords;
  }

  private async getAgreggatedUserWords(
    group: number,
    page: number
  ): Promise<IGameWord[] | null> {
    const userLearnedWords = await userApi.getUserAggregatedWords(
      group,
      WORDS_PER_PAGE,
      encodeURIComponent(
        JSON.stringify({
          $and: [{ 'userWord.optional.learned': true }, { page }],
        })
      )
    );

    console.log('group: ', group, 'page: ', page);
    console.log('userLearnedWords: ', userLearnedWords);
    const learnedWords: IAggregatedWord[] | [] = userLearnedWords
      ? userLearnedWords[0]?.paginatedResults
      : [];

    const wordsList = await this.getWords(group, page);

    // console.log('learned: ', learnedWords, userLearnedWords);
    console.log('wordsList: ', wordsList);

    if (wordsList && learnedWords.length) {
      const excludeIDs: string[] = learnedWords.map(
        // eslint-disable-next-line no-underscore-dangle
        (word: IAggregatedWord) => word._id
      );
      // console.log('excludeIDs: ', excludeIDs);

      const filteredWords = wordsList.filter(
        (word: IWord) => !excludeIDs.includes(word.id)
      );
      console.log('filteredWords: ', filteredWords);

      return this.formatWords(filteredWords);
    }
    return this.formatWords(wordsList);
  }

  private async getWords(group: number, page: number) {
    return (await this.api?.getWords(group, page)) || [];
  }

  private formatWords(words: IWord[] | IAggregatedWord[]): IGameWord[] {
    return words.map((wordItem, idx) => {
      const randomIndex =
        Math.random() > 0.5 ? idx : generateIndex(words.length);
      const { word, wordTranslate, audio } = wordItem;
      return {
        // eslint-disable-next-line no-underscore-dangle
        id: wordItem.id || (<IAggregatedWord>wordItem)._id,
        audio,
        word,
        wordTranslate,
        pseudoTranslate: words[randomIndex].wordTranslate,
      };
    });
  }
}

export default GamesModel;
