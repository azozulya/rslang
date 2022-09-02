import {
  IPathOfAggregatedWord,
  IUserWord,
  TPageHistory,
} from '../interfaces/interfaces';
import { DEFAULT_PAGE, DICTIONARY_PAGE, PAGE_KEY } from './constants';
import create from './createElement';
import { getLocalStorage } from './localStorage';

export const generateIndex = (maxNumber: number) => Math.floor(Math.random() * maxNumber);

export function sortRandom<T>(array: T[]): T[] {
  return array
    .map((elem) => [elem, Math.random()] as [T, number])
    .sort((a, b) => a[1] - b[1])
    .map((elem) => elem[0]);
}

export const isFromDictionaryPage = () => {
  const storageValue = getLocalStorage<TPageHistory>(PAGE_KEY);
  const page = storageValue ? storageValue.prevPage : DEFAULT_PAGE;

  return page === DICTIONARY_PAGE;
};

export const isStartPage = () => {
  const storageValue = getLocalStorage<TPageHistory>(PAGE_KEY);

  if (storageValue) {
    return storageValue.prevPage === storageValue.currentPage;
  }

  return false;
};

export const getCurrentPageName = () => {
  const storageValue = getLocalStorage<TPageHistory>(PAGE_KEY);

  if (storageValue) return storageValue.currentPage;

  return DEFAULT_PAGE;
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

export function createDefaultUserWord(id: string): IPathOfAggregatedWord {
  return {
    _id: id,
    userWord: {
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
    },
  };
}

function createCircle(className: string) {
  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  circle.setAttribute('cx', '80');
  circle.setAttribute('cy', '80');
  circle.setAttribute('r', '70');
  circle.classList.add(className);
  return circle;
}

export const animatedCircleProgressBar = (value: number) => {
  const container = create({ tagname: 'div', class: 'progressbar' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('progressbar__svg');

  svg.animate(
    [
      { strokeDashoffset: 440 },
      {
        strokeDashoffset: 440 - (440 * value) / 100,
      },
    ],
    {
      duration: 2000,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards',
    },
  );

  svg.append(
    createCircle('progressbar__default-circle'),
    createCircle('progressbar__circle'),
  );
  container.append(svg);
  container.insertAdjacentHTML(
    'beforeend',
    `<div class="progressbar__text"> 
      <span class="progressbar__progress">${value}%</span>
      правильных ответов
    </div>`,
  );
  return container;
};

export function playAudio(audioElementToPlay: HTMLAudioElement) {
  const audio = audioElementToPlay;
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}
