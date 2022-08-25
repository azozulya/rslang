import Router from '../router';
import Menu from '../utils/menu';
import Auth from '../auth/auth';

class App {
  private router: Router;

  private INDEX_PAGE = 'main';

  private menu: Menu;

  private auth: Auth;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;

    this.router = new Router(rootContainer);
    this.menu = new Menu();
    this.auth = new Auth();
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);

    this.menu.init();

    this.auth.drawButton();
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
