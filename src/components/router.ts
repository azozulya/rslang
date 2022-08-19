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
      controller: () => new Main(),
    },
    {
      page: 'dictionary',
      url: '/dictionary',
      controller: () => new Dictionary(),
    },
    {
      page: 'games',
      url: '/games',
      controller: () => new Games(),
    },
    {
      page: 'statistic',
      url: '/statistic',
      controller: () => new Statistic(),
    },
  ];

  private rootContainer: HTMLElement;

  constructor(rootContainer: HTMLElement) {
    this.rootContainer = rootContainer;
  }

  openPage = (pageName: string) => {
    const currentRouter = this.routers.find(
      (router) => router.page === pageName
    );
    console.log('open page: ', currentRouter);
    if (currentRouter) {
      this.rootContainer.innerText = '';
      currentRouter.controller().draw(this.rootContainer);
    }
  };
}

export default Router;
