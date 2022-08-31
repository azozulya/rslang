import { IWord } from '../../interfaces/interfaces';
import create from '../../utils/createElement';
import words from '../../utils/testWord';

class AudioCallView {
  wordsInGame:IWord[];

  indexWord: number;

  TOTAL_WORDS_AUDIOCALL: number;

  player!: HTMLAudioElement;

  image!: HTMLElement;

  constructor() {
    this.wordsInGame = words;
    this.indexWord = 0;
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
    console.log('audioplay');
    const audioPlay = <HTMLAudioElement>document.getElementById('audiocallPlayer');
    audioPlay.play();
  }

  viewAnswer() {
    this.viewImage();
    this.changeWords();
  }

  viewImage() {
    this.image.classList.add('audiocall__image_open');
    console.log('image');
    this.image.style.backgroundImage = `url(http://127.0.0.1:3000/${this.wordsInGame[1].image})`;
  }

  changeWords() {

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

    const audiocallPlay = create({
      tagname: 'div',
      class: 'audiocall__play',
      id: 'audiocallPlay',
      parent: audiocall,
    });
    const targetWord = create({
      tagname: 'div',
      class: 'audiocall__target-word',
      parent: audiocallPlay,
    });
    this.image = <HTMLElement>create({
      tagname: 'div',
      class: 'audiocall__image',
      parent: targetWord,
    });
    const audioPlayer = <HTMLAudioElement>create({
      tagname: 'audio',
      class: 'audiocall__player',
      id: 'audiocallPlayer',
      parent: targetWord,
    });
    this.player = audioPlayer;
    this.player.src = 'http://127.0.0.1:3000/files/01_0008.mp3'; // TODO change url
    this.player.preload = 'auto';

    const wordsList = create({
      tagname: 'div',
      class: 'audiocall__words-list',
      parent: audiocall,
    });
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

  /* renderAnswer() {
    const audiocallPlay = <HTMLElement>document.getElementById('audiocallPlay');
    // TODO remove elements

    create({
      tagname: 'div',
      class: 'audiocall__image',
      parent: audiocallPlay,
    });
    const audioAnswer = create({
      tagname: 'div',
      class: 'audiocall__answer',
      parent: audiocallPlay,
    });
    /* create({
      tagname: 'div',
      class: 'audiocall__player',
      id: 'audiocallPlayerAnswer',
      parent: audioAnswer,
    });
    create({
      tagname: 'div',
      class: 'audiocall__answer_word',
      parent: audioAnswer,
      text: `${this.wordsInGame[0].word}`, // TODO change to correct answer
    });
  }
  */
}

export default AudioCallView;
