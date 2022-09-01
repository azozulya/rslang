import Router from '../components/router';
import Menu from '../components/menu';
import Auth from '../components/auth/auth';
import { DEFAULT_PAGE, PAGE_KEY } from '../utils/constants';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { TPageHistory } from '../interfaces/interfaces';

class App {
  private router: Router;

  private menu: Menu;

  private currentPage: string;

  private auth: Auth;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;
    const footerContainer = document.getElementById('footer');
    const storageObj = getLocalStorage<TPageHistory>(PAGE_KEY);

    this.currentPage = storageObj ? storageObj.currentPage : DEFAULT_PAGE;
    this.router = new Router(rootContainer, footerContainer);
    this.menu = new Menu(this.currentPage);
    this.auth = new Auth();
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);

    this.auth.drawButton();
  }

  private onLinkClickHandler = (event: Event) => {
    const linkItem = <HTMLElement>(
      (<HTMLLinkElement>event.target)?.closest('[data-page]')
    );

    if (!linkItem) return;

    event.preventDefault();

    const pageName = linkItem?.dataset.page;
    const isMenuLink = Boolean(linkItem.closest('.menu'))
      || Boolean(linkItem.closest('.footer__menu'));

    if (pageName) {
      if (pageName === this.currentPage) return;

      this.updateLocalStorage(this.currentPage, pageName);

      this.currentPage = pageName;
      this.router.openPage(pageName, isMenuLink);
      this.menu.setActive(pageName);
    }
  };

  private onPageLoadHandler = () => {
    this.router.openPage(this.currentPage);
    this.updateLocalStorage(this.currentPage, this.currentPage);
  };

  private updateLocalStorage(prevPage: string, currentPage: string) {
    const storageValue = getLocalStorage<TPageHistory>(PAGE_KEY);

    setLocalStorage(PAGE_KEY, {
      ...storageValue,
      prevPage,
      currentPage,
    });
  }
}
export default App;
