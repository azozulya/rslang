import Router from '../router';
import Menu from '../utils/menu';

class App {
  private router: Router;

  private INDEX_PAGE = 'main';

  private menu: Menu;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;

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
      this.router.openPage(pageName);
      this.menu.setActive(pageName);
      this.menu.hide();
    }
  };

  private onPageLoadHandler = () => {
    this.router.openPage(this.INDEX_PAGE);
    this.menu.hide();
  };
}
export default App;
