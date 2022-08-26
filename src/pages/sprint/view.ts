import SprintGame from '../../components/sprint';
import { IGameWord } from '../../interfaces/interfaces';
import create from '../../utils/createElement';

class GamesView {
  private gameContainer: HTMLElement;

  private levels: HTMLInputElement[] = [];

  private gameState = {
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
    this.gameScreen = create({ tagname: 'div', class: 'game__sprint' });
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
      levelLabel.classList.add(`game__level--${level}`);
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
    const game = new SprintGame(wordsList, this.stopGame);

    this.gameScreen?.append(game.render());
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

  private stopGame = () => {
    this.gameContainer.innerText = '';

    if (this.resultScreen) {
      console.log('result screen');
      this.gameContainer.append(this.resultScreen);
      this.resultScreen.append(JSON.stringify(this.gameState));

      this.resultScreen.insertAdjacentHTML(
        'beforeend',
        `
        <div>
          <button class="btn" data-page="games">Сыграть еще раз</button>
          <button class="btn" data-page="dictionary">Перейти в учебник</button>
        </div>

      `,
      );
    }
  };

  draw() {
    if (this.startScreen) this.gameContainer.append(this.startScreen);
    return this.gameContainer;
  }

  bindGetWords(handler: (level: number) => Promise<IGameWord[]>) {
    this.onGetWords = handler;
  }

  private onLevelClickHandler = async () => {
    const currentLevel = this.levels.find((level) => level.checked);

    if (this.startBtn && currentLevel) {
      this.startBtn.disabled = false;
      this.startBtn.dataset.level = currentLevel.value;
      this.setActiveLevel(currentLevel);
    }
  };

  private setActiveLevel(current: HTMLInputElement): void {
    this.levels.forEach((level) => level.parentElement?.classList.remove('game__level--active'));
    current.parentElement?.classList.add('game__level--active');
  }

  private onStartClickHandler = async () => {
    this.gameContainer.innerText = '';

    if (this.gameScreen) {
      const wordsList = await this.onGetWords?.(
        Number(this.startBtn?.dataset.level),
      );

      if (wordsList) {
        this.createGameScreen(wordsList);
      }

      this.gameContainer.append(this.gameScreen);
    }
  };
}

export default GamesView;
