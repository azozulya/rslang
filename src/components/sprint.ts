import { IGameWord } from '../interfaces/interfaces';
import { GAME_TIMER } from '../utils/constants';
import create from '../utils/createElement';

class SprintGame {
  private gameContainer: HTMLElement;

  private scoreElement: HTMLElement;

  private wordContainer: HTMLElement;

  private yesBtn?: HTMLButtonElement;

  private noBtn?: HTMLButtonElement;

  private currentWordIndex = 0;

  private defaultState = {
    score: 0,
    learnedWords: 0,
    rightAnswer: 0,
    wrongAnswer: 0,
    seriesOfRightAnswer: 0,
    maxSeriesOfRightAnswer: 0,
  };

  private gameState = { ...this.defaultState };

  private timerId?: NodeJS.Timer;

  constructor(
    private wordsList: IGameWord[],
    private onStopGameHandler: () => void,
  ) {
    this.gameContainer = create({ tagname: 'div', class: 'sprint' });
    this.scoreElement = create({
      tagname: 'div',
      class: 'sprint__score',
      text: '0',
    });
    this.wordContainer = create({ tagname: 'div', class: 'sprint__word' });
    this.init();
  }

  private init() {
    this.gameContainer.append(
      this.drawTimer(),
      this.scoreElement,
      this.wordContainer,
      this.drawBtns(),
    );

    this.wordContainer.innerHTML = this.drawWord(this.currentWordIndex);
  }

  render() {
    return this.gameContainer;
  }

  private stopGame = () => {
    clearInterval(this.timerId);
    this.currentWordIndex = 0;
    this.gameState = { ...this.defaultState };
    this.gameContainer.innerText = '';

    this.noBtn?.removeEventListener('click', this.onNoBtnClickHandler);
    this.yesBtn?.removeEventListener('click', this.onYesBtnClickHandler);

    this.onStopGameHandler();
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
    btnsContainer.append(this.noBtn, this.yesBtn);

    return btnsContainer;
  }

  private onNoBtnClickHandler = () => {
    this.checkAnswer('false');
  };

  private onYesBtnClickHandler = () => {
    this.checkAnswer('true');
  };

  private drawTimer() {
    const timerContainer = create({ tagname: 'div', class: 'sprint__timer' });
    timerContainer.innerHTML = `
      <svg class="sprint__timer--icon">
        <use xlink:href="../../assets/img/timer.svg#timer"></use>
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

    timerContainer.append(gameTimer);

    return timerContainer;
  }

  private drawWord(idx: number) {
    const wordItem = this.wordsList[idx];

    return `
           <div class="sprint__word--title">${wordItem.word}</div>
           <div class="sprint__word--translate">${wordItem.pseudoTranslate}</div>
         `;
  }

  private nextWord() {
    this.wordContainer.classList.remove(
      'sprint__right-answer',
      'sprint__wrong-answer',
    );

    this.currentWordIndex += 1;

    if (this.currentWordIndex === this.wordsList.length) {
      this.stopGame();
      return;
    }

    this.wordContainer.innerHTML = this.drawWord(this.currentWordIndex);
  }

  private checkAnswer = (userAnswer: string) => {
    const currentWord = this.wordsList[this.currentWordIndex];

    const { wordTranslate, pseudoTranslate } = currentWord;

    if (String(wordTranslate === pseudoTranslate) === userAnswer) {
      this.addRightAnswer();
    } else {
      this.addWrongAnswer();
    }
    setTimeout(() => this.nextWord(), 1000);
  };

  private async addRightAnswer() {
    this.wordContainer.classList.add('sprint__right-answer');

    let { rightAnswer, seriesOfRightAnswer, score } = this.gameState;

    rightAnswer += 1;
    seriesOfRightAnswer += 1;
    score += 10;

    this.updateState({ rightAnswer, seriesOfRightAnswer, score });
    this.updateScore();
  }

  private addWrongAnswer() {
    this.wordContainer.classList.add('sprint__wrong-answer');

    let { wrongAnswer, maxSeriesOfRightAnswer, seriesOfRightAnswer } = this.gameState;

    wrongAnswer += 1;

    if (seriesOfRightAnswer > maxSeriesOfRightAnswer) {
      maxSeriesOfRightAnswer = seriesOfRightAnswer;
      seriesOfRightAnswer = 0;
    }

    this.updateState({
      wrongAnswer,
      seriesOfRightAnswer,
      maxSeriesOfRightAnswer,
    });
  }

  private updateState(params: {
    rightAnswer?: number;
    seriesOfRightAnswer: number;
    score?: number;
    wrongAnswer?: number;
    maxSeriesOfRightAnswer?: number;
    learnedWords?: number;
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
