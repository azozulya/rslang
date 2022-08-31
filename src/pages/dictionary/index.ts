import DictionaryView from './dictionary';
import DictionaryModel from './model';
import { IWordApp, IWordAppForAuthUser } from '../../interfaces/interfaces';
import userApi from '../../components/user/user';

class Dictionary {
  userApi: typeof userApi;

  private view: DictionaryView;

  private model: DictionaryModel;

  constructor() {
    this.view = new DictionaryView();
    this.model = new DictionaryModel();
    this.userApi = userApi;
  }

  async draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    if (await this.checkUserAuth()) container.append(this.view.drawForAuthUser());
    else container.append(this.view.draw());

    const { group, page, isActiveHardWords } = this.view.getNavigate();
    if (isActiveHardWords) this.handleGetHardWords();
    this.handleGetWords(group, page);
    this.addHandlers();

    /* const login = await this.api.loginUser({
      // remove after class Auth is ready
      email: 'a@a.com',
      password: '11111111',
    });

    console.log('login', login); */
  }

  private addHandlers() {
    this.view.bindGetHardWords(this.handleGetHardWords);
    this.view.bindGetWords(this.handleGetWords);
    this.model.bindUpdateWords(this.onUpdateWords);
    this.model.bindUpdateWordsAuth(this.onUpdateWordsAuth);
  }

  private checkUserAuth() {
    return this.userApi.isAuthenticated();
  }

  onUpdateWords = (words: IWordApp[]) => {
    this.view.drawWords(words);
  };

  onUpdateWordsAuth = (words: (IWordAppForAuthUser | IWordApp)[]) => {
    this.view.drawWordsAuth(words);
  };

  handleGetHardWords = async () => {
    this.model.getHardWords(await this.checkUserAuth());
  };

  handleGetWords = async (group: number, page: number) => {
    this.model.getWords(group, page, await this.checkUserAuth());
  };
}

export default Dictionary;
