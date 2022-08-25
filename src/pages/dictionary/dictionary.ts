/* eslint-disable max-lines-per-function */
import Api from '../../api/api';
import { IWordApp } from '../../interfaces/interfaces';
import create from '../../utils/createElement';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import Pagination from '../../components/pagination';
import { TOTAL_WORDS, WORDS_PER_PAGE } from '../../utils/constants';

class DictionaryView {
  onGetWords!: (group: number, page: number) => void;

  api: Api;

  words: Array<IWordApp>;

  COUNT_OF_GROUPS: number;

  page: number;

  group: number;

  private pagination: Pagination | undefined;

  private paginationContainer: HTMLElement | undefined;

  constructor() {
    this.api = Api.getInstance();
    this.words = [];
    this.COUNT_OF_GROUPS = 5;
    this.page = 0;
    this.group = 0;
  }

  bindGetWords(callback: { (group: number, page: number): void }) {
    // to index
    const dictionaryGroups = <HTMLElement>(
      document.getElementById('dictionaryGroups')
    );
    this.onGetWords = callback;
    dictionaryGroups.addEventListener('click', (e: Event) => this.updateGroup(e));
  }

  bindGetHardWords(callback: { (): void }) {
    const dictionaryHardWords = <HTMLElement>(
      document.getElementById('dictionaryHardWords')
    );
    dictionaryHardWords.addEventListener('click', callback);
  }

  private drawPagination() {
    this.pagination = new Pagination(
      TOTAL_WORDS,
      WORDS_PER_PAGE,
      this.page + 1,
      this.goToPage,
    );

    if (this.paginationContainer) {
      this.paginationContainer.innerHTML = '';
      this.paginationContainer?.append(this.pagination.draw());
    }
  }

  goToPage = async (page: number) => {
    this.page = page - 1;
    await this.updateWords();
  };

  async updateGroup(event: Event) {
    this.changeWordsGroup(event);
    this.highlightGroupBtn();
    this.updateWords();
  }

  async updateWords() {
    const { group, page } = this.getGroupAndPage();
    this.onGetWords(group, page);
  }

  getGroupAndPage() {
    const groupAndPage: { page: number; group: number } = getLocalStorage('wordsGroupAndPage');
    if (groupAndPage) {
      this.page = groupAndPage.page;
      this.group = groupAndPage.group;
    }
    return { group: this.group, page: this.page };
  }

  highlightGroupBtn() {
    const groupBtns = document.querySelectorAll('.dictionary__groups_item');

    this.group = getLocalStorage('wordsGroupAndPage') || 0;

    groupBtns.forEach((button) => {
      if (button.classList.contains('dictionary__groups_item_active')) {
        button.classList.remove('dictionary__groups_item_active');
      }
      if (this.group === Number(button.id[0])) {
        button.classList.add('dictionary__groups_item_active');
      }
    });
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

  drawWords(words: IWordApp[]) {
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    if (dictionary) {
      while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
      }
    }
    words.forEach((wordInDictionary) => {
      wordInDictionary.draw();
    });
    this.highlightGroupBtn();
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

    for (let i = 0; i <= this.COUNT_OF_GROUPS; i += 1) {
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

    return container;
  }
}
export default DictionaryView;
