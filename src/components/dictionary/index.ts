// import DictionaryView from './dictionary';
// import LangAPI from '../api/api';

class Dictionary {
  // private view: DictionaryView;

  // private api: LangAPI;

  // constructor() {
  // this.view = new DictionaryView();
  // this.api = new LangAPI();
  // }

  async draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    container.innerHTML = 'Dictionary';
    // container.append(this.view.draw());

    // this.view.init(this.api.getWords.bind(this.api));

    // const login = await this.api.loginUser({
    //   email: 'a@a.com',
    //   password: '11111111',
    // });

    // console.log(login);
  }
}

export default Dictionary;
