import BurgerMenu from '../utils/menu';
import Router from '../router';

class App {
  router: Router;

  constructor() {
    const rootContainer = document.getElementById('main') || document.body;
    this.router = new Router(rootContainer);
  }

  start() {
    document?.addEventListener('click', this.onLinkClickHandler);

    window.addEventListener('load', this.onPageLoadHandler);

    window.addEventListener('popstate', this.onPopStateHandler);

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
      window.history.pushState({ page: pageName }, '', `/${pageName}`);
      this.router.openPage(pageName);
    }
  };

  private onPageLoadHandler = () => {
    // eslint-disable-next-line no-console
    console.log('load page', document.location.pathname);
    const pageName = document.location.pathname.split('/')[1] || 'main';

    this.router.openPage(pageName);
    window.history.pushState({ page: pageName }, '', `/${pageName}`);
  };

  private onPopStateHandler = (event: { state: { page: string } }) => {
    // eslint-disable-next-line no-console
    console.log(`popstate, state: ${JSON.stringify(event.state)}`, event.state);
    if (!event.state) {
      this.router.openPage('main');
      return;
    }

    const { page } = event.state;
    if (page) this.router.openPage(page);
  };
}
export default App;
