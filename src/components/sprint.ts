import { IGameStatistic, IGameWord } from '../interfaces/interfaces';
import { COUNT_LAST_WORDS, GAME_TIMER } from '../utils/constants';
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
    newWords: 0,
    rightAnswer: 0,
    wrongAnswer: 0,
    seriesOfRightAnswer: 0,
    winStreak: 0,
  };

  private gameState = { ...this.defaultState };

  private timerId?: NodeJS.Timer;

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
    this.scoreElement = create({
      tagname: 'div',
      class: 'sprint__score',
      text: '0',
    });
    this.wordContainer = create({ tagname: 'div', class: 'sprint__word' });
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
      this.scoreElement,
      this.wordContainer,
      this.drawBtns(),
    );

    this.wordContainer.innerHTML = firstWord;
  }

  render() {
    return this.gameContainer;
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

    if (this.currentWordIndex === this.wordsList.length) {
      this.stopGame();
      return;
    }

    this.wordContainer.innerHTML = this.drawWord(this.currentWordIndex);

    if (
      this.currentWordIndex > this.wordsList.length - COUNT_LAST_WORDS
      && this.page > 0
    ) {
      const additionalWords = await this.getWords?.(this.group, this.page - 1);
      if (additionalWords) {
        this.wordsList.push(...additionalWords);
      }
      console.log('additionalWords: ', additionalWords);
    }
  }

  private checkAnswer = (userAnswer: string) => {
    const currentWord = this.wordsList[this.currentWordIndex];

    const { wordTranslate, pseudoTranslate } = currentWord;

    if (String(wordTranslate === pseudoTranslate) === userAnswer) {
      currentWord.isRightAnswer = true;
      this.addRightAnswer();
      this.updateWordState?.(currentWord.id, true);
    } else {
      currentWord.isRightAnswer = false;
      this.addWrongAnswer();
      this.updateWordState?.(currentWord.id, false);
    }

    setTimeout(() => this.nextWord(), 500);
  };

  private async addRightAnswer() {
    this.wordContainer.classList.add('sprint__right-answer');

    let {
      rightAnswer, seriesOfRightAnswer, winStreak, score,
    } = this.gameState;

    rightAnswer += 1;
    seriesOfRightAnswer += 1;
    score += 10;

    if (seriesOfRightAnswer > winStreak) {
      winStreak = seriesOfRightAnswer;
    }

    this.updateState({
      rightAnswer,
      seriesOfRightAnswer,
      winStreak,
      score,
    });

    this.updateScore();
  }

  private addWrongAnswer() {
    this.wordContainer.classList.add('sprint__wrong-answer');

    let { wrongAnswer, winStreak, seriesOfRightAnswer } = this.gameState;

    wrongAnswer += 1;

    if (seriesOfRightAnswer > winStreak) {
      winStreak = seriesOfRightAnswer;
      seriesOfRightAnswer = 0;
    }

    this.updateState({
      wrongAnswer,
      seriesOfRightAnswer,
      winStreak,
    });
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
