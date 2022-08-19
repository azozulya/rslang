import BurgerMenu from '../utils/menu';
import Router from '../router';

class App {
  router: Router;

  constructor() {
    this.router = new Router();
  }

  // eslint-disable-next-line max-lines-per-function
  start() {
    const menu = document.getElementById('menu');

    menu?.addEventListener('click', (event) => {
      event.preventDefault();
      const menuItem = <HTMLElement>(
        (<HTMLLinkElement>event.target)?.closest('.menu__item--link')
      );
      if (menuItem) {
        const pageName = menuItem?.dataset.page;

        if (pageName) {
          window.history.pushState(
            { page: pageName },
            pageName,
            `/${pageName}`
          );
          this.router.openPage(pageName);
        }
      }
      console.log(menuItem?.dataset.page);
    });

    // Listen on page load:
    window.addEventListener('load', () => {
      // eslint-disable-next-line no-console
      console.log('load page', document.location.pathname);
      // this.router.openPage(document.location.pathname.split('/'));
      window.history.pushState({ page: 'main' }, 'main', '/');
    });

    window.addEventListener('popstate', (event) => {
      console.log(
        `location: ${document.location}, state: ${JSON.stringify(event.state)}`
      );
      const { page } = event.state;
      if (page) this.router.openPage(page);
    });

    BurgerMenu.init();
  }
}
export default App;
