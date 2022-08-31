import { IUserWord, TPageHistory } from '../interfaces/interfaces';
import { DEFAULT_PAGE, DICTIONARY_PAGE, PAGE_KEY } from './constants';
import create from './createElement';
import { getLocalStorage } from './localStorage';

export const generateIndex = (maxNumber: number) => Math.floor(Math.random() * maxNumber);

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

export const getDateWithoutTime = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

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