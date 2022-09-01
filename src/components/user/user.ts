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
  IStatistic,
} from '../../interfaces/interfaces';
import updateDate from '../../utils/updateDate';
import Api from '../../api/api';

class User {
  private static instance: User;

  private api: Api;

  private userId: string;

  private token: string;

  private refreshToken: string;

  private message: string;

  private name: string;

  private defaultStatistic: IStatistic;

  static User: User;

  constructor() {
    this.api = Api.getInstance();
    this.defaultStatistic = {
      L: 0, sN: 0, sR: 0, sW: 0, sB: 0, aN: 0, aR: 0, aW: 0, aB: 0,
    };
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

  getStorage(key: string): string | undefined {
    const result = localStorage.getItem(key);
    return result !== null ? result : undefined;
  }

  setStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  logout() {
    localStorage.clear();

    this.userId = '';
    this.token = '';
    this.refreshToken = '';
    this.message = '';
    this.name = '';
  }

  async isAuthenticated() {
    if (this.token === '') {
      this.setStorage('Authenticated', JSON.stringify(false));
      return false;
    }

    const expToken = (<IJwt>JWT(this.token)).exp;
    const currentTime = Math.trunc(Date.now() / 1000);

    if (expToken <= currentTime) {
      this.setStorage('Authenticated', JSON.stringify(false));
      return false;
    }
    await this.getUserToken();
    this.setStorage('Authenticated', JSON.stringify(true));

    return true;
  }

  getWords(group: number, page: number): Promise<IWord[] | undefined> {
    return this.api.getWords(group, page);
  }

  getWord(id: string): Promise<IWord | undefined> {
    return this.api.getWord(id);
  }

  getUser(): Promise<IUser | number> {
    return this.api.getUser(this.userId, this.token);
  }

  createUser(user: IUser): Promise<IUser | number> {
    return this.api.createUser(user);
  }

  updateUser(body: {
    email: string;
    password: string;
  }): Promise<IUser | number> {
    return this.api.updateUser(this.userId, this.token, body);
  }

  deleteUser(): Promise<string> {
    return this.api.deleteUser(this.userId, this.token);
  }

  async getUserToken(): Promise<IToken | undefined> {
    const result = <IAuth>{};
    result.message = this.message;

    const response = await this.api.getUserToken(
      this.userId,
      this.refreshToken,
    );
    if (response !== undefined) {
      result.token = response.token;
      result.refreshToken = response.refreshToken;
      result.userId = this.userId;
      result.name = this.name;

      this.token = response.token;
      this.refreshToken = response.refreshToken;

      this.setStorage('RSLang_Auth', JSON.stringify(result));
      this.setStorage('Authenticated', JSON.stringify(true));
    }
    return response;
  }

  async loginUser(body: {
    email: string;
    password: string;
  }): Promise<IAuth | number> {
    const response = await this.api.loginUser(body);

    if (response.status === 200) {
      const result = await response.json();

      this.message = result.message;
      this.name = result.name;
      this.userId = result.userId;
      this.token = result.token;
      this.refreshToken = result.refreshToken;

      this.setStorage('RSLang_Auth', JSON.stringify(result));
      this.setStorage('Authenticated', JSON.stringify(true));
    }
    return response.status;
  }

  getUserWords(): Promise<IUserWord[] | undefined> {
    return this.api.getUserWords(this.userId, this.token);
  }

  createUserWord(
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord | undefined> {
    return this.api.createUserWord(this.userId, this.token, wordId, word);
  }

  getUserWord(wordId: string): Promise<IUserWord | undefined> {
    return this.api.getUserWord(this.userId, this.token, wordId);
  }

  updateUserWord(
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord | undefined> {
    return this.api.updateUserWord(this.userId, this.token, wordId, word);
  }

  deleteUserWord(wordId: string): Promise<string> {
    return this.api.deleteUserWord(this.userId, this.token, wordId);
  }

  getUserAggregatedWords(
    group: number,
    page: number,
    wordsPerPage: number,
    filter: string,
  ) {
    return this.api.getUserAggregatedWords(
      this.userId,
      this.token,
      group,
      page,
      wordsPerPage,
      filter,
    );
  }

  getUserAggregatedWord(wordId: string): Promise<IWord | undefined> {
    return this.api.getUserAggregatedWord(this.userId, this.token, wordId);
  }

  getUserStatistics(): Promise<IUserStatistics | undefined> {
    return this.api.getUserStatistics(this.userId, this.token);
  }

  updateUserStatistics(
    body: IUserStatistics,
  ): Promise<IUserStatistics | undefined> {
    return this.api.updateUserStatistics(this.userId, this.token, body);
  }

  getUserSettings(): Promise<IUserSettings | undefined> {
    return this.api.getUserSettings(this.userId, this.token);
  }

  updateUserSettings(body: IUserSettings): Promise<IUserSettings | undefined> {
    return this.api.updateUserSettings(this.userId, this.token, body);
  }

  async updateWordStatistic(amount: number) {
    const body = <IUserStatistics>{};
    const currentDate = updateDate();
    const response = await this.getUserStatistics();
    if (!response) {
      const options = <Record<string, unknown>>{};
      (<IStatistic>options[currentDate]) = this.defaultStatistic;
      (<IStatistic>options[currentDate]).L = amount;
      body.optional = options;
      await this.updateUserStatistics(body);
    } else {
      const options = <Record<string, unknown>>response.optional;
      if (options[currentDate]) {
        if ((<IStatistic>options[currentDate]).L > 0) {
          (<IStatistic>options[currentDate]).L += amount;
        }
      } else {
        (<IStatistic>options[currentDate]) = this.defaultStatistic;
        (<IStatistic>options[currentDate]).L = 1;
      }
      body.optional = options;
      await this.updateUserStatistics(body);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  async updateSprintStatistic(
    learnedWords: number,
    newWords: number,
    rightAnswers: number,
    wrongAnswers: number,
    bestSeries: number,
  ) {
    const currentDate = updateDate();
    const body = <IUserStatistics>{};
    const response = await this.getUserStatistics();
    if (!response) {
      const options = <Record<string, unknown>>{};
      (<IStatistic>options[currentDate]) = this.defaultStatistic;
      (<IStatistic>options[currentDate]).L = learnedWords;
      (<IStatistic>options[currentDate]).sN = newWords;
      (<IStatistic>options[currentDate]).sR = rightAnswers;
      (<IStatistic>options[currentDate]).sW = wrongAnswers;
      (<IStatistic>options[currentDate]).sB = bestSeries;
      body.optional = options;
      await this.updateUserStatistics(body);
    } else {
      const options = <Record<string, unknown>>response.optional;
      if (options[currentDate]) {
        (<IStatistic>options[currentDate]).L += learnedWords;
        (<IStatistic>options[currentDate]).sN += newWords;
        (<IStatistic>options[currentDate]).sR += rightAnswers;
        (<IStatistic>options[currentDate]).sW += wrongAnswers;

        if ((<IStatistic>options[currentDate]).sB < bestSeries) {
          (<IStatistic>options[currentDate]).sB = bestSeries;
        }
      } else {
        (<IStatistic>options[currentDate]) = this.defaultStatistic;
        (<IStatistic>options[currentDate]).L = learnedWords;
        (<IStatistic>options[currentDate]).sN = newWords;
        (<IStatistic>options[currentDate]).sR = rightAnswers;
        (<IStatistic>options[currentDate]).sW = wrongAnswers;
        (<IStatistic>options[currentDate]).sB = bestSeries;
      }
      body.optional = options;
      await this.updateUserStatistics(body);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  async updateAudioStatistic(
    learnedWords: number,
    newWords: number,
    rightAnswers: number,
    wrongAnswers: number,
    bestSeries: number,
  ) {
    const currentDate = updateDate();
    const body = <IUserStatistics>{};
    const response = await this.getUserStatistics();
    if (!response) {
      const options = <Record<string, unknown>>{};
      (<IStatistic>options[currentDate]) = this.defaultStatistic;
      (<IStatistic>options[currentDate]).L = learnedWords;
      (<IStatistic>options[currentDate]).aN = newWords;
      (<IStatistic>options[currentDate]).aR = rightAnswers;
      (<IStatistic>options[currentDate]).aW = wrongAnswers;
      (<IStatistic>options[currentDate]).aB = bestSeries;
      body.optional = options;
      await this.updateUserStatistics(body);
    } else {
      const options = <Record<string, unknown>>response.optional;
      if (options[currentDate]) {
        (<IStatistic>options[currentDate]).L += learnedWords;
        (<IStatistic>options[currentDate]).aN += newWords;
        (<IStatistic>options[currentDate]).aR += rightAnswers;
        (<IStatistic>options[currentDate]).aW += wrongAnswers;

        if ((<IStatistic>options[currentDate]).aB < bestSeries) {
          (<IStatistic>options[currentDate]).aB = bestSeries;
        }
      } else {
        (<IStatistic>options[currentDate]) = this.defaultStatistic;
        (<IStatistic>options[currentDate]).L = learnedWords;
        (<IStatistic>options[currentDate]).aN = newWords;
        (<IStatistic>options[currentDate]).aR = rightAnswers;
        (<IStatistic>options[currentDate]).aW = wrongAnswers;
        (<IStatistic>options[currentDate]).aB = bestSeries;
      }
      body.optional = options;
      await this.updateUserStatistics(body);
    }
  }
}

const userApi = new User();
export default userApi;
