import { IGameWord } from '../../../components/interfaces';
import create from '../../../components/utils/createElement';

class SprintGame {
  private gameContainer: HTMLElement;

  private scoreElement: HTMLElement;

  private GAME__TIMER = 30;

  private currentWordIndex = 0;

  private gameState = {
    score: 0,
    learnedWords: 0,
    rightAnswer: 0,
    wrongAnswer: 0,
    seriesOfRightAnswer: 0,
    maxSeriesOfRightAnswer: 0,
  };

  private wordContainer: HTMLElement;

  constructor(private wordsList: IGameWord[], private onStopGame: () => void) {
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

  private drawBtns() {
    const yesBtn = create({
      tagname: 'button',
      class: 'btn',
      text: 'Верно',
    });
    yesBtn.classList.add('btn--yes');

    const noBtn = create({
      tagname: 'button',
      class: 'btn',
      text: 'Неверно',
    });
    noBtn.classList.add('btn--no');

    noBtn.addEventListener('click', () => this.checkAnswer('false'));
    yesBtn.addEventListener('click', () => this.checkAnswer('true'));

    const btnsContainer = create({ tagname: 'div', class: 'sprint__btns' });
    btnsContainer.append(noBtn, yesBtn);

    return btnsContainer;
  }

  private drawTimer() {
    const timerContainer = create({ tagname: 'div', class: 'sprint__timer' });
    timerContainer.innerHTML = `
      <svg class="sprint__timer--icon">
        <use xlink:href="../../assets/img/timer.svg#timer"></use>
      </svg>`;

    const gameTimer = create({
      tagname: 'span',
      text: String(this.GAME__TIMER),
    });

    let timer = this.GAME__TIMER;

    const timerId = setInterval(() => {
      gameTimer.innerText = String(timer);

      if (timer === 0) {
        clearInterval(timerId);
        this.onStopGame();
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
      this.onStopGame();
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
