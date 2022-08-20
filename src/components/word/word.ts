/* eslint-disable max-lines-per-function */
import Api from '../api/api';
import { IWord, IWordApp, IUserWord } from '../interfaces';
import create from '../utils/createElement';
import './word.scss';

class Word implements IWordApp {
  word: IWord;

  api: Api;

  constructor(word: IWord) {
    this.word = word;
    this.api = Api.getInstance();
  }

  addHandlers() {
    const dictionaryWords = <HTMLElement>document.getElementById('dictionaryWords');
    dictionaryWords.addEventListener('click', (e:Event) => this.defineTarget(e));
  }

  defineTarget(event:Event) {
    const element = <HTMLElement>event.target;
    if (element.closest('.word')) {
      const word = <HTMLElement>element.closest('.word');
      if (element.classList.contains('word__audio')) this.listenWord(word.id);
    // if (element.classList.contains('word__hard')) this.addToHardWord(word.id);
      // if (element.classList.contains('word__hard')) this.addToHardWord(word.id);
    }
  }

  listenWord(wordId:string) {
    console.log(wordId);
  }

 /* addToHardWord(wordId:string) {
    const userId = '1111';
    const word: IUserWord = { difficulty: true, wordId: wordId};
    this.api.createUserWord();
  }
  */

  draw() {
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    const wordInDictionary = create({
      tagname: 'div', class: 'word', parent: dictionary, id: `${this.word.id}`,
    });
    const wordImage = <HTMLElement>create({ tagname: 'div', class: 'word__image', parent: wordInDictionary });
    wordImage.style.backgroundImage = `url(http://127.0.0.1:3000/${this.word.image})`; // TODO change url after deploy backend
    const wordDescription = create({
      tagname: 'div', class: 'word__description', parent: wordInDictionary,
    });
    const wordHeader = create({ tagname: 'div', class: 'word__header', parent: wordDescription });
    const wordItem = create({ tagname: 'div', class: 'word__item', parent: wordHeader });
    create({
      tagname: 'div', class: 'word__name', parent: wordItem, text: `${this.word.word}`,
    });
    create({
      tagname: 'div', class: 'word__transcription', parent: wordItem, text: `${this.word.transcription}`,
    });
    create({ tagname: 'div', class: 'word__audio', parent: wordItem });
    const wordMarks = create({ tagname: 'div', class: 'word__marks', parent: wordHeader });
    create({ tagname: 'div', class: 'word__hard', parent: wordMarks });
    create({ tagname: 'div', class: 'word__learned', parent: wordMarks });
    create({
      tagname: 'div', class: 'word__translate', parent: wordDescription, text: `${this.word.wordTranslate}`,
    });
    const wordText = create({ tagname: 'div', class: 'word__text', parent: wordDescription });
    create({
      tagname: 'div', class: 'word__meaning', parent: wordText, text: `${this.word.textMeaning}`,
    });
    create({
      tagname: 'div', class: 'word__meaning_translate', parent: wordText, text: `${this.word.textMeaningTranslate}`,
    });
    create({
      tagname: 'div', class: 'word__example', parent: wordText, text: `${this.word.textExample}`,
    });
    create({
      tagname: 'div', class: 'word__example_translate', parent: wordText, text: `${this.word.textExampleTranslate}`,
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
    this.addHandlers();
  }
}
export default Word;