import Games from './games';
import Main from './main';
import Dictionary from './dictionary';
import Statistic from './statistic';

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

  openPage = (pageName: string) => {
    const currentRouter = this.routers.find(
      (router) => router.page === pageName,
    );

    if (currentRouter) {
      this.rootContainer.removeAttribute('class');
      this.rootContainer.classList.add(currentRouter.class);
      this.rootContainer.innerText = '';

      currentRouter.controller().draw(this.rootContainer);
    }
  };
}

export default Router;
