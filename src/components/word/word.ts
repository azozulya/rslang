/* eslint-disable max-lines-per-function */
import Api from '../api/api';
import { IWord, IWordApp, IUserWord } from '../interfaces';
import create from '../utils/createElement';
import { getLocalStorage } from '../utils/LocalStorage';
import './word.scss';

class Word implements IWordApp {
  word: IWord;

  constructor(word: IWord) {
    this.word = word;
  }

  addHandlers(word: HTMLElement) {
    word.addEventListener('click', (e) => this.defineTarget(e));
  }

  defineTarget(event:Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.listenWord();
    if (element.classList.contains('word__hard')) this.addToHardWord();
    // if (element.classList.contains('word__hard')) this.addToHardWord();
    // }
  }

  listenWord() {
    console.log(this.word.id);
  }

  async addToHardWord() {
    const api = Api.getInstance();
    const token = localStorage.getItem('token');
    const { userId } : { userId: string } = getLocalStorage('RSLang_Auth'); // TODO error no auth
    // const optional: { wordID: string } = { wordID: this.word.id };
    const word: IUserWord = { difficulty: 'hard' };
    if (token) {
      api.createUserWord(this.word.id, word);
    }
  }

  checkWord() {

  }

  draw() {
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    const wordInDictionary = create({
      tagname: 'div',
      class: 'word',
      parent: dictionary,
      id: `${this.word.id}`,
    });
    const wordImage = <HTMLElement>create({
      tagname: 'div',
      class: 'word__image',
      parent: wordInDictionary,
    });
    wordImage.style.backgroundImage = `url(http://127.0.0.1:3000/${this.word.image})`; // TODO change url after deploy backend
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
    create({
      tagname: 'div',
      class: 'word__audio',
      parent: wordItem,
    });
    const wordMarks = create({
      tagname: 'div',
      class: 'word__marks',
      parent: wordHeader,
    });
    create({
      tagname: 'div',
      class: 'word__hard',
      parent: wordMarks,
    });
    create({
      tagname: 'div',
      class: 'word__learned',
      parent: wordMarks,
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
    // TODO Check user login (need separate method)
    const wordProgress = create({ tagname: 'div', class: 'word__progress', parent: wordDescription });
    const wordSprint = create({
      tagname: 'div', class: 'word__sprint', parent: wordProgress, text: 'Спринт',
    });
    create({
      tagname: 'div', class: 'word__sprint_score', parent: wordSprint, text: '3/10',
    });
    const wordAudio = create({
      tagname: 'div', class: 'word__sprint', parent: wordProgress, text: 'Аудиовызов',
    });
    create({
      tagname: 'div', class: 'word__sprint_score', parent: wordAudio, text: '17/40',
    });
    this.addHandlers(wordInDictionary);
  }
}
export default Word;
