import {
  IWord,
  IUser,
  IAuth,
  IUserWord,
  IUserStatistics,
  IUserSettings,
  IToken,
} from '../interfaces/interfaces';

class Api {
  private static instance: Api;

  private baseUrl: string;

  private words: string;

  private users: string;

  private signin: string;

  private constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
    this.words = `${this.baseUrl}/words`;
    this.users = `${this.baseUrl}/users`;
    this.signin = `${this.baseUrl}/signin`;
  }

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  async getWords(group: number, page: number): Promise<IWord[]> {
    const response = await fetch(`${this.words}?group=${group}&page=${page}`);
    const words: IWord[] = await response.json();
    return words;
  }

  async getWord(id: string): Promise<IWord> {
    const response = await fetch(`${this.words}/${id}`);
    return (await response.json()) as IWord;
  }

  async getUser(id: string, token: string): Promise<IUser> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUser;
  }

  async createUser(user: IUser): Promise<IUser | number> {
    const response = await fetch(this.users, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    // return response.status !== 200 ? response.status : { ...(await response.json()) as IUser };
    return response.status;
  }

  async updateUser(
    id: string,
    token: string,
    body: { email: string; password: string },
  ): Promise<IUser> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUser;
  }

  async deleteUser(id: string, token: string): Promise<string> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return `${response.status}: ${response.statusText}`;
  }

  async getUserToken(id: string, rToken: string): Promise<IToken> {
    const response = await fetch(`${this.users}/${id}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${rToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = (await response.json()) as IToken;
    return result;
  }

  async loginUser(body: {
    email: string;
    password: string;
  }): Promise<IAuth | number> {
    let result: IAuth;
    const response = await fetch(this.signin, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    if (response.status === 200) {
      result = await response.json();
      localStorage.setItem('RSLang_Auth', JSON.stringify(result));
      localStorage.setItem('Authenticated', JSON.stringify(true));
    }
    return response.status;
  }

  async getUserWords(): Promise<IUserWord[]> {
    const userId = this.getUserId();
    const token = this.getToken();
    const response = await fetch(`${this.users}/${userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWords: IUserWord[] = await response.json();
    return userWords;
  }

  async getUserWordsNew(userId: string, token: string): Promise<IUserWord[]> {
    const response = await fetch(`${this.users}/${userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWords: IUserWord[] = await response.json();
    return userWords;
  }

  async createUserWord(wordId: string, word?: IUserWord): Promise<IUserWord> {
    const userId = this.getUserId();
    const token = this.getToken();
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return (await response.json()) as IUserWord;
  }

  async createUserWordNew(
    userId: string,
    token: string,
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return (await response.json()) as IUserWord;
  }

  async getUserWord(
    userId: string,
    token: string,
    wordId: string,
  ): Promise<IUserWord> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return (await response.json()) as IUserWord;
  }

  async updateUserWord(
    userId: string,
    token: string,
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return (await response.json()) as IUserWord;
  }

  async deleteUserWord(
    userId: string,
    token: string,
    wordId: string,
  ): Promise<string> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return `${response.status}: ${response.statusText}`;
  }

  async getUserAggregatedWords(
    group?: string,
    page?: string,
    wordsPerPage?: string,
    filter?: string,
  ): Promise<IWord[]> {
    const userId = this.getUserId();
    const token = this.getToken();
    const response = await fetch(
      `${this.users}/${userId}/AggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    return (await response.json()) as IWord[];
  }

  async getUserAggregatedWordsNew(
    userId: string,
    token: string,
    group: string,
    page: string,
    wordsPerPage: string,
    filter: string,
  ): Promise<IWord[]> {
    const response = await fetch(
      `${this.users}/${userId}/AggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    return (await response.json()) as IWord[];
  }

  async getUserAggregatedWord(
    userId: string,
    token: string,
    wordId: string,
  ): Promise<IWord> {
    const response = await fetch(
      `${this.users}/${userId}/AggregatedWords/${wordId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    return (await response.json()) as IWord;
  }

  async getUserStatistics(
    userId: string,
    token: string,
  ): Promise<IUserStatistics> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUserStatistics;
  }

  async updateUserStatistics(
    userId: string,
    token: string,
    body: IUserStatistics,
  ): Promise<IUserStatistics> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await response.json()) as IUserStatistics;
  }

  async getUserSettings(userId: string, token: string): Promise<IUserSettings> {
    const response = await fetch(`${this.users}/${userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUserSettings;
  }

  async updateUserSettings(
    userId: string,
    token: string,
    body: IUserSettings,
  ): Promise<IUserSettings> {
    const response = await fetch(`${this.users}/${userId}/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await response.json()) as IUserSettings;
  }

  getUserId(): number | null {
    const authInfo = localStorage.getItem('RSLang_Auth');
    if (!authInfo) return null;
    return JSON.parse(authInfo).userId;
  }

  getToken() {
    const authInfo = localStorage.getItem('RSLang_Auth');
    if (!authInfo) return null;
    return JSON.parse(authInfo).token;
  }

  getRefreshToken() {
    return JSON.parse(<string>localStorage.getItem('RSLang_Auth')).refreshToken;
  }
}
export default Api;