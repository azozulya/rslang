import {
  IWordApp,
  IWordAppForAuthUser,
  TNavigate,
} from '../../interfaces/interfaces';
import create from '../../utils/createElement';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import Pagination from '../../components/pagination';
import { GROUP_LIST, TOTAL_WORDS, WORDS_PER_PAGE } from '../../utils/constants';

class DictionaryView {
  onGetWords!: (group: number, page: number) => void;

  onGetHardWords!: () => void;

  private GROUP_LIST: string[];

  words: Array<IWordApp>;

  private page: number;

  private group: number;

  private isActiveHardWords: boolean;

  private pagination: Pagination | undefined;

  private paginationContainer: HTMLElement | undefined;

  private wordsForAuthUser: (IWordApp | IWordAppForAuthUser)[];

  private countHardWords = 0;

  private countLearnedWords = 0;

  constructor() {
    this.words = [];
    this.GROUP_LIST = GROUP_LIST;
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
    this.onGetHardWords = callback;
    if (dictionaryHardWords) {
      dictionaryHardWords.addEventListener('click', (e: Event) => this.switchHardWords(e));
      dictionaryHardWords.addEventListener('click', callback);
    }
  }

  private addHandlersForCheckedWord() {
    const dictionaryWords = <HTMLElement>(
      document.getElementById('dictionaryWords')
    );
    dictionaryWords.addEventListener('click', (event) => {
      const element = <HTMLElement>event.target;
      if (
        element.classList.contains('word__hard')
        || element.classList.contains('word__learned')
      ) {
        if (this.isActiveHardWords) this.removeWordFromHardList(element);
        else this.changeViewIfAllLearned();
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
    this.onGetWords(this.group, this.page);
    this.saveWordsNavigate();
  };

  async updateGroup(event: Event) {
    this.page = 0;
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
    return {
      group: this.group,
      page: this.page,
      isActiveHardWords: this.isActiveHardWords,
    };
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

  private switchHardWords(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('dictionary__groups_item')) { this.isActiveHardWords = false; }
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
    const hardWords = <HTMLElement>(
      document.getElementById('dictionaryHardWords')
    );
    if (hardWords) {
      if (this.isActiveHardWords) { hardWords.classList.add('dictionary__hardwords_active'); } else hardWords.classList.remove('dictionary__hardwords_active');
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

  private showTextInfo(IsShow: boolean, message?: string) {
    const textContainer = <HTMLElement>(
      document.getElementById('dictionaryInfo')
    );
    if (!IsShow) {
      textContainer.innerText = '';
      textContainer.classList.add('hidden');
      return;
    }

    textContainer.textContent = IsShow
      ? message || 'Вы отметили все слова на странице'
      : '';
    textContainer.classList.remove('hidden');
  }

  disablePage(IsDisable: boolean) {
    const page = <HTMLElement>(
      document.querySelector('.pagination__label--current')
    );

    if (IsDisable) page.classList.add('pagination__label--inactive');
    else page.classList.remove('pagination__label--inactive');
  }

  private async changeViewIfAllLearned() {
    const isAllChecked = this.checkWordsOnPage();
    this.pageDisable(isAllChecked);
  }

  pageDisable(isDisable: boolean) {
    this.disableGameLinks(isDisable);
    this.showTextInfo(isDisable);
    if (!this.isActiveHardWords) this.disablePage(isDisable);
  }

  private checkWordsOnPage() {
    this.countHardWords = 0;
    this.countLearnedWords = 0;
    this.wordsForAuthUser.forEach((item) => {
      if ('userWord' in item.word) {
        if (item.word.userWord.optional.hard) this.countHardWords += 1;
        if (item.word.userWord.optional.learned) this.countLearnedWords += 1;
      }
    });
    const userWordsOnPage = this.countHardWords + this.countLearnedWords;
    return userWordsOnPage === this.wordsForAuthUser.length;
  }

  removeWordFromHardList(element: HTMLElement) {
    const wordItem = <HTMLElement>element.closest('.word');
    wordItem.remove();
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

  // eslint-disable-next-line max-lines-per-function
  async drawWordsAuth(words: (IWordAppForAuthUser | IWordApp)[]) {
    this.wordsForAuthUser = words;

    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');

    console.log('drawWords: ', words);

    if (!words.length) {
      this.highlightMenu();
      dictionary.innerText = '';
      if (this.paginationContainer) this.paginationContainer.innerHTML = '';

      this.showTextInfo(
        true,
        'Здесь пока пусто. Вы не добавили слова в список сложных слов. ',
      );
      return;
    }

    if (dictionary) {
      while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
      }
    }
    words.forEach((wordInDictionary) => {
      if ('drawForAuthUser' in wordInDictionary) { wordInDictionary.drawForAuthUser(); }
    });
    if (this.paginationContainer) this.paginationContainer.innerHTML = '';

    this.addHandlersForCheckedWord();

    if (!this.isActiveHardWords) {
      this.drawPagination();
      this.changeViewIfAllLearned();
    } else this.pageDisable(false);

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

    for (let i = 0; i < this.GROUP_LIST.length; i += 1) {
      create({
        tagname: 'li',
        class: 'dictionary__groups_item',
        id: `${i}group`,
        parent: dictionaryGroupsList,
        text: `${GROUP_LIST[i]}`,
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
    const sprintLink = create({
      tagname: 'a',
      class: 'dictionary__sprint',
      id: 'dictionarySprint',
      parent: dictionaryGames,
      text: 'Спринт',
    });
    sprintLink.dataset.page = 'sprint';

    const audiocallLink = create({
      tagname: 'a',
      class: 'dictionary__audio',
      id: 'dictionaryAudio',
      parent: dictionaryGames,
      text: 'Аудиовызов',
    });
    audiocallLink.dataset.page = 'audio-call';

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
    const dictionaryGroups = <HTMLElement>(
      container.querySelector('.dictionary__groups')
    );
    const dictionaryExtentions = <HTMLElement>(
      container.querySelector('.dictionary__extentions')
    );
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
