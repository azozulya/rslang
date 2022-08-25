import DictionaryView from './dictionary';
import API from '../api/api';
import DictionaryModel from './model';
import { IWordApp } from '../interfaces';

class Dictionary {
  private view: DictionaryView;

  private model: DictionaryModel;

  private api: API;

  constructor() {
    this.view = new DictionaryView();
    this.model = new DictionaryModel();
    this.api = API.getInstance();
  }

  async draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.append(this.view.draw());

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

  onUpdateWords = (words: IWordApp[]) => {
    this.view.drawWords(words);
  };

  handleGetHardWords = () => {
    this.model.getHardWords();
  };

  handleGetWords = (group: number, page: number) => {
    this.model.getWords(group, page, true);
  };
}

export default Dictionary;
