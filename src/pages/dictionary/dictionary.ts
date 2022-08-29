/* eslint-disable max-lines-per-function */
import { IWordApp, IWordAppForAuthUser, TNavigate } from '../../interfaces/interfaces';
import create from '../../utils/createElement';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import Pagination from '../../components/pagination';
import { COUNT_OF_GROUPS, TOTAL_WORDS, WORDS_PER_PAGE } from '../../utils/constants';

class DictionaryView {
  onGetWords!: (group: number, page: number) => void;

  words: Array<IWordApp>;

  private COUNT_OF_GROUPS: number;

  private page: number;

  private group: number;

  private isActiveHardWords: boolean;

  private pagination: Pagination | undefined;

  private paginationContainer: HTMLElement | undefined;

  private wordsForAuthUser: IWordAppForAuthUser[];

  constructor() {
    this.words = [];
    this.COUNT_OF_GROUPS = COUNT_OF_GROUPS;
    this.page = 0;
    this.group = 0;
    this.isActiveHardWords = false;
    this.wordsForAuthUser = [];
  }

  bindGetWords(callback: { (group: number, page: number): void }) {
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
    if (dictionaryHardWords) {
      dictionaryHardWords.addEventListener('click', callback);
      dictionaryHardWords.addEventListener('click', (e: Event) => this.switchHardWords(e));
    }
  }

  private addHandlersForCheckingWord() {
    const dictionaryWords = <HTMLElement>document.getElementById('dictionaryWords');
    dictionaryWords.addEventListener('click', (event) => {
      const element = <HTMLElement>event.target;
      if (element.classList.contains('word__hard') || element.classList.contains('word__learned')) {
        this.changeViewIfAllLearned();
      }
    });
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
    await this.updateWords(); // need to change method (?)
  };

  async updateGroup(event: Event) {
    this.switchHardWords(event);
    this.switchWordsGroup(event);
    this.highlightGroupBtn();
    this.updateWords();
  }

  async updateWords() {
    const { group, page } = this.getNavigate();
    this.onGetWords(group, page);
  }

  getNavigate() {
    const navigate: TNavigate = getLocalStorage('wordsNavigate');
    if (navigate) {
      this.page = navigate.page;
      this.group = navigate.group;
      this.isActiveHardWords = navigate.isActiveHardWords;
    }
    return { group: this.group, page: this.page, isActiveHardWords: this.isActiveHardWords };
  }

  private highlightGroupBtn() {
    const groupBtns = document.querySelectorAll('.dictionary__groups_item');
    if (getLocalStorage('wordsNavigate')) {
      const { group } = getLocalStorage('wordsNavigate');
      this.group = group;
    }

    groupBtns.forEach((button) => {
      if (button.classList.contains('dictionary__groups_item_active')) {
        button.classList.remove('dictionary__groups_item_active');
      }
      if (!this.isActiveHardWords) {
        if (this.group === Number(button.id[0])) {
          button.classList.add('dictionary__groups_item_active');
        }
      }
    });
  }

  private switchWordsGroup(event: Event) {
    const dictionaryGroup = <HTMLElement>event.target;
    if (dictionaryGroup.classList.contains('dictionary__groups_item')) {
      this.group = Number(dictionaryGroup.id[0]);
    }
    this.saveWordsNavigate();
  }

  private saveWordsNavigate() {
    const navigate: TNavigate = {
      page: this.page,
      group: this.group,
      isActiveHardWords: this.isActiveHardWords,
    };
    setLocalStorage('wordsNavigate', navigate);
  }

  private switchHardWords(event:Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('dictionary__groups_item')) this.isActiveHardWords = false;
    if (element.classList.contains('dictionary__hardwords')) {
      this.isActiveHardWords = true;
      this.highlightGroupBtn();
    }
    this.saveWordsNavigate();
    this.highlightHardWords();
  }

  private highlightMenu() {
    this.highlightHardWords();
    this.highlightGroupBtn();
  }

  private highlightHardWords() {
    const hardWords = <HTMLElement>document.getElementById('dictionaryHardWords');
    if (hardWords) {
      if (this.isActiveHardWords) hardWords.classList.add('dictionary__hardwords_active');
      else (hardWords.classList.remove('dictionary__hardwords_active'));
    }
  }

  private disableGameLinks(IsDisable: boolean) {
    const sprint = <HTMLElement>document.getElementById('dictionarySprint');
    const audioCall = <HTMLElement>document.getElementById('dictionaryAudio');
    const games = [sprint, audioCall];
    games.forEach((game) => {
      if (IsDisable) game.classList.add('dictionary__games_disable');
      else game.classList.remove('dictionary__games_disable');
    });
  }

  private showTextInfo(IsShow: boolean) {
    const textContainer = <HTMLElement>document.getElementById('dictionaryInfo');
    textContainer.textContent = IsShow ? 'Вы отметили все слова на странице' : '';
  }

  private changeViewIfAllLearned() {
    const isAllChecked = this.checkWordsOnPage();
    this.disableGameLinks(isAllChecked);
    this.showTextInfo(isAllChecked); // add disable for pagination
  }

  private checkWordsOnPage() {
    const isLearnedAndHard = this.wordsForAuthUser.every(
      (word) => word.word.optional?.learned === true || word.word.optional?.hard === true,
    );
    /* const isAllNotHard = this.wordsForAuthUser.some(
      (word) => word.word.optional?.learned === true,
    ); */

    const isChecked = isLearnedAndHard; // && isAllNotHard;
    return isChecked;
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
    this.drawPagination();
    this.highlightMenu();
  }

  drawWordsAuth(words:IWordAppForAuthUser[]) {
    this.wordsForAuthUser = words;

    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    if (dictionary) {
      while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
      }
    }
    words.forEach((wordInDictionary) => {
      wordInDictionary.drawForAuthUser();
    });

    this.changeViewIfAllLearned();

    this.addHandlersForCheckingWord();
    this.drawPagination();
    this.highlightMenu();
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
      id: 'dictionaryExtentions',
      parent: dictionaryGroups,
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

  drawForAuthUser() {
    const container = this.draw();
    const dictionaryGroups = <HTMLElement>container.querySelector('.dictionary__groups');
    const dictionaryExtentions = <HTMLElement>container.querySelector('.dictionary__extentions');
    create({
      tagname: 'div',
      class: 'dictionary__hardwords',
      id: 'dictionaryHardWords',
      parent: dictionaryExtentions,
      text: 'Сложные слова',
    });
    create({
      tagname: 'div',
      class: 'dictionary__info',
      id: 'dictionaryInfo',
      parent: dictionaryGroups,
    });
    return container;
  }
}
export default DictionaryView;
