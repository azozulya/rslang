import API from '../api/api';

class DictionaryModel {
  private state = {
    currentPage: 1,
  };

  private api: API;

  constructor() {
    this.api = API.getInstance();

    this.getWordsByPage();
  }

  async getWordsByPage() {
    this.api.getWords.bind(this.api);

    const login = await this.api.loginUser({
      email: 'a@a.com',
      password: '11111111',
    });
    // eslint-disable-next-line no-console
    console.log(login);
  }
}

export default DictionaryModel;
