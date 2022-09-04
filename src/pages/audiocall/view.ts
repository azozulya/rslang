import AudiocallGame from '../../components/audiocall';
import {
  IAudioCallWord,
  IGameStatistic,
  IWord,
} from '../../interfaces/interfaces';
import {
  GROUP_LIST,
  TOTAL_WORDS,
  WORDS_PER_PAGE,
  DICTIONARY_KEY,
  URL_FOR_STATIC,
  AUDIOCALL_COUNT_WORDS,
} from '../../utils/constants';
import create from '../../utils/createElement';
import { getLocalStorage } from '../../utils/localStorage';
import {
  animatedCircleProgressBar,
  generateIndex,
  isFromDictionaryPage,
  isStartPage,
} from '../../utils/utils';
import AudioIcon from '../../assets/img/audio_sprite.svg';

class AudioCallView {
  isMenuLink = true;

  private gameContainer: HTMLElement;

  private levels: HTMLInputElement[] = [];

  private startScreen?: HTMLElement;

  private resultScreen?: HTMLElement;

  private gameScreen?: HTMLElement;

  private startBtn?: HTMLButtonElement;

  private isFromDictionary: boolean;

  private onGetWords?: (
    level: number,
    page: number
  ) => Promise<IAudioCallWord[] | null>;

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
    this.gameContainer = create({ tagname: 'section', class: 'audiocall' });

    this.gameScreen = create({
      tagname: 'div',
      class: 'audiocall__content',
      text: '<h3 class="audiocall-title">Аудиовызов</h3>',
    });
    this.resultScreen = create({ tagname: 'div', class: 'game__result' });
  }

  bindGetWords(
    handler: (level: number, page: number) => Promise<IAudioCallWord[] | null>
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

  private createGameScreen(wordsList: IAudioCallWord[]) {
    if (!wordsList) {
      this.gameScreen?.insertAdjacentHTML(
        'afterbegin',
        'Что-то пошло не так...'
      );
      return;
    }

    const game = new AudiocallGame(
      wordsList,
      this.stopGame,
      this.onUpdateUserWord
    );

    this.gameScreen?.append(game.init());
  }

  draw() {
    this.startScreen = this.createStartScreen();
    this.gameContainer.append(this.startScreen);

    return this.gameContainer;
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
    const container = create({ tagname: 'div', class: 'audiocall__start' });

    container.innerHTML = `
      <h3>Аудиовызов</h3>
      <p class="game__description">
        Тренировка улучшает восприятие речи на слух.
        <br>
        Прослушай и угадай значение ${AUDIOCALL_COUNT_WORDS} слов.
      </p>      
    `;

    this.startBtn = this.createStartBtn();

    if (this.isMenuLink || isStartPage()) {
      container.append(this.drawLevels());
    }

    container.append(this.startBtn);

    return container;
  }

  // eslint-disable-next-line max-lines-per-function
  private stopGame = (state: IGameStatistic, wordsList: IAudioCallWord[]) => {
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

      const { newWords, learnedWords, winStreak, rightAnswer, wrongAnswer } =
        totalState;

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
        console.log('clean container');
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

  private drawWordsResult(wordsList: IAudioCallWord[]) {
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

  private drawWordsListResult = (wordsList: IAudioCallWord[]) => {
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

  private createAudioIcon(audioLink: string, audioElement: HTMLAudioElement) {
    const audioFragment = document.createDocumentFragment();
    const svgIcon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    svgIcon.classList.add('audio-icon');
    svgIcon.innerHTML = `<use xlink:href="${AudioIcon}#audio"></use>`;

    svgIcon.addEventListener('click', () => {
      const audio = audioElement;
      audio.src = URL_FOR_STATIC + audioLink;
      audio.play();
    });

    audioFragment.append(svgIcon);

    return audioFragment;
  }

  private drawLevels() {
    const levels = GROUP_LIST;
    const levelsContainer = create({
      tagname: 'div',
      class: 'game__levels',
    });
    const title = create({ tagname: 'h4', text: 'Выбери уровень:' });

    levels.forEach((levelName, idx) => {
      const level = levelName.substring(0, 2);
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

    this.createGameScreen(wordsList); // , group, pageNum);

    if (this.gameScreen) this.gameContainer.append(this.gameScreen);
  };

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
}

export default AudioCallView;
