const BurgerMenu = {
  burgerMenu: document.getElementById('burgerMenu'),

  init: () => {
    BurgerMenu.burgerMenu?.addEventListener(
      'click',
      BurgerMenu.BurgerMenuHandler,
    );
  },

  BurgerMenuHandler: () => {
    BurgerMenu.burgerMenu?.classList.toggle('burger-menu__active');
    //  menu.classList.toggle('menu--active');
    document.body.classList.toggle('noscroll');
    // nav.classList.toggle('nav--active');
  },
};

export default BurgerMenu;
