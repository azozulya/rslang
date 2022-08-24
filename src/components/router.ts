import Games from '../pages/games';
import Main from '../pages/main';
import Dictionary from '../pages/dictionary';
import Statistic from '../pages/statistic';

class Router {
  private routers = [
    {
      page: 'main',
      class: 'index-page',
      controller: () => new Main(),
    },
    {
      page: 'dictionary',
      class: 'inner-page',
      controller: () => new Dictionary(),
    },
    {
      page: 'games',
      class: 'inner-page',
      controller: () => new Games(),
    },
    {
      page: 'statistic',
      class: 'inner-page',
      controller: () => new Statistic(),
    },
  ];

  constructor(private rootContainer: HTMLElement) {}

  openPage = (pageName: string, isMenuLink = false) => {
    const currentRouter = this.routers.find(
      (router) => router.page === pageName
    );

    if (currentRouter) {
      this.rootContainer.dataset.arrival = isMenuLink ? 'menu' : '';

      this.rootContainer.removeAttribute('class');
      this.rootContainer.classList.add(currentRouter.class);
      this.rootContainer.innerText = '';

      currentRouter.controller().draw(this.rootContainer);
    }
  };
}

export default Router;
