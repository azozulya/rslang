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
      const currentDate = Date.now() / 1000;
      // console.log(refreshTokenDate);
      // console.log(`${refreshTokenDate - currentDate / 1000}`);
      if (refreshTokenDate - currentDate <= 3600) await this.user.getUserToken();
      // if (refreshTokenDate - currentDate <= 3600) await this.api.getUserToken(storage.userId, storage.refreshToken);
      return true;
    }
    console.log('RSLang_Auth: NULL');
    return false;
  }

  async drawButton() {
    const button = <HTMLElement>document.getElementById('auth');
    if (await this.isLogin()) {
      button.innerHTML = '<button id="main_logout" class="btn btn--orange auth__btn">Выход</button>';
      button.addEventListener('click', (e: Event) => this.request(e));
    } else {
      button.innerHTML = '<button id="main_login" class="btn btn--orange auth__btn">Вход</button>';
      button.addEventListener('click', (e: Event) => this.request(e));
    }
  }

  draw() {
    const container = <HTMLElement>document.createElement('div');
    container.id = this.container__class;
    document.body.append(container);
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
      <div class="error">error</div>
    </div>
    <div>
      <div class="email" data-validate="true">
        <div class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">error</div>
    </div>
    <div>
      <div class="password" data-validate="true">
        <div class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required ></div>
      </div>
      <div id="error-password" class="error">error</div>
    </div>
    <div class="button">
      <button id="close">ОТМЕНА</button><button id="register">РЕГИСТРАЦИЯ</button>
    </div>
  `;
    container.innerHTML = this.content;
    const inputEmail = <HTMLInputElement>document.getElementById('email');
    const errorEmail = <HTMLElement>document.getElementById('error-email');
    // inputEmail.addEventListener('input', this.onInputEmail(inputEmail.value));
    inputEmail.addEventListener('input', () => {
      if (this.validateEmail(inputEmail.value)) errorEmail.innerText = 'Неверный формат Email-адреса';
      else errorEmail.innerText = '';
    });

    this.addHandlers();
  }

  // private onInputEmail(value) {
  //   const errorEmail = <HTMLElement>document.getElementById('error-email');
  //   if (this.validateEmail(value)) {
  //     errorEmail.innerText = 'green';
  //   } else {
  //     errorEmail.innerText = 'red';
  //   }
  // }

  drawLoginUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
    <div>
      <div class="email" data-validate="true">
        <div class="label">Email</div>
        <div class="input"><input id="email" type="email" autocomplete="off" required></div>
      </div>
      <div id="error-email" class="error">error</div>
    </div>
    <div>
      <div class="password" data-validate="true">
        <div class="label">Пароль</div>
        <div class="input"><input id="password" type="password" autocomplete="off" minlength="8" required></div>
      </div>
      <div id="error-password" class="error">error</div>
    </div>
      <div class="button">
        <button id="registerLink">Регистрация</button><button id="close">ОТМЕНА</button><button id="login">ВХОД</button>
      </div>
  `;
    container.innerHTML = this.content;
    this.addHandlers();
  }

  private addHandlers() {
    const modal = <HTMLElement>document.getElementById('modal');
    modal.addEventListener('click', (e: Event) => this.request(e));
  }

  private request(event: Event) {
    const target = <HTMLElement>event.target;
    if (target.id === 'main_login') this.draw();
    if (target.id === 'registerLink') this.drawCreateUser();
    if (target.id === 'login') this.sendLoginData();
    if (target.id === 'register') this.sendRegisterData();
    if (target.id === 'close') this.closeModal();
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
    if (res === 200) (<HTMLElement>document.getElementById(this.container__class)).remove();
  }

  private async sendRegisterData() {
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const statusCreate = await this.user.createUser({ name, email, password });
    console.log(statusCreate);
    if (statusCreate === 200) {
      console.log('REGISTER: OK');
      const statusLogin = await this.user.loginUser({ email, password });
      (<HTMLElement>document.getElementById(this.container__class)).remove();
      if (statusLogin === 200) console.log('LOGIN: OK');
    }
    if (statusCreate === 417) {
      (<HTMLInputElement>document.getElementById('name')).value = '';
      (<HTMLInputElement>document.getElementById('email')).value = '';
      (<HTMLInputElement>document.getElementById('password')).value = '';
      console.log('USER EXISTS');
    }
  }

  private validateEmail(value: string): boolean {
    // const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(value);
  }
}
