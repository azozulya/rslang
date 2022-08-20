/* eslint-disable max-lines-per-function */
import Api from '../api/api';
import { IWord, IWordApp } from '../interfaces';
import Word from '../word/word';
import create from '../utils/createElement';
import './dictionary.scss';
import './pagination.scss';
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';

class Dictionary {
  api: Api;

  words: Array<IWordApp>;

  COUNT_OF_LEVELS: number;

  page: number;

  group: number;

  constructor() {
    this.api = Api.getInstance();
    this.words = [];
    this.COUNT_OF_LEVELS = 5;
    this.page = 0;
    this.group = 0;
  }

  async init(callback: (group: number, page: number) => Promise<IWord[]>) {
    const words = await this.requestWords(callback);
    this.draw();
    this.activeGroupBtn();
    this.addHandlers(callback);
    await this.makeWords(words);
    this.drawWords();
  }

  async updateWords(event:Event, callback: (group: number, page: number) => Promise<IWord[]>) {
    this.changeWordsGroup(event);
    this.activeGroupBtn();
    const words = await this.requestWords(callback);
    await this.makeWords(words);
    this.drawWords();
  }

  addHandlers(callback: (group: number, page: number) => Promise<IWord[]>) {
    const dictionaryGroups = <HTMLElement>document.getElementById('dictionaryGroups');
    dictionaryGroups.addEventListener('click', (e:Event) => this.updateWords(e, callback));
  }

  changeWordsGroup(event:Event) {
    const dictionaryGroup = <HTMLElement>event.target;
    if (dictionaryGroup.classList.contains('dictionary__groups_item')) {
      this.group = Number(dictionaryGroup.id[0]);
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
    const words = await callback(group, page);
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

  activeGroupBtn() {
    const groupBtns = document.querySelectorAll('.dictionary__groups_item');
    groupBtns.forEach((button) => {
      if (button.classList.contains('dictionary__groups_item_active')) {
        button.classList.remove('dictionary__groups_item_active');
      }
      if (this.group === Number(button.id[0])) {
        (button.classList.add('dictionary__groups_item_active'));
      }
    });
    console.log(groupBtns);
  }

  draw() {
    const dictionary = create({ tagname: 'div', class: 'dictionary', parent: document.body });
    create({
      tagname: 'h2', class: 'dictionary__title', parent: dictionary, text: 'Изучай новые слова',
    });
    const dictionaryGroups = create({
      tagname: 'div', class: 'dictionary__groups', id: 'dictionaryGroups', parent: dictionary,
    });
    const dictionaryGroupsList = create({ tagname: 'ul', class: 'dictionary__groups_list', parent: dictionaryGroups });
    for (let i = 0; i <= this.COUNT_OF_LEVELS; i += 1) {
      create({
        tagname: 'li', class: 'dictionary__groups_item', id: `${i}group`, parent: dictionaryGroupsList, text: `${i + 1} уровень`,
      });
    }
    const dictionaryExtentions = create({
      tagname: 'div', class: 'dictionary__extentions', parent: dictionaryGroups,
    });
    create({
      tagname: 'div', class: 'dictionary__hardwords', id: 'dictionaryHardWords', parent: dictionaryExtentions, text: 'Мои слова',
    });
    const dictionaryGames = create({
      tagname: 'div', class: 'dictionary__games', parent: dictionaryExtentions,
    });
    create({
      tagname: 'div', class: 'dictionary__sprint', id: 'dictionarySprint', parent: dictionaryGames, text: 'Спринт',
    });
    create({
      tagname: 'div', class: 'dictionary__audio', id: 'dictionaryAudio', parent: dictionaryGames, text: 'Аудиовызов',
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

    this.drawWords();
  }
}
export default Dictionary;
