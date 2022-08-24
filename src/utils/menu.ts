import { DEFAULT_PAGE } from './constants';

class Menu {
  static currentPageName = DEFAULT_PAGE;

  private burgerMenuBtn?: HTMLElement | null;

  private menu?: HTMLElement | null;

  private currentMenuItemClass = 'menu__link--active';

  init() {
    this.menu = document.getElementById('menu');
    this.menu?.addEventListener('click', this.menuOverlayClickHandler);
    this.burgerMenuBtn = document.getElementById('burgerMenu');
    this.burgerMenuBtn?.addEventListener('click', this.burgerMenuHandler);
  }

  setActive = (pageName: string) => {
    this.menu
      ?.querySelector(`.${this.currentMenuItemClass}`)
      ?.classList.remove(this.currentMenuItemClass);

    this.menu
      ?.querySelector(`[data-page=${pageName}]`)
      ?.classList.add(this.currentMenuItemClass);

    Menu.currentPageName = pageName;
  };

  hide = () => {
    if (!document.body.classList.contains('noscroll')) return;

    this.burgerMenuBtn?.classList.remove('burger-menu__active');
    this.menu?.classList.remove('menu--active');
    document.body.classList.remove('noscroll');
  };

  private menuOverlayClickHandler = (event: Event) => {
    const el = (<HTMLElement>event.target)?.closest('.menu__list');

    if (el) return;

    this.hide();
  };

  private burgerMenuHandler = () => {
    this.burgerMenuBtn?.classList.toggle('burger-menu__active');
    this.menu?.classList.toggle('menu--active');
    document.body.classList.toggle('noscroll');
  };
}

export default Menu;
