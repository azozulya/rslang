import DictionaryView from './dictionary';
import API from '../../api/api';
import DictionaryModel from './model';
import { IWordApp } from '../../interfaces/interfaces';
import userApi from '../../components/user/user';

class Dictionary {
  userApi: typeof userApi;

  private view: DictionaryView;

  private model: DictionaryModel;

  private api: API;

  constructor() {
    this.view = new DictionaryView();
    this.model = new DictionaryModel();
    this.api = API.getInstance();
    this.userApi = userApi;
  }

  async draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    if (this.checkUserAuth()) container.append(this.view.drawForAuthUser());
    else container.append(this.view.draw());

    const { group, page } = this.view.getGroupAndPage();
    this.handleGetWords(group, page);
    this.addHandlers();

    const login = await this.api.loginUser({
      // remove after class Auth is ready
      email: 'a@a.com',
      password: '11111111',
    });

    console.log('login', login);
  }

  addHandlers() {
    this.view.bindGetHardWords(this.handleGetHardWords);
    this.view.bindGetWords(this.handleGetWords);
    this.model.bindUpdateWords(this.onUpdateWords);
  }

  checkUserAuth() {
    console.log('auth', this.userApi.isAuthenticated());
    return this.userApi.isAuthenticated();
  }

  onUpdateWords = (words: IWordApp[]) => {
    this.view.drawWords(words, this.checkUserAuth());
  };

  handleGetHardWords = () => {
    this.model.getHardWords(this.checkUserAuth());
  };

  handleGetWords = (group: number, page: number) => {
    this.model.getWords(group, page, this.checkUserAuth());
  };
}

export default Dictionary;
