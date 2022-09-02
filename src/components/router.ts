import Main from '../pages/main';
import Dictionary from '../pages/dictionary';
import Statistic from '../pages/statistic';
import Sprint from '../pages/sprint';
import AudioCall from '../pages/audiocall';

class Router {
  private routers = [
    {
      page: 'main',
      class: 'index-page',
      footer: true,
      controller: () => new Main(),
    },
    {
      page: 'dictionary',
      class: 'inner-page',
      footer: true,
      controller: () => new Dictionary(),
    },
    {
      page: 'sprint',
      class: 'inner-page',
      footer: false,
      controller: () => new Sprint(),
    },
    {
      page: 'audio-call',
      class: 'inner-page',
      footer: false,
      controller: () => new AudioCall(),
    },
    {
      page: 'statistic',
      class: 'inner-page',
      footer: true,
      controller: () => new Statistic(),
    },
  ];

  constructor(
    private rootContainer: HTMLElement,
    private footerContainer: HTMLElement | null,
  ) {}

  openPage = (pageName: string, isMenuLink = false) => {
    this.rootContainer.removeAttribute('class');
    this.rootContainer.innerText = '';

    const currentRouter = this.routers.find(
      (router) => router.page === pageName,
    );

    if (!currentRouter) {
      this.rootContainer.innerHTML = `
        <div class="inner-page not-found-message">
          <p>Нет такой страницы. Начните с начала.</p> <button class="btn btn--orange not-found-message__btn" data-page="main">На главную</button>
        </div>
      `;
      return;
    }

    if (currentRouter.footer) {
      this.footerContainer?.classList.remove('hidden');
    } else {
      this.footerContainer?.classList.add('hidden');
    }

    this.rootContainer.dataset.linkFrom = isMenuLink ? 'menu' : 'page';

    this.rootContainer.classList.add(currentRouter.class);

    currentRouter.controller().draw(this.rootContainer);
  };
}

export default Router;
