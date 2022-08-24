import { IGameWord } from '../interfaces';
import create from '../utils/createElement';

class GamesView {
  private gameContainer: HTMLElement;

  private levels: HTMLInputElement[] = [];

  private wordsElements?: HTMLElement[];

  private gameSteps?: HTMLElement;

  private gameStat = {
    score: 0,
    learnedWords: 0,
    rightAnswer: 0,
    wrongAnswer: 0,
    seriesOfRightAnswer: 0,
    maxSeriesOfRightAnswer: 0,
  };

  private startScreen?: HTMLElement;

  private gameScreen?: HTMLElement;

  private resultScreen?: HTMLElement;

  private startBtn?: HTMLButtonElement;

  private onGetWords?: (level: number) => Promise<IGameWord[]>;

  constructor() {
    this.gameContainer = create({ tagname: 'section', class: 'game' });
    this.startScreen = this.createStartScreen();
    this.gameScreen = create({ tagname: 'div', class: 'game__game' });
    this.resultScreen = create({ tagname: 'div', class: 'game__result' });
  }

  private drawLevels() {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelsContainer = create({ tagname: 'div', class: 'game__levels' });

    levels.forEach((level, idx) => {
      const levelLabel = create({
        tagname: 'label',
        class: 'game__level',
        text: level,
      });
      const levelInput = <HTMLInputElement>(
        create({ tagname: 'input', class: 'game__level--inp' })
      );

      levelInput.value = idx.toString();
      levelInput.type = 'radio';
      levelInput.name = 'gameLevel';

      levelLabel.append(levelInput);
      levelsContainer.append(levelLabel);
      this.levels.push(levelInput);
    });

    levelsContainer.addEventListener('click', this.onLevelClickHandler);
    return levelsContainer;
  }

  private createStartBtn() {
    const startBtn = <HTMLButtonElement>(
      create({ tagname: 'button', class: 'btn' })
    );
    startBtn.classList.add('btn--blue');
    startBtn.disabled = true;
    startBtn.innerText = 'Начать';

    startBtn.addEventListener('click', this.onStartClickHandler);
    return startBtn;
  }

  private createStartScreen(): HTMLElement {
    const container = create({ tagname: 'div', class: 'game__start' });

    container.innerHTML = `<h3>Спринт</h3>
    <p class="game__description">
    Спринт - тренировка на скорость.<br> Попробуй угадать как можно больше слов за 30 секунд.
    </p>
    <h4>Выбери уровень:</h4>`;

    this.startBtn = this.createStartBtn();

    container.append(this.drawLevels(), this.startBtn);

    return container;
  }

  private createGameScreen(wordsList: IGameWord[]) {
    this.drawWords(wordsList);

    this.wordsElements?.[0].classList.add('game__word--active');

    const yesBtn = create({ tagname: 'button', class: 'btn', text: 'Верно' });
    const noBtn = create({ tagname: 'button', class: 'btn', text: 'Неверно' });

    noBtn.addEventListener('click', this.onNoBtnClickHandler);
    yesBtn.addEventListener('click', this.onYesBtnClickHandler);

    this.gameSteps = create({ tagname: 'div' });

    this.gameScreen?.append(this.gameSteps, noBtn, yesBtn);
  }

  private saveResult = () => {
    const resultObj = {
      game: 'sprint',
      date: Date.now(),
      score: 220,
      rightAnswer: 10,
      wrongAnswer: 6,
      learnedWords: 4,
      answerSeries: 8,
    };

    console.log(resultObj);
  };

  private onNoBtnClickHandler = () => {
    if (this.checkAnswer('false')) {
      console.log('no btn click, right answer');
      this.gameStat.rightAnswer += 1;
      this.gameStat.seriesOfRightAnswer += 1;
      this.gameStat.score += 10;
    } else {
      this.gameStat.wrongAnswer += 1;
      const { maxSeriesOfRightAnswer, seriesOfRightAnswer } = this.gameStat;
      if (seriesOfRightAnswer > maxSeriesOfRightAnswer) {
        this.gameStat.maxSeriesOfRightAnswer = seriesOfRightAnswer;
        this.gameStat.seriesOfRightAnswer = 0;
      }
      console.log('no btn click, wrong answer');
    }

    this.nextWord();
  };

  private onYesBtnClickHandler = () => {
    if (this.checkAnswer('true')) {
      this.gameStat.rightAnswer += 1;
      this.gameStat.seriesOfRightAnswer += 1;
      this.gameStat.score += 10;
      console.log('yes btn click, right answer');
    } else {
      this.gameStat.wrongAnswer += 1;
      const { maxSeriesOfRightAnswer, seriesOfRightAnswer } = this.gameStat;
      if (seriesOfRightAnswer > maxSeriesOfRightAnswer) {
        this.gameStat.maxSeriesOfRightAnswer = seriesOfRightAnswer;
        this.gameStat.seriesOfRightAnswer = 0;
      }
      console.log('yes btn click, wrong answer');
    }

    if (this.gameSteps) {
      this.gameSteps.innerHTML = JSON.stringify(this.gameStat);
    }

    this.nextWord();
  };

  private getCurrentWord() {
    return this.wordsElements?.find((word) => word.classList.contains('game__word--active'));
  }

  private checkAnswer = (userAnswer: string) => {
    const currentWord = this.getCurrentWord();

    return currentWord?.getAttribute('answer') === userAnswer;
  };

  private nextWord() {
    const current = this.getCurrentWord();
    const currentIndex = current?.dataset.index;

    if (Number(currentIndex) + 1 === this.wordsElements?.length) {
      this.stopGame();
      return;
    }

    current?.classList.remove('game__word--active');

    if (currentIndex) {
      const nextWord = this.wordsElements?.[Number(currentIndex) + 1];
      nextWord?.classList.add('game__word--active');

      const path = -1 * (Number(currentIndex) + 1) * 200;

      if (nextWord) nextWord.style.transform = `translateX(${path}px)`;
    }
  }

  private stopGame() {
    this.gameContainer.innerText = '';
    if (this.resultScreen) {
      this.gameContainer.append(this.resultScreen);
      this.resultScreen.append(JSON.stringify(this.gameStat));

      this.resultScreen.insertAdjacentHTML(
        'beforeend',
        `
        <div>
          <button class="btn">Сыграть еще раз</button>
          <button class="btn">Перейти в учебник</button>
        </div>

      `,
      );
    }
  }

  draw() {
    if (this.startScreen) this.gameContainer.append(this.startScreen);
    return this.gameContainer;
  }

  bindGetWords(handler: (level: number) => Promise<IGameWord[]>) {
    this.onGetWords = handler;
  }

  private onLevelClickHandler = async () => {
    const currentLevel = this.levels.find((level) => level.checked);
    console.log('currentLevel: ', currentLevel?.parentElement);

    if (this.startBtn) this.startBtn.disabled = false;

    if (currentLevel) {
      this.setActiveLevel(currentLevel);
      const wordsList = await this.onGetWords?.(Number(currentLevel.value));
      if (wordsList) {
        this.createGameScreen(wordsList);
      }
    }
  };

  private drawWords(wordsList: IGameWord[]) {
    this.wordsElements = wordsList.map(
      ({ word, wordTranslate, pseudoTranslate }, idx) => {
        const wordElement = create({
          tagname: 'div',
          class: 'game__word',
          text: `${word} -> ${pseudoTranslate} [answer: ${wordTranslate}]`,
        });
        wordElement.setAttribute(
          'answer',
          String(wordTranslate === pseudoTranslate),
        );
        wordElement.dataset.index = idx.toString();
        return wordElement;
      },
    );

    const wordFrame = create({ tagname: 'div', class: 'game__frame' });
    const wordsContainer = create({ tagname: 'div', class: 'game__words' });
    wordsContainer.append(...this.wordsElements);
    wordFrame.append(wordsContainer);

    this.gameScreen?.append(wordFrame);
  }

  private setActiveLevel(current: HTMLInputElement): void {
    current.parentElement?.classList.add('game__level--active');
  }

  private onStartClickHandler = () => {
    this.gameContainer.innerText = '';
    if (this.gameScreen) {
      this.gameContainer.append(this.gameScreen);
    }
  };
}

export default GamesView;
