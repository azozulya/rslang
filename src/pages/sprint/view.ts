import SprintGame from '../../components/sprint';
import { IGameWord, IUserWord } from '../../interfaces/interfaces';
import { GAME_TIMER } from '../../utils/constants';
import create from '../../utils/createElement';
import { isFromDictionaryPage } from '../../utils/utils';

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

  private onGetWordsByLevel?: (level: number) => Promise<IGameWord[]>;

  private onGetWordsFromDictionary?: (level: number) => Promise<IGameWord[]>;

  private onUpdateUserWord?: (wordId: string, isRightAnswer: boolean) => void;

  private isFromDictionary: boolean;

  constructor() {
    this.isFromDictionary = isFromDictionaryPage();
    this.gameContainer = create({ tagname: 'section', class: 'game' });
    this.startScreen = this.createStartScreen();
    this.gameScreen = create({ tagname: 'div', class: 'game__sprint' });
    this.resultScreen = create({ tagname: 'div', class: 'game__result' });
    console.log('1from dictionary: ', this.isFromDictionary);
  }

  private drawLevels() {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelsContainer = create({
      tagname: 'div',
      class: 'game__levels',
    });
    const title = create({ tagname: 'h4', text: 'Выбери уровень:' });

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

    const levelsSection = document.createDocumentFragment();
    levelsSection.append(title, levelsContainer);

    return levelsSection;
  }

  private createStartBtn() {
    const startBtn = <HTMLButtonElement>(
      create({ tagname: 'button', class: 'btn' })
    );
    startBtn.classList.add('btn--blue');
    startBtn.disabled = !this.isFromDictionary;
    startBtn.innerText = 'Начать';

    startBtn.addEventListener('click', this.onStartClickHandler);
    return startBtn;
  }

  private createStartScreen(): HTMLElement {
    const container = create({ tagname: 'div', class: 'game__start' });

    container.innerHTML = `
      <h3>Спринт</h3>
      <p class="game__description">
        Спринт - тренировка на скорость.<br> Попробуй угадать как можно больше слов за ${GAME_TIMER} секунд.
      </p>
    `;

    this.startBtn = this.createStartBtn();

    if (!this.isFromDictionary) {
      container.append(this.drawLevels());
    }

    container.append(this.startBtn);

    return container;
  }

  private createGameScreen(wordsList: IGameWord[]) {
    const game = new SprintGame(
      wordsList,
      this.stopGame,
      this.onUpdateUserWord,
    );

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
    this.onGetWordsByLevel = handler;
  }

  bindUpdateUserWord(
    handler: (wordId: string, isRightAnswer: boolean) => void,
  ) {
    this.onUpdateUserWord = handler;
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
      // let wordsList;

      // if (this.isFromDictionary) {
      // } else {
      const wordsList = await this.onGetWordsByLevel?.(
        Number(this.startBtn?.dataset.level),
      );
      // }

      if (wordsList) {
        this.createGameScreen(wordsList);
      }

      this.gameContainer.append(this.gameScreen);
    }
  };
}

export default GamesView;
