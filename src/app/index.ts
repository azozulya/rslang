import Router from '../components/router';
import { DEFAULT_PAGE, PAGE_KEY } from '../utils/constants';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import Menu from '../components/menu';

type TPageObj = {
  prevPage: string;
  currentPage: string;
};

class App {
  private router: Router;

  private menu: Menu;

  private currentPage: string;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;
    const storageObj = getLocalStorage<TPageObj>(PAGE_KEY);
    this.currentPage = storageObj ? storageObj.currentPage : DEFAULT_PAGE;
    this.router = new Router(rootContainer);
    this.menu = new Menu(this.currentPage);
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);
  }

  private onLinkClickHandler = (event: Event) => {
    const linkItem = <HTMLElement>(
      (<HTMLLinkElement>event.target)?.closest('[data-page]')
    );

    if (!linkItem) return;

    event.preventDefault();

    const pageName = linkItem?.dataset.page;
    const isMenuLink = Boolean(linkItem.closest('.menu'));
    console.log(isMenuLink);

    if (pageName) {
      if (pageName === this.currentPage) return;

      this.router.openPage(pageName, isMenuLink);
      this.menu.setActive(pageName);
      this.menu.hide();

      this.updateLocalStorage(this.currentPage, pageName);

      this.currentPage = pageName;
    }
  };

  private onPageLoadHandler = () => {
    this.router.openPage(this.currentPage);
    this.menu.hide();
    this.updateLocalStorage(this.currentPage, this.currentPage);
  };

  private updateLocalStorage(prevPage: string, currentPage: string) {
    const storageValue = getLocalStorage<{
      prevPage: string;
      currentPage: string;
    }>(PAGE_KEY);

    console.log('storageValue: ', storageValue);

    setLocalStorage(PAGE_KEY, {
      ...storageValue,
      prevPage,
      currentPage,
    });
  }
}
export default App;
