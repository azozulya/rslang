import { IWord, IWordApp } from '../../interfaces/interfaces';
import { URL_FOR_STATIC } from '../../utils/constants';
import create from '../../utils/createElement';

class Word implements IWordApp {
  word: IWord;

  constructor(word: IWord) {
    this.word = word;
  }

  addHandlers(word: HTMLElement) {
    word.addEventListener('click', (e) => this.defineTarget(e));
  }

  defineTarget(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.playAudio(element);
  }

  playAudio(wordAudio: HTMLElement) {
    const tracks = [
      `${URL_FOR_STATIC}${this.word.audio}`,
      `${URL_FOR_STATIC}${this.word.audioMeaning}`,
      `${URL_FOR_STATIC}${this.word.audioExample}`,
    ];
    const player = <HTMLAudioElement>(
      wordAudio.querySelector('.word__audio_player')
    );
    let currentTrack = 0;
    player.src = tracks[currentTrack];
    player.play();
    player.addEventListener('ended', () => {
      currentTrack += 1;
      if (currentTrack < tracks.length) {
        player.src = tracks[currentTrack];
        player.play();
      }
    });
  }

  // eslint-disable-next-line max-lines-per-function
  async draw() {
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    const wordInDictionary = create({
      tagname: 'div',
      class: 'word',
      parent: dictionary,
      id: `${this.word.id}`,
    });
    wordInDictionary.classList.add(`word_group-${this.word.group}`);
    const wordImage = <HTMLElement>create({
      tagname: 'div',
      class: 'word__image',
      parent: wordInDictionary,
    });
    wordImage.style.backgroundImage = `url(${URL_FOR_STATIC}${this.word.image})`;
    const wordDescription = create({
      tagname: 'div',
      class: 'word__description',
      parent: wordInDictionary,
    });
    const wordHeader = create({
      tagname: 'div',
      class: 'word__header',
      parent: wordDescription,
    });
    const wordItem = create({
      tagname: 'div',
      class: 'word__item',
      parent: wordHeader,
    });
    create({
      tagname: 'div',
      class: 'word__name',
      parent: wordItem,
      text: `${this.word.word}`,
    });
    create({
      tagname: 'div',
      class: 'word__transcription',
      parent: wordItem,
      text: `${this.word.transcription}`,
    });
    const wordAudio = <HTMLElement>create({
      tagname: 'div',
      class: 'word__audio',
      parent: wordItem,
    });
    create({
      tagname: 'audio',
      class: 'word__audio_player',
      parent: wordAudio,
    });
    create({
      tagname: 'div',
      class: 'word__translate',
      parent: wordDescription,
      text: `${this.word.wordTranslate}`,
    });
    const wordText = create({
      tagname: 'div',
      class: 'word__text',
      parent: wordDescription,
    });
    create({
      tagname: 'div',
      class: 'word__meaning',
      parent: wordText,
      text: `${this.word.textMeaning}`,
    });
    create({
      tagname: 'div',
      class: 'word__meaning_translate',
      parent: wordText,
      text: `${this.word.textMeaningTranslate}`,
    });
    create({
      tagname: 'div',
      class: 'word__example',
      parent: wordText,
      text: `${this.word.textExample}`,
    });
    create({
      tagname: 'div',
      class: 'word__example_translate',
      parent: wordText,
      text: `${this.word.textExampleTranslate}`,
    });
    this.addHandlers(wordInDictionary);
  }
}
export default Word;
