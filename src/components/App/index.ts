import BurgerMenu from '../utils/menu';
import Router from '../router';

class App {
  private router: Router;

  private INDEX_PAGE = 'main';

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;

    this.router = new Router(rootContainer);
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);

    BurgerMenu.init();
  }

  private onLinkClickHandler = (event: Event) => {
    event.preventDefault();

    const linkItem = <HTMLElement>(
      (<HTMLLinkElement>event.target)?.closest('[data-page]')
    );

    if (!linkItem) return;

    const pageName = linkItem?.dataset.page;

    if (pageName) {
      this.router.openPage(pageName);
    }
  };

  private onPageLoadHandler = () => {
    this.router.openPage(this.INDEX_PAGE);
  };
}
export default App;
