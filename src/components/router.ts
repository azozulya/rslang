// type TRouter = {
//   page: string;
//   url: string;
//   view: undefined;
// };

import Games from './games';
import Main from './main';
import Dictionary from './dictionary/dictionary';
import wordsList from './utils/testWord';
import Statistic from './statistic';

class Router {
  private routers = [
    {
      page: 'main',
      url: '/',
      view: () => new Main(),
    },
    {
      page: 'dictionary',
      url: '/dictionary',
      view: () => new Dictionary(wordsList),
    },
    {
      page: 'games',
      url: '/games',
      view: () => new Games(),
    },
    {
      page: 'statistic',
      url: '/statistic',
      view: () => new Statistic(),
    },
  ];

  openPage = (pageName: string) => {
    const currentRouter = this.routers.find(
      (router) => router.page === pageName
    );
    // eslint-disable-next-line no-console

    if (currentRouter) currentRouter.view().draw();
    console.log('router: ', currentRouter);
  };

  // parseRequestURL() {
  //   this.request.resource = this.r[1];
  //   this.request.id = this.r[2];
  //   this.request.verb = this.r[3];
  //   return this.request;
  // }
}
export default Router;
