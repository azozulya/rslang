import JWT from 'jwt-decode';
import './auth.scss';
import User from '../user/user';
import Api from '../api/api';
import { IAuth, IJwt } from '../interfaces';

export default class Auth {
  private static instance: Auth;

  private api: Api;

  private content: string;

  container__class: string;

  private user: User;

  constructor() {
    this.container__class = 'login-form';
    this.content = '';
    this.user = User.getInstance();
    this.api = Api.getInstance();
  }

  static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  async isLogin(): Promise<boolean> {
    const getValue = <string | null> this.user.getStorage('RSLang_Auth');
    if (getValue !== null) {
      const storage = <IAuth>JSON.parse(<string>getValue);
      // console.log(storage.refreshToken);
      if (storage.refreshToken === '') return false;
      const refreshTokenDate = (<IJwt>JWT(storage.refreshToken)).exp;
      console.log(Math.trunc(Date.now() / 1000));
      console.log(refreshTokenDate);

      const currentDate = Date.now() / 1000;
      const differenceToken = refreshTokenDate - currentDate;
      // console.log(refreshTokenDate);
      // console.log(`${refreshTokenDate - currentDate / 1000}`);
      if (differenceToken <= 3600 && differenceToken > 0) {
        await this.user.getUserToken();
        // if (refreshTokenDate - currentDate <= 3600) await this.api.getUserToken(storage.userId, storage.refreshToken);
        return true;
      }
    }
    // console.log('RSLang_Auth: NULL');
    return false;
  }

  async drawButton() {
    const button = <HTMLElement>document.getElementById('auth');
    if (await this.isLogin()) {
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
    const loginWindow = <HTMLElement>document.getElementById(this.container__class);
    loginWindow.addEventListener('click', (event) => {
      if (event.target === loginWindow) this.closeModal();
    });
    container.innerHTML = '<div id="modal"><div>';

    this.drawLoginUser();
  }

  drawCreateUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
    <div>
      <div class="name" data-validate="true">
        <div class="label">Имя</div>
        <div class="input"><input id="name" type="text" autocomplete="off" required></div>
      </div>
      <div id="error-name" class="error">&nbsp</div>
    </div>
    <div>
      <div class="email" data-validate="true">
        <div class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">&nbsp;</div>
    </div>
    <div>
      <div class="password" data-validate="true">
        <div class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required ></div>
      </div>
      <div id="error-password" class="error">&nbsp;</div>
    </div>
    <div class="button">
      <button id="close">ОТМЕНА</button><button id="register">РЕГИСТРАЦИЯ</button>
    </div>
  `;
    container.innerHTML = this.content;

    this.addValidateEmail();
    this.addValidatePassword();
    this.addHandlers();
  }

  drawLoginUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
    <div>
      <div id="input-email" class="email" data-validate="true">
        <div class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">&nbsp;</div>
    </div>
    <div>
      <div class="password" data-validate="true">
        <div class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required></div>
      </div>
      <div id="error-password" class="error">&nbsp;</div>
    </div>
      <div class="button">
        <button id="registerLink">Регистрация</button><button id="close">ОТМЕНА</button><button id="login">ВХОД</button>
      </div>
  `;
    container.innerHTML = this.content;
    const inputEmail = <HTMLElement>document.getElementById('input-email');
    inputEmail.addEventListener('click', () => {
      (<HTMLInputElement>document.getElementById('email')).focus();
    });
    this.addValidateEmail();
    this.addValidatePassword();
    this.addHandlers();
  }

  addValidateEmail() {
    const inputEmail = <HTMLInputElement>document.getElementById('email');
    const errorEmail = <HTMLElement>document.getElementById('error-email');
    inputEmail.addEventListener('input', () => {
      if (!this.validateEmail(inputEmail.value)) errorEmail.innerText = 'Неверный формат Email-адреса';
      else errorEmail.innerHTML = '&nbsp;';
    });
  }

  addValidatePassword() {
    const inputPassword = <HTMLInputElement>document.getElementById('password');
    const errorPassword = <HTMLElement>document.getElementById('error-password');
    inputPassword.addEventListener('input', () => {
      if (inputPassword.value.length < 8) errorPassword.innerText = 'Длинна пароля не менее 8 символов';
      else errorPassword.innerHTML = '&nbsp;';
    });
  }

  private addHandlers() {
    const modal = <HTMLElement>document.getElementById('modal');
    modal.addEventListener('click', (e: Event) => this.request(e));
  }

  private request(event: Event) {
    const target = <HTMLElement>event.target;
    console.log(target);

    if (target.id === 'main_login') this.draw();
    if (target.id === 'registerLink') this.drawCreateUser();
    if (target.id === 'login') this.sendLoginData();
    if (target.id === 'register') this.sendRegisterData();
    if (target.id === 'close') this.closeModal();
    // if (target.id === 'input-email') (<HTMLInputElement>document.getElementById('email')).focus();
  }

  private closeModal() {
    const loginForm = <HTMLElement>document.getElementById('login-form');
    loginForm.remove();
  }

  private async sendLoginData() {
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const res = await this.user.loginUser({ email, password });
    console.log(`sendLoginData: ${res}`);
    if (res === 200) {
      this.closeModal();
      const button = <HTMLElement>document.getElementById('auth');
      button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выйти</button>';
    }
  }

  private async sendRegisterData() {
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const statusCreate = await this.user.createUser({ name, email, password });
    if (statusCreate === 200) {
      console.log('REGISTER: OK');
      const statusLogin = await this.user.loginUser({ email, password });
      if (statusLogin === 200) {
        console.log('LOGIN: OK');
        this.closeModal();
        this.closeModal();
        const button = <HTMLElement>document.getElementById('auth');
        button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выйти</button>';
      }
    }
    if (statusCreate === 417) {
      (<HTMLInputElement>document.getElementById('name')).value = '';
      (<HTMLInputElement>document.getElementById('email')).value = '';
      (<HTMLInputElement>document.getElementById('password')).value = '';
      console.log('USER EXISTS');
    }
  }

  private validateEmail(value: string): boolean {
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(value);
  }
}
