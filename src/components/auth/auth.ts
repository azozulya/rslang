import userApi from '../user/user';

export default class Auth {
  private static instance: Auth;

  private content: string;

  container__class: string;

  constructor() {
    this.container__class = 'login-form';
    this.content = '';
  }

  async drawButton() {
    const button = <HTMLElement>document.getElementById('auth');
    if (await userApi.isAuthenticated()) {
      button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выйти</button>';
      button.addEventListener('click', (e: Event) => this.request(e));
    } else {
      button.innerHTML = '<button id="main_login" class="btn btn--orange auth__btn">Войти</button>';
      button.addEventListener('click', (e: Event) => this.request(e));
    }
  }

  draw() {
    const container = <HTMLElement>document.createElement('div');
    container.id = this.container__class;
    document.body.append(container);
    const loginWindow = <HTMLElement>(
      document.getElementById(this.container__class)
    );
    loginWindow.addEventListener('click', (event) => {
      if (event.target === loginWindow) this.closeModal();
    });
    container.innerHTML = '<div id="modal"></div>';

    this.drawLoginUser();
  }

  drawCreateUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
    <div class="header">РЕГИСТРАЦИЯ</div>
    <div class="block" style="height:25px">
      <div id="cross"><span id="modal-close" class="close">&times;</span></div>
      <div id="title">&nbsp;</div>
    </div>
    <div class="block">
      <div id="input-name" class="name" data-validate="true">
        <div class="label">Имя</div>
        <div class="input"><input id="name" type="text" autocomplete="off" required></div>
      </div>
      <div id="error-name" class="error">&nbsp</div>
    </div>
    <div class="block">
      <div id="input-email" class="email" data-validate="true">
        <div class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">&nbsp;</div>
    </div>
    <div class="block">
      <div id="input-password" class="password" data-validate="true">
        <div class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required ></div>
      </div>
      <div id="error-password" class="error">&nbsp;</div>
    </div>
    <div class="button"><button id="register">РЕГИСТРАЦИЯ</button></div>
  `;
    container.innerHTML = this.content;
    this.addHandlersBlock();

    this.addValidateName();
    this.addValidateEmail();
    this.addValidatePassword();
  }

  drawLoginUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
    <div class="header">ВХОД</div>
    <div class="block" style="height:25px">
      <div id="cross"><span id="modal-close" class="close">&times;</span></div>
      <div id="title">&nbsp;</div>
    </div>
    <div class="block">
      <div id="input-email" class="email" data-validate="true">
        <div id="emailLabel" class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">&nbsp;</div>
    </div>
    <div class="block">
      <div id="input-password" class="password" data-validate="true">
        <div id="passwordLabel" class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required></div>
      </div>
      <div id="error-password" class="error">&nbsp;</div>
    </div class="block">
      <div class="button">
        <button id="login">ВХОД</button><p><button id="registerLink">Регистрация</button>
      </div>
  `;

    container.innerHTML = this.content;

    this.addValidateEmail();
    this.addValidatePassword();
    this.addHandlers();
  }

  addValidateName() {
    const inputName = <HTMLInputElement>document.getElementById('name');
    const errorName = <HTMLElement>document.getElementById('error-name');
    inputName.addEventListener('input', () => {
      (<HTMLElement>document.getElementById('title')).innerHTML = '&nbsp;';
      if (inputName.value.length < 3) errorName.innerText = 'Длинна пароля не менее 3 символов';
      else errorName.innerHTML = '&nbsp;';
    });
  }

  addValidateEmail() {
    const inputEmail = <HTMLInputElement>document.getElementById('email');
    const errorEmail = <HTMLElement>document.getElementById('error-email');
    inputEmail.addEventListener('input', () => {
      (<HTMLElement>document.getElementById('title')).innerHTML = '&nbsp;';
      if (!this.validateEmail(inputEmail.value)) errorEmail.innerText = 'Неверный формат Email-адреса';
      else errorEmail.innerHTML = '&nbsp;';
    });
  }

  addValidatePassword() {
    const inputPassword = <HTMLInputElement>document.getElementById('password');
    const errorPassword = <HTMLElement>(
      document.getElementById('error-password')
    );
    inputPassword.addEventListener('input', () => {
      (<HTMLElement>document.getElementById('title')).innerHTML = '&nbsp;';
      if (inputPassword.value.length < 8) errorPassword.innerText = 'Длинна пароля не менее 8 символов';
      else errorPassword.innerHTML = '&nbsp;';
    });
  }

  private addHandlers() {
    const modal = <HTMLElement>document.getElementById('modal');
    modal.addEventListener('click', (e: Event) => this.request(e));
  }

  private addHandlersBlock() {
    const inputName = <HTMLElement>document.getElementById('input-name');
    inputName.addEventListener('click', () => {
      (<HTMLInputElement>document.getElementById('name')).focus();
    });

    const inputEmail = <HTMLElement>document.getElementById('input-email');
    inputEmail.addEventListener('click', () => {
      (<HTMLInputElement>document.getElementById('email')).focus();
    });

    const inputPassword = <HTMLElement>(
      document.getElementById('input-password')
    );
    inputPassword.addEventListener('click', () => {
      (<HTMLInputElement>document.getElementById('password')).focus();
    });
  }

  private request(event: Event) {
    const target = <HTMLElement>event.target;
    if (target.id === 'main_login') this.draw();
    if (target.id === 'main_logout') this.logout();
    if (target.id === 'registerLink') this.drawCreateUser();
    if (target.id === 'login') this.sendLoginData();
    if (target.id === 'register') this.sendRegisterData();
    if (target.id === 'modal-close') this.closeModal();
    if (target.id === 'input-email' || target.id === 'emailLabel') (<HTMLInputElement>document.getElementById('email')).focus();
    if (target.id === 'input-password' || target.id === 'passwordLabel') (<HTMLInputElement>document.getElementById('password')).focus();
  }

  private logout() {
    const button = <HTMLElement>document.getElementById('auth');
    button.innerHTML = '<button id="main_login" class="btn btn--orange auth__btn">Войти</button>';
    userApi.logout();
  }

  private closeModal() {
    const loginForm = <HTMLElement>document.getElementById('login-form');
    loginForm.remove();
  }

  private async sendLoginData() {
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password'))
      .value;

    const res = await userApi.loginUser({ email, password });
    if (res === 200) {
      this.closeModal();
      const button = <HTMLElement>document.getElementById('auth');
      button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выйти</button>';
    } else {
      (<HTMLElement>document.getElementById('title')).innerHTML = 'Не верный Email или пароль!!!';
      (<HTMLInputElement>document.getElementById('email')).value = '';
      (<HTMLInputElement>document.getElementById('password')).value = '';
    }
  }

  private async sendRegisterData() {
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password'))
      .value;

    const statusCreate = await userApi.createUser({ name, email, password });

    if (statusCreate === 417) {
      (<HTMLElement>(
        document.getElementById('title')
      )).innerHTML = `Email "${email}" занят, используйте кнопку "ВОЙТИ"!`;

      (<HTMLInputElement>document.getElementById('name')).value = '';
      (<HTMLInputElement>document.getElementById('email')).value = '';
      (<HTMLInputElement>document.getElementById('password')).value = '';
    }
    if (statusCreate === 200) {
      (<HTMLElement>document.getElementById('title')).innerHTML = `${name}, спасибо за регистрацию!`;
      const statusLogin = await userApi.loginUser({ email, password });

      if (statusLogin === 200) {
        this.closeModal();
        const button = <HTMLElement>document.getElementById('auth');
        button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выйти</button>';
      }
    }
  }

  private validateEmail(value: string): boolean {
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(value);
  }
}
