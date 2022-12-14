import { IGameStatistic, IGameWord } from '../interfaces/interfaces';
import {
  COUNT_LAST_WORDS,
  GAME_TIMER,
  MAX_POINTS_FOR_RIGHT_ANSWER,
  POINTS_FOR_RIGHT_ANSWER,
  SERIA_RIGHT_ANSWER,
} from '../utils/constants';
import create from '../utils/createElement';
import {
  isFromHardWords,
  playAudio,
} from '../utils/utils';
import TimerIcon from '../assets/img/timer.svg';
import RightAnswerSound from '../assets/audio/rightAnswer.mp3';
import WrongAnswerSound from '../assets/audio/wrongAnswer.mp3';

class SprintGame {
  private gameContainer: HTMLElement;

  private scoreElement: HTMLElement;

  private wordContainer: HTMLElement;

  private yesBtn?: HTMLButtonElement;

  private noBtn?: HTMLButtonElement;

  private currentWordIndex = 0;

  private dots?: HTMLElement[];

  private pointsPerRightAnswer = POINTS_FOR_RIGHT_ANSWER;

  private pointsIncreasContainer: HTMLElement;

  private defaultState = {
    score: 0,
    learnedWords: 0,
    newWords: 0,
    rightAnswer: 0,
    wrongAnswer: 0,
    seriesOfRightAnswer: 0,
    winStreak: 0,
  };

  private gameState = { ...this.defaultState };

  private timerId?: NodeJS.Timer;

  private audioRightElement: HTMLAudioElement;

  private audioWrongElement: HTMLAudioElement;

  constructor(
    private wordsList: IGameWord[],
    private group: number,
    private page: number,
    private onStopGameHandler: (
      state: IGameStatistic,
      wordsList: IGameWord[]
    ) => void,
    private updateWordState?: (wordId: string, isRightAnswer: boolean) => void,
    private getWords?: (
      level: number,
      page: number
    ) => Promise<IGameWord[] | null>,
  ) {
    this.gameContainer = create({ tagname: 'div', class: 'sprint' });
    this.wordContainer = create({ tagname: 'div', class: 'sprint__word' });
    this.scoreElement = create({
      tagname: 'div',
      class: 'sprint__score',
      text: '0',
    });
    this.pointsIncreasContainer = create({
      tagname: 'div',
      class: 'sprint__score-points',
      text: `+${this.pointsPerRightAnswer} очков за слово`,
    });

    this.audioRightElement = new Audio(RightAnswerSound);
    this.audioWrongElement = new Audio(WrongAnswerSound);

    this.init();
  }

  private init() {
    const firstWord = this.drawWord(this.currentWordIndex);

    if (!firstWord) {
      this.gameContainer.innerHTML = 'Что-то пошло не так...';
      return;
    }

    this.gameContainer.append(
      this.drawTimer(),
      this.drawScoreContainer(),
      this.wordContainer,
      this.drawBtns(),
    );

    this.gameContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="sprint__keys">
          <div>←</div><div>→</div>
        </div>`,
    );

    this.wordContainer.innerHTML = firstWord;

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const { key } = event;

      if (key !== 'ArrowRight' && key !== 'ArrowLeft') return;

      if (key === 'ArrowRight') {
        this.yesBtn?.click();
        return;
      }

      this.noBtn?.click();
    });
  }

  render() {
    return this.gameContainer;
  }

  private drawScoreContainer() {
    const scoreWrapper = create({
      tagname: 'div',
      class: 'sprint__score-wrapper',
    });

    const dotsContainer = create({
      tagname: 'div',
      class: 'sprint__score-dots',
    });

    this.dots = Array(SERIA_RIGHT_ANSWER)
      .fill(0)
      .map(() => create({ tagname: 'div', class: 'dot' }));

    dotsContainer.append(...this.dots);

    scoreWrapper.append(
      this.scoreElement,
      this.pointsIncreasContainer,
      dotsContainer,
    );

    return scoreWrapper;
  }

  private stopGame = () => {
    this.onStopGameHandler(this.gameState, this.wordsList);

    clearInterval(this.timerId);
    this.currentWordIndex = 0;
    this.gameState = { ...this.defaultState };
    this.gameContainer.innerText = '';

    this.noBtn?.removeEventListener('click', this.onNoBtnClickHandler);
    this.yesBtn?.removeEventListener('click', this.onYesBtnClickHandler);
  };

  private drawBtns() {
    this.yesBtn = <HTMLButtonElement>create({
      tagname: 'button',
      class: 'btn',
      text: 'Верно',
    });
    this.yesBtn?.classList.add('btn--yes');

    this.noBtn = <HTMLButtonElement>create({
      tagname: 'button',
      class: 'btn',
      text: 'Неверно',
    });
    this.noBtn.classList.add('btn--no');

    this.noBtn.addEventListener('click', this.onNoBtnClickHandler);
    this.yesBtn.addEventListener('click', this.onYesBtnClickHandler);

    const btnsContainer = create({ tagname: 'div', class: 'sprint__btns' });
    btnsContainer.append(
      this.noBtn,
      this.yesBtn,
      this.audioRightElement,
      this.audioWrongElement,
    );

    return btnsContainer;
  }

  private onNoBtnClickHandler = () => {
    this.checkAnswer('false');
  };

  private onYesBtnClickHandler = () => {
    this.checkAnswer('true');
  };

  private drawTimer() {
    const timerWrapper = create({
      tagname: 'div',
      class: 'sprint__timer',
    });

    timerWrapper.innerHTML = `
      <svg class="sprint__timer--icon">
        <use xlink:href="${TimerIcon}#timer"></use>
      </svg>`;

    const gameTimer = create({
      tagname: 'span',
      text: String(GAME_TIMER),
    });

    let timer = GAME_TIMER;

    this.timerId = setInterval(() => {
      gameTimer.innerText = String(timer);

      if (timer === 0) {
        this.stopGame();
        return;
      }

      timer -= 1;
    }, 1000);

    timerWrapper.append(gameTimer);

    return timerWrapper;
  }

  private drawWord(idx: number) {
    const wordItem = this.wordsList[idx];
    if (!wordItem) return '';

    return `
           <div class="sprint__word--title">${wordItem.word}</div>
           <div class="sprint__word--translate">${wordItem.pseudoTranslate}</div>
         `;
  }

  private async nextWord() {
    this.wordContainer.classList.remove(
      'sprint__right-answer',
      'sprint__wrong-answer',
    );

    this.currentWordIndex += 1;

    if (
      this.currentWordIndex >= this.wordsList.length - COUNT_LAST_WORDS
      && this.page > 0
      && !isFromHardWords()
    ) {
      this.page -= 1;
      const additionalWords = await this.getWords?.(this.group, this.page);

      if (additionalWords) {
        this.wordsList.push(...additionalWords);
      }
    }

    if (this.wordsList[this.currentWordIndex]) {
      this.wordContainer.innerHTML = this.drawWord(this.currentWordIndex);
      return;
    }

    this.stopGame();
  }

  private checkAnswer = async (userAnswer: string) => {
    const currentWord = this.wordsList[this.currentWordIndex];

    const { wordTranslate, pseudoTranslate } = currentWord;

    if (String(wordTranslate === pseudoTranslate) === userAnswer) {
      currentWord.isRightAnswer = true;

      playAudio(this.audioRightElement);
      this.addRightAnswer();
      await this.updateWordState?.(currentWord.id, true);
    } else {
      currentWord.isRightAnswer = false;

      playAudio(this.audioWrongElement);
      this.addWrongAnswer();
      await this.updateWordState?.(currentWord.id, false);
    }

    setTimeout(() => {
      this.nextWord();
    }, 100);
  };

  private updatePointsPerWord() {
    if (this.pointsPerRightAnswer === MAX_POINTS_FOR_RIGHT_ANSWER) return;

    const dotElement = this.dots?.find(
      (dot) => !dot.classList.contains('active'),
    );

    if (dotElement) {
      dotElement.classList.add('active');
      return;
    }

    this.dots?.forEach((dot) => dot.classList.remove('active'));
    this.pointsPerRightAnswer += POINTS_FOR_RIGHT_ANSWER;

    this.updatePontsContainer();
  }

  private resetPointsPerWord() {
    this.dots?.forEach((dot) => dot.classList.remove('active'));

    this.pointsPerRightAnswer = POINTS_FOR_RIGHT_ANSWER;

    this.updatePontsContainer();
  }

  private updatePontsContainer() {
    if (this.pointsIncreasContainer) {
      this.pointsIncreasContainer.innerHTML = `+${this.pointsPerRightAnswer} очков за слово`;
    }
  }

  private async addRightAnswer() {
    this.wordContainer.classList.add('sprint__right-answer');

    let {
      rightAnswer, seriesOfRightAnswer, winStreak, score,
    } = this.gameState;

    rightAnswer += 1;
    seriesOfRightAnswer += 1;
    score += this.pointsPerRightAnswer;

    if (seriesOfRightAnswer > winStreak) {
      winStreak = seriesOfRightAnswer;
    }

    this.updateState({
      rightAnswer,
      seriesOfRightAnswer,
      winStreak,
      score,
    });

    this.updatePointsPerWord();
    this.updateScore();
  }

  private addWrongAnswer() {
    this.wordContainer.classList.add('sprint__wrong-answer');

    let { wrongAnswer, winStreak, seriesOfRightAnswer } = this.gameState;

    wrongAnswer += 1;

    if (seriesOfRightAnswer > winStreak) {
      winStreak = seriesOfRightAnswer;
    }

    seriesOfRightAnswer = 0;

    this.updateState({
      wrongAnswer,
      seriesOfRightAnswer,
      winStreak,
    });

    this.resetPointsPerWord();
  }

  private updateState(params: {
    rightAnswer?: number;
    seriesOfRightAnswer: number;
    score?: number;
    wrongAnswer?: number;
    winStreak?: number;
    learnedWords?: number;
    newWords?: number;
  }) {
    this.gameState = {
      ...this.gameState,
      ...params,
    };
  }

  private updateScore() {
    this.scoreElement.innerHTML = this.gameState.score.toString();
  }
}

export default SprintGame;
