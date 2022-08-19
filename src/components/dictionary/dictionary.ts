import { IWord, IWordApp } from '../interfaces';
import Word from '../word/word';
import create from '../utils/createElement';
import './dictionary.scss';
import './pagination.scss';
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';

class Dictionary {
  words: Array<IWordApp>;

  COUNT_OF_LEVELS: number;

  page: number;

  group: number;

  constructor() {
    this.words = [];
    this.COUNT_OF_LEVELS = 5;
    this.page = 0;
    this.group = 0;
  }

  async init(callback: (group: number, page: number) => Promise<IWord[]>) {
    const words = await this.requestWords(callback);
    this.draw();
    this.addHandlers(callback);
    await this.makeWords(words);
    this.drawWords();
  }

  async updateWords(event:Event, callback: (group: number, page: number) => Promise<IWord[]>) {
    this.changeWordsGroup(event);
    const words = await this.requestWords(callback);
    await this.makeWords(words);
    this.drawWords();
  }

  addHandlers(callback: (group: number, page: number) => Promise<IWord[]>) {
    const dictionaryLevels = <HTMLElement>document.getElementById('dictionaryLevels');
    dictionaryLevels.addEventListener('click', (e:Event) => this.updateWords(e, callback));
  }

  changeWordsGroup(event:Event) {
    const dictionaryLevel = <HTMLElement>event.target;
    if (dictionaryLevel.classList.contains('dictionary__levels_item')) {
      this.group = Number(dictionaryLevel.id[0]);
    }
    this.saveWordsGroupAndPage();
  }

  saveWordsGroupAndPage() {
    const groupAngPage = { page: this.page, group: this.group };
    setLocalStorage('wordsGroupAndPage', groupAngPage);
  }

  async requestWords(callback: (group: number, page: number) => Promise<IWord[]>) {
    let page: number;
    let group: number;
    const groupAndPage: { page: number; group: number } = getLocalStorage('wordsGroupAndPage');
    if (groupAndPage) {
      page = groupAndPage.page;
      group = groupAndPage.group;
    } else {
      page = this.page;
      group = this.group;
    }
    console.log(group, page)
    const words = await callback(group, page);
    console.log(words)
    return words;
  }

  makeWords(words: Array<IWord>) {
    this.words = [];
    words.forEach((word) => {
      const wordInDictionary = new Word(word);
      this.words.push(wordInDictionary);
    });
  }

  drawWords() {
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    if (dictionary) {
      while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
      }
    }

    console.log(this.words);
    this.words.forEach((wordInDictionary) => {
      wordInDictionary.draw();
    });
  }

  draw() {
    this.drawWords();
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
        tagname: 'li', class: 'dictionary__levels_item', id: `${i}group`, parent: dictionaryLevelsList, text: `${i + 1} уровень`,
      });
    }
    create({
      tagname: 'div', class: 'dictionary__hardwords', parent: dictionaryLevels, text: 'Сложные слова',
    });
    create({
      tagname: 'div', class: 'dictionary__words', id: 'dictionaryWords', parent: dictionary,
    });
    const dictionaryPagination = create({ tagname: 'div', class: 'dictionary__pagination', parent: dictionary });
    create({ tagname: 'div', class: 'dictionary__pagination_prev', parent: dictionaryPagination });
    create({
      tagname: 'div', class: 'dictionary__pagination_cur', id: 'dictionaryPage', parent: dictionaryPagination, text: '1',
    });
    create({ tagname: 'div', class: 'dictionary__pagination_next', parent: dictionaryPagination });
  }
}
export default Dictionary;
