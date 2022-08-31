import { IWord } from '../interfaces/interfaces';
import create from '../utils/createElement';
import words from '../utils/testWord';

class AudiocallGame {
  private wordsInGame:IWord[];

  private currentWordIndex: number;

  private TOTAL_WORDS_AUDIOCALL: number;

  private wordsList!: HTMLElement;

  private play!: HTMLElement;

  private audioTrack!: HTMLAudioElement;

  constructor() {
    this.wordsInGame = words;
    this.currentWordIndex = 0;
    this.TOTAL_WORDS_AUDIOCALL = 5;
  }

  handleEvent(event:Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('audiocall__play')) this.playWord();
    if (element.classList.contains('audiocall__words-item')) this.viewAnswer();
    if (element.classList.contains('audiocall__next')) this.goToNextWord();
  }

  goToNextWord() {
    // statistic?
    this.renderGame();
  }

  playWord() {
    this.audioTrack.play();
  }

  viewAnswer() {
    this.renderAnswer();
    this.changeWords();
    this.changeButton();
  }

  changeWords() {
    const gameWords = [...this.wordsList.children];
    gameWords.forEach((word, index) => {
      if (index !== 0) word.classList.add('wrong-answer');
      else word.classList.add('right-answer');
    });
  }

  changeButton() {
    const gameBtn = <HTMLElement>document.getElementById('audicallNext');
    gameBtn.textContent = 'Дальше';
  }

  // eslint-disable-next-line max-lines-per-function
  renderGame() {
    const container = create({
      tagname: 'div',
      class: 'container',
    });
    const audiocall = create({
      tagname: 'div',
      class: 'audiocall',
      parent: container,
    });
    create({
      tagname: 'h4',
      class: 'audiocall__name',
      parent: audiocall,
      text: 'Аудиовызов',
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
      id: 'audiocallPlayer',
      parent: audiocallPlayer,
    });
    this.play = audioPlay;
    const audioTrack = <HTMLAudioElement>create({
      tagname: 'audio',
      class: 'audiocall__track',
      id: 'audiocallPlayer',
      parent: audioPlay,
    });
    audioTrack.src = 'http://127.0.0.1:3000/files/01_0008.mp3'; // TODO change url
    audioTrack.preload = 'auto';
    this.audioTrack = audioTrack;

    const wordsList = create({
      tagname: 'div',
      class: 'audiocall__words-list',
      parent: audiocall,
    });
    this.wordsList = wordsList;
    for (let i = 0; i < this.TOTAL_WORDS_AUDIOCALL; i += 1) {
      create({
        tagname: 'div',
        class: 'audiocall__words-item',
        parent: wordsList,
        text: `${i + 1} ${this.wordsInGame[i].wordTranslate}`, // add method for random word
      });
    }
    create({
      tagname: 'div',
      class: 'audiocall__next',
      id: 'audicallNext',
      parent: audiocall,
      text: 'Не знаю',
    });
    container.addEventListener('click', (e) => this.handleEvent(e));

    return container;
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
    imageAnswer.style.backgroundImage = `url(http://127.0.0.1:3000/${this.wordsInGame[1].image})`;
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
      text: `${this.wordsInGame[0].word}`, // TODO change to correct answer
    });
  }
}

export default AudiocallGame;
