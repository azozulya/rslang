import { IWord, IWordApp } from '../interfaces';
import Word from '../word/word';
import create from '../utils/createElement';
import './dictionary.scss';
import './pagination.scss';

class Dictionary {
  words: Array<IWordApp>;

  COUNT_OF_LEVELS: number;

  page: number;

  constructor() {
    this.words = [];
    this.COUNT_OF_LEVELS = 5;
    this.page = 0;
  }

  addHandlers() {
    const dictionaryLevels = <HTMLElement>document.getElementById('dictionaryLevels');
    console.log(dictionaryLevels);
    dictionaryLevels.addEventListener('click', (e:Event) => this.requestWords(e));
  }

  requestWords(event:Event) {
    const dictionaryLevel = <HTMLElement>event.target;
    if (dictionaryLevel.classList.contains('dictionary__levels_item')) {
      console.log('requestwords', event.target); // TODO - add request
    }
  }

  draw() {
    const dictionary = create({ tagname: 'div', class: 'dictionary', parent: document.body });
    create({
      tagname: 'h2', class: 'dictionary__title', parent: dictionary, text: 'Изучай новые слова',
    });
    const dictionaryLevels = create({
      tagname: 'div', class: 'dictionary__levels', id: 'dictionaryLevels', parent: dictionary,
    });
    const dictionaryLevelsList = create({ tagname: 'ul', class: 'dictionary__levels_list', parent: dictionaryLevels });
    for (let i = 0; i <= this.COUNT_OF_LEVELS; i += 1) {
      create({
        tagname: 'li', class: 'dictionary__levels_item', id: `${i}  уровень`, parent: dictionaryLevelsList, text: `${i + 1} уровень`,
      });
    }
    create({ tagname: 'div', class: 'dictionary__hardwords', parent: dictionaryLevels });
    create({
      tagname: 'div', class: 'dictionary__words', id: 'dictionaryWords', parent: dictionary,
    });
    this.words.forEach((wordInDictionary) => {
      wordInDictionary.draw();
    });
    const dictionaryPagination = create({ tagname: 'div', class: 'dictionary__pagination', parent: dictionary });
    create({ tagname: 'div', class: 'dictionary__pagination_prev', parent: dictionaryPagination });
    create({
      tagname: 'div', class: 'dictionary__pagination_cur', id: 'dictionaryPage', parent: dictionaryPagination, text: '1',
    });
    create({ tagname: 'div', class: 'dictionary__pagination_next', parent: dictionaryPagination });
  }

  createWords(words: Array<IWord>) {
    words.forEach((word) => {
      const wordInDictionary = new Word(word);
      this.words.push(wordInDictionary);
    });
  }
}
export default Dictionary;
