import Api from '../../api/api';
import userApi from '../../components/user/user';
import {
  IUserWord, IAggregatedWord, IWord, IAudioCallWord,
} from '../../interfaces/interfaces';
import {
  AUDIOCALL_COUNT_OPTIONS,
  AUDIOCALL_COUNT_WORDS,
  POINTS_TO_LEARNED_HARD_WORD,
  POINTS_TO_LEARNED_WORD,
  WORDS_PER_PAGE,
} from '../../utils/constants';
import {
  createDefaultWord,
  isFromDictionaryPage,
  sortRandom,
  generateIndex,
} from '../../utils/utils';

class AudioCallModel {
  private api?: Api;

  isMenuLink = true;

  private gameState = {
    learnedWords: 0,
    newWords: 0,
  };

  constructor() {
    this.api = Api.getInstance();
  }

  getGameStatistic = () => { // STATISTICS
    console.log('model, getGameStatistic:  ', this.gameState);
    return this.gameState;
  };

  resetGameStatistic() {
    this.gameState = {
      learnedWords: 0,
      newWords: 0,
    };
  }

  /* private async updateStatistic(wordStat: IWordStat) {
    await this.sendStatistic(wordStat);

    const date = getDateWithoutTime();

    const storageObj = getLocalStorage<{ [x: number]: IWordStat[] }>(
      SPRINT_WORDS_STATISTIC,
    );

    if (!storageObj) {
      setLocalStorage(SPRINT_WORDS_STATISTIC, { [date]: [wordStat] });
      return;
    }

    const currentStat = storageObj[date];
    currentStat.push(wordStat);

    setLocalStorage(SPRINT_WORDS_STATISTIC, {
      [date]: currentStat,
    });
  }

  private async sendStatistic(wordStat: IWordStat) {
    return '';
  }
  */

  updateUserWord = async (wordId: string, isRightAnswer: boolean) => { // UPDATE
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

    if (isRightAnswer) {
      sprint.rightAnswer += 1;

      const diff = sprint.rightAnswer - sprint.wrongAnswer;

      if (
        (hard && diff === POINTS_TO_LEARNED_HARD_WORD)
        || (!hard && diff === POINTS_TO_LEARNED_WORD)
      ) {
        this.gameState.learnedWords += 1;
        learned = true;
        hard = false;
      }
    } else {
      sprint.wrongAnswer += 1;

      if (learned) learned = false;
    }

    await userApi.updateUserWord(userWord.wordId, userWord);

    /* this.updateStatistic({
      wordID: userWord.wordId,
      learned,
      new: false,
      rightAnswer: isRightAnswer,
    });
    */

    console.log('update userWord: ', userWord);
  };

  private addNewUserWord = async (wordID: string, isRightAnswer: boolean) => {
    this.gameState.newWords += 1;

    const newUserWord = createDefaultWord(wordID);

    if (isRightAnswer) newUserWord.optional.sprint.rightAnswer += 1;
    else newUserWord.optional.sprint.wrongAnswer += 1;

    console.log('create newUserWord: ', newUserWord);

    await userApi.createUserWord(wordID, newUserWord);

  /*  this.updateStatistic({
      wordID,
      learned: false,
      new: true,
      rightAnswer: isRightAnswer,
    });
    */
  };

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

    const wordList = await this.getWords(group, page);

    if (!wordList) return null;

    if (wordList && wordList.length) return this.formatWords(wordList);

    return null;
  };

  private async getAgreggatedUserWords(
    group: number,
    page: number,
  ): Promise<IAudioCallWord[] | null> {
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
    console.log('wordlist: ', wordsList);

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
    return this.formatWords(wordsList);
  }

  private async getWords(group: number, page: number) {
    return (await this.api?.getWords(group, page)) || [];
  }

  private formatWords(words: IWord[]): IAudioCallWord[] {
    const randomWords = sortRandom(words);

    return randomWords
      .splice(0, AUDIOCALL_COUNT_WORDS)
      .map(({
        word,
        wordTranslate,
        id,
        audio,
        image,
      }) => {
        const answerIndex = generateIndex(AUDIOCALL_COUNT_OPTIONS);
        return {
          id,
          audio,
          image,
          word,
          wordTranslate,
          answerIndex,
          optionsTranslate: this.makeTranslateOptions(words, wordTranslate, answerIndex),
        };
      });
  }

  private makeTranslateOptions(words: IWord[], wordPaste:string, index: number): string[] {
    const randomSorted: string[] = sortRandom(words)
      .filter((word) => word.wordTranslate !== wordPaste)
      .map((word) => word.wordTranslate)
      .splice(0, AUDIOCALL_COUNT_OPTIONS - 1);
    randomSorted.splice(index, 0, wordPaste);
    return randomSorted;
  }
}

export default AudioCallModel;

function getDateWithoutTime() {
  throw new Error('Function not implemented.');
}

/* function getLocalStorage<T>(SPRINT_WORDS_STATISTIC: any) {
  throw new Error('Function not implemented.');
}

function SPRINT_WORDS_STATISTIC<T>(SPRINT_WORDS_STATISTIC: any) {
  throw new Error('Function not implemented.');
}

function setLocalStorage(SPRINT_WORDS_STATISTIC: any, arg1: { [x: number]: IWordStat[]; }) {
  throw new Error('Function not implemented.');
}

function createDefaultWord(wordID: string) {
  throw new Error('Function not implemented.');
}

function isFromDictionaryPage() {
  throw new Error('Function not implemented.');
}

function WORDS_PER_PAGE(group: number, page: number, WORDS_PER_PAGE: any, arg3: string) {
  throw new Error('Function not implemented.');
}

function generateIndex(length: number) {
  throw new Error('Function not implemented.');
}
*/
