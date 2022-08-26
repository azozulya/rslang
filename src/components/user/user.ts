import JWT from 'jwt-decode';
import {
  IWord,
  IUser,
  IAuth,
  IUserWord,
  IUserStatistics,
  IUserSettings,
  IToken,
  IJwt,
} from '../../interfaces/interfaces';
import Api from '../../api/api';

class User {
  private static instance: User;

  private api: Api;

  private userId: string;

  private token: string;

  private refreshToken: string;

  private message: string;

  private name: string;

  static User: User;

  constructor() {
    this.api = Api.getInstance();
    const storage = <string>localStorage.getItem('RSLang_Auth');
    if (storage !== null) {
      this.userId = JSON.parse(storage).userId;
      this.token = JSON.parse(storage).token;
      this.refreshToken = JSON.parse(storage).refreshToken;
      this.message = JSON.parse(storage).message;
      this.name = JSON.parse(storage).name;
    } else {
      this.userId = '';
      this.token = '';
      this.refreshToken = '';
      this.message = '';
      this.name = '';
    }
  }

  /* static getInstance() {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  } */

  getStorage(key: string) {
    return localStorage.getItem(key);
  }

  setStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // isAuthenticated(): boolean {
  //   const getValue = <string | null> this.getStorage('Authenticated');
  //   return getValue == null ? false : JSON.parse(getValue);
  // }

  logout() {
    localStorage.clear();

    this.userId = '';
    this.token = '';
    this.refreshToken = '';
    this.message = '';
    this.name = '';
  }

  isAuthenticated() {
    if (this.token === '') {
      this.setStorage('Authenticated', JSON.stringify(false));
      return false;
    }

    const expToken = (<IJwt>JWT(this.token)).exp;
    const currentTime = Math.trunc(Date.now() / 1000);

    if (expToken <= currentTime) {
      this.setStorage('Authenticated', JSON.stringify(true));
      return false;
    }

    return true;
  }

  getWords(group: number, page: number): Promise<IWord[]> {
    return this.api.getWords(group, page);
  }

  getWord(id: string): Promise<IWord> {
    return this.api.getWord(id);
  }

  getUser(): Promise<IUser> {
    return this.api.getUser(this.userId, this.token);
  }

  createUser(user: IUser): Promise<IUser | number> {
    return this.api.createUser(user);
  }

  updateUser(body: { email: string; password: string }): Promise<IUser> {
    return this.api.updateUser(this.userId, this.token, body);
  }

  deleteUser(): Promise<string> {
    return this.api.deleteUser(this.userId, this.token);
  }

  async getUserToken(): Promise<IToken> {
    const result = <IAuth>{};
    result.message = this.message;

    const response = this.api.getUserToken(this.userId, this.refreshToken);
    result.token = (await response).token;
    result.refreshToken = (await response).refreshToken;
    result.userId = this.userId;
    result.name = this.name;

    this.setStorage('RSLang_Auth', JSON.stringify(result));
    this.setStorage('Authenticated', JSON.stringify(true));

    return result;
  }

  loginUser(body: {
    email: string;
    password: string;
  }): Promise<IAuth | number> {
    return this.api.loginUser(body);
  }

  getUserWords(): Promise<IUserWord[]> {
    return this.api.getUserWordsNew(this.userId, this.token);
  }

  createUserWord(wordId: string, word?: IUserWord): Promise<IUserWord> {
    return this.api.createUserWordNew(this.userId, this.token, wordId, word);
  }

  getUserWord(wordId: string): Promise<IUserWord> {
    return this.api.getUserWord(this.userId, this.token, wordId);
  }

  updateUserWord(wordId: string, word?: IUserWord): Promise<IUserWord> {
    return this.api.updateUserWord(this.userId, this.token, wordId, word);
  }

  deleteUserWord(wordId: string): Promise<string> {
    return this.api.deleteUserWord(this.userId, this.token, wordId);
  }

  getUserAggregatedWords(
    group: string,
    page: string,
    wordsPerPage: string,
    filter: string,
  ): Promise<IWord[]> {
    return this.api.getUserAggregatedWordsNew(
      this.userId,
      this.token,
      group,
      page,
      wordsPerPage,
      filter,
    );
  }

  getUserAggregatedWord(wordId: string): Promise<IWord> {
    return this.api.getUserAggregatedWord(this.userId, this.token, wordId);
  }

  getUserStatistics(): Promise<IUserStatistics> {
    return this.api.getUserStatistics(this.userId, this.token);
  }

  updateUserStatistics(body: IUserStatistics): Promise<IUserStatistics> {
    return this.api.updateUserStatistics(this.userId, this.token, body);
  }

  getUserSettings(): Promise<IUserSettings> {
    return this.api.getUserSettings(this.userId, this.token);
  }

  updateUserSettings(body: IUserSettings): Promise<IUserSettings> {
    return this.api.updateUserSettings(this.userId, this.token, body);
  }
}

const userApi = new User();
export default userApi;

// export default User;
