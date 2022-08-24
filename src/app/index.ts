import Router from '../components/router';
import { DEFAULT_PAGE, PAGE_KEY } from '../utils/constants';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import Menu from '../utils/menu';

class App {
  private router: Router;

  private currentPage = getLocalStorage<string>(PAGE_KEY) || DEFAULT_PAGE;

  private menu: Menu;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;
    console.log(getLocalStorage<string>(PAGE_KEY));
    this.router = new Router(rootContainer);
    this.menu = new Menu();
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);

    this.menu.init();
  }

  private onLinkClickHandler = (event: Event) => {
    const linkItem = <HTMLElement>(
      (<HTMLLinkElement>event.target)?.closest('[data-page]')
    );

    if (!linkItem) return;

    event.preventDefault();

    const pageName = linkItem?.dataset.page;

    if (pageName) {
      if (pageName === this.currentPage) return;

      this.router.openPage(pageName);
      this.menu.setActive(pageName);
      this.menu.hide();

      setLocalStorage(PAGE_KEY, {
        prevPage: this.currentPage,
        currentPage: pageName,
      });
      this.currentPage = pageName;
    }
  };

  private onPageLoadHandler = () => {
    this.router.openPage(this.currentPage);
    this.menu.hide();

    const storageValue = getLocalStorage<string>(PAGE_KEY);
    console.log('storageValue: ', storageValue);

    setLocalStorage(PAGE_KEY, {
      prevPage: this.currentPage,
      currentPage: this.currentPage,
    });
  };
}
export default App;
