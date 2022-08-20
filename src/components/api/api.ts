import {
  IWord, IUser, IAuth, IUserWord, IUserStatistics, IUserSettings,
} from '../interfaces';

export default class Api {
  private baseUrl: string;

  private words: string;

  private users: string;

  private signin: string;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
    this.words = `${this.baseUrl}/words`;
    this.users = `${this.baseUrl}/users`;
    this.signin = `${this.baseUrl}/signin`;
  }

  async getWords(group: number, page: number): Promise<IWord[]> {
    const response = await fetch(`${this.words}?group=${group}&page=${page}`);
    const words: IWord [] = await response.json();
    return words;
  }

  async getWord(id: string): Promise<IWord> {
    const response = await fetch(`${this.words}/${id}`);
    return (await response.json()) as IWord;
  }

  async getUser(token: string, id: string): Promise<IUser> {
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
    token: string,
    id: string,
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

  async deleteUser(token: string, id: string): Promise<string> {
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

  async getUserToken(rToken: string, id: string): Promise<IAuth> {
    const response = await fetch(`${this.users}/${id}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${rToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = (await response.json()) as IAuth;
    const { userId, token, refreshToken } = result;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('RSLang_Auth', JSON.stringify({ userId, token, refreshToken }));
    return result;
  }

  async loginUser(body: { email: string; password: string }): Promise<IAuth | number> {
    let result: IAuth;
    const response = await fetch(this.signin, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    }).catch();
    if (response.status === 200) {
      result = await response.json();
      const { userId, token, refreshToken } = result;
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('RSLang_Auth', JSON.stringify({ userId, token, refreshToken }));
    }
    return response.status;
  }

  async getUserWords(id: string): Promise<IUserWord[] | string> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.users}/${id}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUserWord[] | string;
  }

  async createUserWord(
    token: string,
    userId: string,
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

  async getUserWord(token: string, userId: string, wordId: string): Promise<IUserWord> {
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
    token: string,
    userId: string,
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

  async deleteUserWord(token: string, userId: string, wordId: string): Promise<string> {
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
    token: string,
    userId: string,
    group: string,
    page: string,
    wordsPerPage: string,
    filter: string,
  ): Promise<IWord[]> {
    const response = await fetch(`${this.users}/${userId}/AggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IWord[];
  }

  async getUserAggregatedWord(token: string, userId: string, wordId: string): Promise<IWord> {
    const response = await fetch(`${this.users}/${userId}/AggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IWord;
  }

  async getUserStatistics(token: string, userId: string): Promise<IUserStatistics> {
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
    token: string,
    userId: string,
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

  async getUserSettings(token: string, userId: string): Promise<IUserSettings> {
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
    token: string,
    userId: string,
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
}
