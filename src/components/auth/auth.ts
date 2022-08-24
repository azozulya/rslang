import JWT from 'jwt-decode';
import './auth.scss';
import User from '../user/user';
import { IAuth } from '../interfaces';

export default class Auth {
  private static instance: Auth;

  private content: string;

  container__class: string;

  private user: User;

  constructor() {
    this.container__class = 'container';
    this.content = '';
    this.user = User.getInstance();
  }

  static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  isLogin(): boolean {
    const getValue = <string | null> this.user.getStorage('RSLang_Auth');
    if (getValue !== null) {
      const auth = <IAuth>JSON.parse(<string>getValue);
      console.log(auth.refreshToken);
      if (auth.refreshToken === '') return false;
      console.log(JWT(auth.refreshToken));
      const currentDate = new Date();
      return true;
    }
    console.log('RSLang_Auth: NULL');
    return false;
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
      <button id="login">ОТМЕНА</button><button id="register">Регистрация</button>
    </div>
  `;
    container.innerHTML = this.content;
    this.addHandlers();
  }

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
        <button id="registerLink">Регистрация</button><button id="login">ОТМЕНА</button><button id="login">ВХОД</button>
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
    if (target.id === 'registerLink') this.drawCreateUser();
    if (target.id === 'login') this.sendLoginData();
    if (target.id === 'register') this.sendRegisterData();
  }

  private async sendLoginData() {
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const res = await this.user.loginUser({ email, password });
    console.log(`sendLoginData: ${res}`);
    if (res === 200) (<HTMLElement>document.getElementById(this.container__class)).innerHTML = '';
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
      (<HTMLElement>document.getElementById(this.container__class)).innerHTML = '';
      if (statusLogin === 200) console.log('LOGIN: OK');
    }
    if (statusCreate === 417) {
      (<HTMLInputElement>document.getElementById('name')).value = '';
      (<HTMLInputElement>document.getElementById('email')).value = '';
      (<HTMLInputElement>document.getElementById('password')).value = '';
      console.log('USER EXISTS');
    }
  }

  // private validateEmail(value:string): boolean {
  //   return value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // }
}
