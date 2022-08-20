import './auth.scss';
import API from '../api/api';

export default class Auth {
  private content: string;

  container__class: string;

  private api: API;

  constructor(container__class: string) {
    this.container__class = container__class;
    this.content = '';
    this.api = new API();
  }

  init() {
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
      <div class="name">
        Имя<br>
        <input id="name" type="text" autocomplete="off" required>
      </div>
      <div class="email">
        Email<br>
        <input id="email" type="email" autocomplete="off" required>
      </div>
      <div class="password">
        Пароль<br>
        <input id="password" type="password" autocomplete="off" minlength="8" required >
      </div>
      <div class="button">
        <button id="register">Регистрация</button>
      </div>
  `;
    container.innerHTML = this.content;
    this.addHandlers();
  }

  drawLoginUser() {
    const container = <HTMLElement>document.getElementById('modal');
    container.innerHTML = '';
    this.content = `
      <div class="email">
        <span>Email</span>
        <span><input id="email" type="email" autocomplete="off" required></span>
        <span>Error</span>
      </div>
      <div class="password">
        Пароль<br>
        <input id="password" type="password" autocomplete="off" minlength="8" required >
      </div>
      <div class="button">
        <button id="registerLink">Регистрация</button><button id="login">ВХОД</button>
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
    const res = await this.api.loginUser({ email, password });
    console.log(`sendLoginData: ${res}`);
    if (res === 200) (<HTMLElement>document.getElementById(this.container__class)).innerHTML = '';
  }

  private async sendRegisterData() {
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const statusCreate = await this.api.createUser({ name, email, password });
    console.log(statusCreate);
    if (statusCreate === 200) {
      console.log('REGISTER: OK');
      const statusLogin = await this.api.loginUser({ email, password });
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
}
