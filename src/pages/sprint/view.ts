import SprintGame from '../../components/sprint';
import { IGameStatistic, IGameWord } from '../../interfaces/interfaces';
import {
  DICTIONARY_KEY,
  GAME_TIMER,
  TOTAL_WORDS,
  URL_FOR_STATIC,
  WORDS_PER_PAGE,
} from '../../utils/constants';
import create from '../../utils/createElement';
import { getLocalStorage } from '../../utils/localStorage';
import {
  animatedCircleProgressBar,
  generateIndex,
  isFromDictionaryPage,
  isStartPage,
} from '../../utils/utils';

class GamesView {
  isMenuLink = true;

  private gameContainer: HTMLElement;

  private levels: HTMLInputElement[] = [];

  private startScreen?: HTMLElement;

  private gameScreen?: HTMLElement;

  private resultScreen?: HTMLElement;

  private startBtn?: HTMLButtonElement;

  private isFromDictionary: boolean;

  private onGetWords?: (
    level: number,
    page: number
  ) => Promise<IGameWord[] | null>;

  private onUpdateUserWord?: (wordId: string, isRightAnswer: boolean) => void;

  private getGameStatistic?: () => {
    learnedWords: number;
    newWords: number;
  };

  private onSendStatistic?: (
    rightAnswers: number,
    wrongAnswers: number,
    bestSeries: number
  ) => void;

  constructor() {
    this.isFromDictionary = isFromDictionaryPage();
    this.gameContainer = create({ tagname: 'section', class: 'game' });

    this.gameScreen = create({
      tagname: 'div',
      class: 'game__sprint',
      text: '<h3 class="game__sprint-title">Спринт</h3>',
    });
    this.resultScreen = create({ tagname: 'div', class: 'game__result' });
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
    startBtn.classList.add('btn--blue', 'game__start-btn');
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
        Спринт - тренировка на скорость.<br> Попробуй угадать как можно больше слов за&nbsp;${GAME_TIMER}&nbsp;секунд.
      </p>      
    `;

    this.startBtn = this.createStartBtn();

    if (this.isMenuLink || isStartPage()) {
      container.append(this.drawLevels());
    }

    container.append(this.startBtn);

    return container;
  }

  private createGameScreen(
    wordsList: IGameWord[],
    group: number,
    page: number
  ) {
    if (!wordsList) {
      this.gameScreen?.insertAdjacentHTML(
        'afterbegin',
        'Что-то пошло не так...'
      );
      return;
    }

    const game = new SprintGame(
      wordsList,
      group,
      page,
      this.stopGame,
      this.onUpdateUserWord,
      this.onGetWords
    );

    this.gameScreen?.append(game.render());
  }

  // eslint-disable-next-line max-lines-per-function
  private stopGame = (state: IGameStatistic, wordsList: IGameWord[]) => {
    this.gameContainer.innerText = '';

    const {
      score,
      learnedWords,
      newWords,
      rightAnswer,
      wrongAnswer,
      winStreak,
    } = { ...state, ...this.getGameStatistic?.() };

    this.onSendStatistic?.(rightAnswer, wrongAnswer, winStreak);

    console.log('stopGame, gameStat: ', {
      ...state,
      ...this.getGameStatistic?.(),
    });

    if (this.resultScreen) {
      this.gameContainer.append(this.resultScreen);

      this.resultScreen.innerText = '';
      this.resultScreen.insertAdjacentHTML(
        'afterbegin',
        '<h3 class="game__result-title">Результат</h3>'
      );

      const statContainer = create({
        tagname: 'div',
        class: 'game__statistic',
      });

      const totalAnswers = rightAnswer + wrongAnswer;
      const rightAnswersInPercent =
        Math.floor((rightAnswer * 100) / totalAnswers) || 0;

      statContainer.append(animatedCircleProgressBar(rightAnswersInPercent));

      statContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="game__statistic-text">
              Счет: ${score}<br>
              Новые слова: ${newWords}<br>
              Изученные слова: ${learnedWords}<br>
              Серия правильных ответов: ${winStreak}<br>
            </div>`
      );

      this.resultScreen.append(
        statContainer,
        this.drawWordsResult(wordsList),
        this.drawBtns()
      );
    }
  };

  private drawBtns() {
    const playAgainBtn = create({
      tagname: 'button',
      class: 'btn',
      text: 'Сыграть еще раз',
    });
    playAgainBtn.classList.add('btn--blue', 'game__result-btn');
    playAgainBtn.addEventListener('click', () => {
      if (this.startScreen) {
        this.gameContainer.innerText = '';
        this.gameContainer.append(this.startScreen);
      }
    });

    const goToDictionaryBtn = create({
      tagname: 'button',
      class: 'btn',
      text: 'Перейти в учебник',
    });
    goToDictionaryBtn.classList.add('btn--blue', 'game__result-btn');
    goToDictionaryBtn.dataset.page = 'dictionary';

    const btnsContainer = create({
      tagname: 'div',
      class: 'game__result-btns',
    });
    btnsContainer.append(playAgainBtn, goToDictionaryBtn);

    return btnsContainer;
  }

  private drawWordsResult(wordsList: IGameWord[]) {
    const wordsResult = create({ tagname: 'div', class: 'game__result-words' });

    const wrongAnswer = wordsList.filter(
      (word) =>
        Object.prototype.hasOwnProperty.call(word, 'isRightAnswer') &&
        !word.isRightAnswer
    );
    const rightAnswers = wordsList.filter((word) => word.isRightAnswer);

    wordsResult.innerHTML = `Ошибок: <span class="errors-number">${wrongAnswer.length}</span>`;
    wordsResult.append(this.drawWordsListResult(wrongAnswer));

    wordsResult.insertAdjacentHTML(
      'beforeend',
      `Знаю: <span class="right-number">${rightAnswers.length}</span>`
    );
    wordsResult.append(this.drawWordsListResult(rightAnswers));

    return wordsResult;
  }

  private createAudioIcon(audioLink: string, audioElement: HTMLAudioElement) {
    const audioFragment = document.createDocumentFragment();
    const svgIcon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    svgIcon.classList.add('audio-icon');
    svgIcon.innerHTML =
      '<use xlink:href="../../assets/img/audio_sprite.svg#audio"></use>';

    svgIcon.addEventListener('click', () => {
      const audio = audioElement;
      audio.src = URL_FOR_STATIC + audioLink;
      audio.play();
    });

    audioFragment.append(svgIcon);

    return audioFragment;
  }

  private drawWordsListResult = (wordsList: IGameWord[]) => {
    const wordsContainer = create({ tagname: 'ul', class: 'words-list' });
    const audio = new Audio();

    wordsContainer.append(audio);

    wordsList.forEach((word) => {
      const wordElement = create({ tagname: 'li', class: 'words-list__item' });
      const audioIcon = this.createAudioIcon(word.audio, audio);

      wordElement.append(audioIcon);

      wordElement.insertAdjacentHTML(
        'beforeend',
        `<b>${word.word}</b>&nbsp;—&nbsp;${word.wordTranslate}`
      );
      wordsContainer.append(wordElement);
    });

    return wordsContainer;
  };

  draw() {
    this.startScreen = this.createStartScreen();
    this.gameContainer.append(this.startScreen);

    return this.gameContainer;
  }

  bindGetWords(
    handler: (level: number, page: number) => Promise<IGameWord[] | null>
  ) {
    this.onGetWords = handler;
  }

  bindUpdateUserWord(
    handler: (wordId: string, isRightAnswer: boolean) => void
  ) {
    this.onUpdateUserWord = handler;
  }

  bindGetGameStatistic(
    handler: () => { learnedWords: number; newWords: number }
  ) {
    this.getGameStatistic = handler;
  }

  bindSendStatistic(
    handler: (
      rightAnswers: number,
      wrongAnswers: number,
      bestSeries: number
    ) => void
  ) {
    this.onSendStatistic = handler;
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
    this.levels.forEach((level) =>
      level.parentElement?.classList.remove('game__level--active')
    );
    current.parentElement?.classList.add('game__level--active');
  }

  private onStartClickHandler = async () => {
    this.gameContainer.innerText = '';
    let group = 0;
    let pageNum = 0;

    if (this.isMenuLink || isStartPage()) {
      group = Number(this.startBtn?.dataset.level);
      pageNum = generateIndex(TOTAL_WORDS / WORDS_PER_PAGE);
    } else if (isFromDictionaryPage()) {
      const storageObj = getLocalStorage<{ page: number; group: number }>(
        DICTIONARY_KEY
      );

      group = storageObj ? storageObj.group : 0;
      pageNum = storageObj ? storageObj.page : 0;
    }

    const wordsList = await this.onGetWords?.(group, pageNum);

    if (!wordsList) return;

    this.createGameScreen(wordsList, group, pageNum);

    if (this.gameScreen) this.gameContainer.append(this.gameScreen);
  };
}

export default GamesView;
