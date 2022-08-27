import { IUserWord, TPageHistory } from '../interfaces/interfaces';
import { DEFAULT_PAGE, DICTIONARY_PAGE, PAGE_KEY } from './constants';
import { getLocalStorage } from './localStorage';

export const generateIndex = (maxNumber: number) =>
  Math.floor(Math.random() * maxNumber);

export const isFromDictionaryPage = () => {
  const storageValue = getLocalStorage<TPageHistory>(PAGE_KEY);
  const page = storageValue ? storageValue.prevPage : DEFAULT_PAGE;

  return page === DICTIONARY_PAGE;
};

export function createDefaultWord(id: string): IUserWord {
  return {
    wordId: id,
    difficulty: 'weak',
    optional: {
      learned: false,
      hard: false,
      sprint: {
        rightAnswer: 0,
        wrongAnswer: 0,
      },
      audiocall: {
        rightAnswer: 0,
        wrongAnswer: 0,
      },
    },
  };
}
