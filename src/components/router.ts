// type TRouter = {
//   page: string;
//   url: string;
//   view: undefined;
// };

import Games from './games';
import Main from './main';
import Dictionary from './dictionary';
import Statistic from './statistic';

class Router {
  private routers = [
    {
      page: 'main',
      url: '/',
      class: 'index-page',
      controller: () => new Main(),
    },
    {
      page: 'dictionary',
      url: '/dictionary',
      class: 'inner-page',
      controller: () => new Dictionary(),
    },
    {
      page: 'games',
      url: '/games',
      class: 'inner-page',
      controller: () => new Games(),
    },
    {
      page: 'statistic',
      url: '/statistic',
      class: 'inner-page',
      controller: () => new Statistic(),
    },
  ];

  private rootContainer: HTMLElement;

  constructor(rootContainer: HTMLElement) {
    this.rootContainer = rootContainer;
  }

  openPage = (pageName: string) => {
    const currentRouter = this.routers.find(
      (router) => router.page === pageName,
    );
    // eslint-disable-next-line no-console
    console.log('open page: ', currentRouter);
    if (currentRouter) {
      this.rootContainer.removeAttribute('class');
      this.rootContainer.classList.add(currentRouter.class);
      this.rootContainer.innerText = '';

      currentRouter.controller().draw(this.rootContainer);
    }
  };
}

export default Router;
