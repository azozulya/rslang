import DictionaryView from './dictionary';
import API from '../api/api';

class Dictionary {
  private view: DictionaryView;

  private api: API;

  constructor() {
    this.view = new DictionaryView();
    this.api = API.getInstance();
  }

  async draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    container.append(this.view.draw());

    this.view.init();

    const login = await this.api.loginUser({
      email: 'a@a.com',
      password: '11111111',
    });

    console.log('login', login);
  }
}

export default Dictionary;
