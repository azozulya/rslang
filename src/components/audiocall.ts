import { IAudioCallWord, IGameStatistic } from '../interfaces/interfaces';
import { AUDIOCALL_COUNT_OPTIONS, URL_FOR_STATIC } from '../utils/constants';
import create from '../utils/createElement';
import { playAudio } from '../utils/utils';

class AudiocallGame {
  private wordsInGame:IAudioCallWord[];

  private currentWordIndex: number;

  private gameContainer!: HTMLElement;

  private wordsOptionsGroup!: HTMLElement;

  private play!: HTMLElement;

  private audioTrack!: HTMLAudioElement;

  private currentWord!: IAudioCallWord;

  private isAnswerOpen!: boolean;

  private audioRightElement: HTMLAudioElement;

  private audioWrongElement: HTMLAudioElement;

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

  constructor(
    wordsList:IAudioCallWord[],

    private onStopGameHandler: (
      state: IGameStatistic,
      wordsList: IAudioCallWord[]
    ) => void,

    private updateWordState?: (wordId: string, isRightAnswer: boolean) => void,
  ) {
    this.gameContainer = create({ tagname: 'div', class: 'container' });
    this.gameContainer.addEventListener('click', (e) => this.handleEvent(e));
    document.addEventListener('keydown', (e) => this.handleKeyboardEvent(e));

    this.wordsInGame = wordsList;
    this.currentWordIndex = 0;

    this.audioRightElement = new Audio('../../assets/audio/rightAnswer.mp3');
    this.audioWrongElement = new Audio('../../assets/audio/wrongAnswer.mp3');

    this.renderGame();
  }

  private handleEvent(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('audiocall__play')) this.audioTrack.play();
    if (element.classList.contains('audiocall__words-item')) this.viewAnswer(Number(element.id));

    if (element.classList.contains('audiocall__next')) {
      if (this.isAnswerOpen) this.renderGame();
      else this.viewAnswer(Number(element.id));
    }
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'Enter') {
      this.audioTrack.play();
    }

    if (key === 'ArrowRight') {
      if (this.isAnswerOpen) this.renderGame();
      else this.viewAnswer(6);
    }

    for (let i = 1; i <= AUDIOCALL_COUNT_OPTIONS; i += 1) {
      if (key === `${i}`) this.viewAnswer(Number(key) - 1);
    }
  }

  private viewAnswer(id: number) {
    this.isAnswerOpen = true;
    this.checkAnswer(id);
    this.renderAnswer();
    this.changeOptionWords(id);
    this.changeButton();
  }

  private checkAnswer(id: number) {
    if (id === this.currentWord.answerIndex) {
      playAudio(this.audioRightElement);
      this.currentWord.isRightAnswer = true;
      this.addRightAnswer();
      this.updateWordState?.(this.currentWord.id, true);
    } else {
      playAudio(this.audioWrongElement);
      this.currentWord.isRightAnswer = false;
      this.addWrongAnswer();
      this.updateWordState?.(this.currentWord.id, false);
    }
  }

  private changeOptionWords(id: number) {
    const optionWords = [...this.wordsOptionsGroup.children];

    optionWords.forEach((word) => {
      if (Number(word.id) === this.currentWord.answerIndex) word.classList.add('right-answer');
      else if (Number(word.id) !== id) word.classList.add('not-answer');
      else word.classList.add('wrong-answer');
    });
  }

  private changeButton() {
    const gameBtn = <HTMLElement>document.getElementById('audicallNext');
    gameBtn.textContent = 'Дальше →';
  }

  init() {
    return this.gameContainer;
  }

  stopGame() {
    this.onStopGameHandler(this.gameState, this.wordsInGame);

    this.currentWordIndex = 0;
    this.gameState = { ...this.defaultState };
    this.gameContainer.remove();
  }

  private async addRightAnswer() {
    let {
      rightAnswer, seriesOfRightAnswer, winStreak,
    } = this.gameState;

    rightAnswer += 1;
    seriesOfRightAnswer += 1;

    if (seriesOfRightAnswer > winStreak) {
      winStreak = seriesOfRightAnswer;
    }

    this.updateState({
      rightAnswer,
      seriesOfRightAnswer,
      winStreak,
    });
  }

  private addWrongAnswer() {
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

  // eslint-disable-next-line max-lines-per-function
  renderGame() {
    if (this.currentWordIndex === this.wordsInGame.length) {
      this.stopGame();
    }
    while (this.gameContainer.firstChild) {
      this.gameContainer.removeChild(this.gameContainer.firstChild);
    }

    this.currentWord = this.wordsInGame[this.currentWordIndex];

    this.isAnswerOpen = false;

    const audiocall = create({
      tagname: 'div',
      class: 'audiocall__screen',
      parent: this.gameContainer,
    });
    const audiocallPlayer = create({
      tagname: 'div',
      class: 'audiocall__player',
      id: 'audiocallPlayer',
      parent: audiocall,
    });
    const audioPlay = create({
      tagname: 'div',
      class: 'audiocall__play',
      parent: audiocallPlayer,
    });
    this.play = audioPlay;
    const audioTrack = <HTMLAudioElement>create({
      tagname: 'audio',
      class: 'audiocall__track',
      id: 'audiocallPlayer',
      parent: audioPlay,
    });
    audioTrack.src = `${URL_FOR_STATIC}${this.currentWord.audio}`;
    audioTrack.preload = 'auto';
    this.audioTrack = audioTrack;

    const wordsOptionsGroup = create({
      tagname: 'div',
      class: 'audiocall__words-group',
      parent: audiocall,
    });
    this.wordsOptionsGroup = wordsOptionsGroup;
    this.currentWord.optionsTranslate.forEach((option, index) => {
      create({
        tagname: 'div',
        class: 'audiocall__words-item',
        parent: wordsOptionsGroup,
        id: `${index}`,
        text: `${index + 1} ${option}`,
      });
    });
    this.wordsOptionsGroup.append(
      this.audioRightElement,
      this.audioWrongElement,
    );

    create({
      tagname: 'div',
      class: 'audiocall__next',
      id: 'audicallNext',
      parent: audiocall,
      text: 'Не знаю →',
    });
  }

  renderAnswer() {
    const audiocallPlayer = <HTMLElement>document.getElementById('audiocallPlayer');
    while (audiocallPlayer.firstChild) {
      audiocallPlayer.removeChild(audiocallPlayer.firstChild);
    }

    const imageAnswer = create({
      tagname: 'div',
      class: 'audiocall__image',
      parent: audiocallPlayer,
    });
    imageAnswer.style.backgroundImage = `url(${URL_FOR_STATIC}${this.currentWord.image})`;
    const audioAnswer = create({
      tagname: 'div',
      class: 'audiocall__answer',
      parent: audiocallPlayer,
    });
    const audioPlay = audioAnswer.appendChild(this.play);
    audioPlay.classList.add('play_answer');

    create({
      tagname: 'div',
      class: 'audiocall__answer_word',
      parent: audioAnswer,
      text: `${this.currentWord.word}`,
    });
    this.currentWordIndex += 1;
  }
}

export default AudiocallGame;
