/* eslint-disable max-lines-per-function */
import Api from '../api/api';
import { IWord, IWordApp } from '../interfaces';
import Word from '../word/word';
import create from '../utils/createElement';
import './dictionary.scss';
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';
import Pagination from './pagination';

class DictionaryView {
  api: Api;

  words: Array<IWordApp>;

  COUNT_OF_LEVELS: number;

  page: number;

  group: number;

  private pagination: Pagination | undefined;

  private paginationContainer: HTMLElement | undefined;

  private WORDS_PER_PAGE = 20;

  private TOTAL_WORDS = 600;

  private getWordsHandler:
  | ((group: number, page: number) => Promise<IWord[]>)
  | undefined;

  constructor() {
    this.api = Api.getInstance();
    this.words = [];
    this.COUNT_OF_LEVELS = 5;
    this.page = 1;
    this.group = 1;
  }

  async init(callback: (group: number, page: number) => Promise<IWord[]>) {
    this.getWordsHandler = callback;

    const words = await this.requestWords();

    // this.draw();
    this.activeGroupBtn();
    this.addHandlers(callback);

    if (words) await this.makeWords(words);

    this.drawWords();
    this.drawPagination();
  }

  private drawPagination() {
    this.pagination = new Pagination(
      this.TOTAL_WORDS,
      this.WORDS_PER_PAGE,
      this.page + 1,
      this.goToPage,
    );

    if (this.paginationContainer) {
      this.paginationContainer.innerText = '';
      this.paginationContainer?.append(this.pagination.draw());
    }
  }

  goToPage = async (page: number) => {
    this.page = page - 1;
    console.log('page click: ', page);
    await this.updateWordsList();
  };

  private async updateWordsList() {
    const words = await this.requestWords();

    if (!words) return;

    this.makeWords(words);
    this.drawWords();
    this.drawPagination();
  }

  async updateWords(
    event: Event,
    callback: (group: number, page: number) => Promise<IWord[]>,
  ) {
    this.changeWordsGroup(event);
    this.activeGroupBtn();

    this.updateWordsList();
  }

  addHandlers(callback: (group: number, page: number) => Promise<IWord[]>) {
    const dictionaryGroups = <HTMLElement>(
      document.getElementById('dictionaryGroups')
    );
    dictionaryGroups.addEventListener('click', (e: Event) => this.updateWords(e, callback));

    const dictionaryHardWords = <HTMLElement>(
      document.getElementById('dictionaryHardWords')
    );
    dictionaryHardWords.addEventListener('click', this.showHardWords.bind(this));
  }

  async showHardWords() {
    const words = await this.getHardWords();
    this.makeWords(words);
    this.drawWords();
  }

  async getHardWords() {
    const words: Promise<IWord>[] = [];
    const { userId } : { userId: string } = getLocalStorage('RSLang_Auth'); // TODO error no auth
    const hardWords = await this.api.getUserWords();
    // eslint-disable-next-line no-restricted-syntax
    for (const userHardWord of hardWords) {
      const { wordId } = userHardWord;
      if (wordId) {
        const wordInDictionary = this.api.getWord(wordId);
        words.push(wordInDictionary);
      }
    }
    return Promise.all(words);
  }

  changeWordsGroup(event: Event) {
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

  async requestWords() {
    const groupAndPage: { page: number; group: number } = getLocalStorage('wordsGroupAndPage');
    let page:number;
    let group:number;
    if (groupAndPage) {
      page = groupAndPage.page || this.page;
      group = groupAndPage.group || this.group;
    } else {
      page = this.page;
      group = this.group;
    }
    const words = await this.getWordsHandler?.(group, page);

    return words;
  }

  makeWords(words: Array<IWord>) {
    this.words = [];
    console.log('3makeWords', words);
    words.forEach((word) => {
      console.log('3.2word forEach', word);
      const wordInDictionary = new Word(word);
      console.log('3.5wordInDictionary', wordInDictionary);
      this.words.push(wordInDictionary);
    });
    console.log('4 makingwords', this.words);
  }

  drawWords() {
    console.log('5draw', this.words);
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    if (dictionary) {
      while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
      }
    }
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
        button.classList.add('dictionary__groups_item_active');
      }
    });
    console.log(groupBtns);
  }

  // eslint-disable-next-line max-lines-per-function
  draw() {
    const container = create({
      tagname: 'div',
      class: 'container',
    });

    const dictionary = create({
      tagname: 'div',
      class: 'dictionary',
      parent: container,
    });

    create({
      tagname: 'h2',
      class: 'dictionary__title',
      parent: dictionary,
      text: 'Изучай новые слова',
    });

    const dictionaryGroups = create({
      tagname: 'div',
      class: 'dictionary__groups',
      parent: dictionary,
    });

    const dictionaryGroupsList = create({
      tagname: 'ul',
      class: 'dictionary__groups_list',
      id: 'dictionaryGroups',
      parent: dictionaryGroups,
    });

    for (let i = 0; i <= this.COUNT_OF_LEVELS; i += 1) {
      create({
        tagname: 'li',
        class: 'dictionary__groups_item',
        id: `${i}group`,
        parent: dictionaryGroupsList,
        text: `${i + 1} уровень`,
      });
    }
    const dictionaryExtentions = create({
      tagname: 'div',
      class: 'dictionary__extentions',
      parent: dictionaryGroups,
    });
    create({
      tagname: 'div',
      class: 'dictionary__hardwords',
      id: 'dictionaryHardWords',
      parent: dictionaryExtentions,
      text: 'Мои слова',
    });
    const dictionaryGames = create({
      tagname: 'div',
      class: 'dictionary__games',
      parent: dictionaryExtentions,
    });
    create({
      tagname: 'div',
      class: 'dictionary__sprint',
      id: 'dictionarySprint',
      parent: dictionaryGames,
      text: 'Спринт',
    });
    create({
      tagname: 'div',
      class: 'dictionary__audio',
      id: 'dictionaryAudio',
      parent: dictionaryGames,
      text: 'Аудиовызов',
    });

    create({
      tagname: 'div',
      class: 'dictionary__words',
      id: 'dictionaryWords',
      parent: dictionary,
    });

    this.paginationContainer = create({
      tagname: 'div',
      class: 'dictionary__pagination',
      parent: dictionary,
    });

    // create({
    //   tagname: 'div',
    //   class: 'dictionary__pagination_prev',
    //   parent: dictionaryPagination,
    // });

    // create({
    //   tagname: 'div',
    //   class: 'dictionary__pagination_cur',
    //   id: 'dictionaryPage',
    //   parent: dictionaryPagination,
    //   text: '1',
    // });

    // create({
    //   tagname: 'div',
    //   class: 'dictionary__pagination_next',
    //   parent: dictionaryPagination,
    // });

    this.drawWords();

    return container;
  }
}
export default DictionaryView;
