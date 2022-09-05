import Api from '../../api/api';
import userApi from '../../components/user/user';
import {
  IUserWord, IWord, IAudioCallWord,
} from '../../interfaces/interfaces';
import {
  AUDIOCALL_COUNT_OPTIONS,
  AUDIOCALL_COUNT_WORDS,
  POINTS_TO_LEARNED_HARD_WORD,
  POINTS_TO_LEARNED_WORD,
} from '../../utils/constants';
import wordsList from '../../utils/defaultWord';
import {
  createDefaultWord,
  isFromDictionaryPage,
  sortRandom,
  generateIndex,
  isFromHardWords,
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

  getGameStatistic = () => this.gameState;

  resetGameStatistic() {
    this.gameState = {
      learnedWords: 0,
      newWords: 0,
    };
  }

  sendStatistic = async (
    rightAnswers: number,
    wrongAnswers: number,
    bestSeries: number,
  ) => {
    if (await userApi.isAuthenticated()) {
      await userApi.updateSprintStatistic(
        this.gameState.learnedWords,
        this.gameState.newWords,
        rightAnswers,
        wrongAnswers,
        bestSeries,
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

  // eslint-disable-next-line max-lines-per-function
  private updateExistWord = async (
    userWord: IUserWord,
    isRightAnswer: boolean,
  ) => {
    const { audiocall, sprint } = userWord.optional;
    let { hard, learned } = userWord.optional;
    if ((audiocall.rightAnswer === 0 && audiocall.wrongAnswer === 0)
        && (sprint.rightAnswer === 0 && sprint.wrongAnswer === 0)) {
      this.gameState.newWords += 1;
    }

    if (isRightAnswer) {
      audiocall.rightAnswer += 1;

      const diff = sprint.rightAnswer
        - sprint.wrongAnswer
        + (audiocall.rightAnswer - audiocall.wrongAnswer);

      if (
        (hard && diff >= POINTS_TO_LEARNED_HARD_WORD)
        || (!hard && diff >= POINTS_TO_LEARNED_WORD)
      ) {
        this.gameState.learnedWords += 1;
        learned = true;
        hard = false;
      }
    } else {
      audiocall.wrongAnswer += 1;

      if (learned) learned = false;
    }

    await userApi.updateUserWord(userWord.wordId, {
      ...userWord,
      optional: {
        ...userWord.optional,
        learned,
        hard,
        audiocall,
      },
    });
  };

  private addNewUserWord = async (wordID: string, isRightAnswer: boolean) => {
    this.gameState.newWords += 1;

    const newUserWord = createDefaultWord(wordID);

    if (isRightAnswer) newUserWord.optional.audiocall.rightAnswer += 1;
    else newUserWord.optional.audiocall.wrongAnswer += 1;

    await userApi.createUserWord(wordID, newUserWord);
  };

  getWordsForGame = async (group: number, page: number) => {
    const wordList = await this.getWords(group, page);
    let words: IAudioCallWord[];

    if (
      (await userApi.isAuthenticated())
      && isFromDictionaryPage()
      && !this.isMenuLink
    ) {
      words = await this.makeWords(group, page);
      if (isFromHardWords()) words = await this.makeHardWords();

      return words;
    }

    if (!wordList) return null;

    if (wordList && wordList.length) return this.formatWords(wordList);

    return null;
  };

  private async makeWords(group: number, page: number) {
    let filterWords: IWord[] = [];
    let pageNum = page;
    const userWords = await userApi.getUserWords();
    const learnedWords = userWords?.filter((userWord) => userWord.optional.learned === true);

    while (filterWords.length < AUDIOCALL_COUNT_WORDS && pageNum >= 0) {
      // eslint-disable-next-line no-await-in-loop
      const words = await userApi.getWords(group, pageNum);

      if (words && learnedWords?.length) {
        const excludeIDs: string[] = learnedWords.map((word: IUserWord) => word.wordId);
        const filtered = words.filter((word: IWord) => !excludeIDs.includes(word.id));

        filterWords = [...filterWords, ...filtered];
      }
      pageNum -= 1;
    }

    return this.formatWords(filterWords);
  }

  private async makeHardWords() {
    const filterWords: Promise<IWord | undefined>[] = [];

    const userWords = await userApi.getUserWords();
    const hardWords = userWords?.filter((userWord) => userWord.optional.hard === true);

    if (!hardWords) return [];
    // eslint-disable-next-line no-restricted-syntax
    for (const hardWord of hardWords) {
      const { wordId } = hardWord;
      if (wordId) {
        const word = userApi.getWord(wordId);
        filterWords.push(word);
      }
    }
    const fullWords = await Promise.all(filterWords) as IWord[]; // TO DO add check type;

    return this.formatWords(fullWords);
  }

  private async getWords(group: number, page: number) {
    return (await this.api?.getWords(group, page)) || [];
  }

  private formatWords(words: IWord[]): IAudioCallWord[] {
    return words
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
    const wordsUsed = words.length < AUDIOCALL_COUNT_OPTIONS
      ? wordsList : words;
    const randomSorted: string[] = sortRandom(wordsUsed)
      .filter((word) => word.wordTranslate !== wordPaste)
      .map((word) => word.wordTranslate)
      .splice(0, AUDIOCALL_COUNT_OPTIONS - 1);
    randomSorted.splice(index, 0, wordPaste);
    return randomSorted;
  }
}

export default AudioCallModel;
