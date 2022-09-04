import {
  IWord,
  IUser,
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
    // this.baseUrl = 'http://127.0.0.1:3000';
    this.baseUrl = 'https://react-rslang-backend.herokuapp.com';

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

  async getWords(group: number, page: number): Promise<IWord[] | undefined> {
    const response = await fetch(
      `${this.words}?group=${group}&page=${page}`,
    ).catch();
    return response.status !== 200 ? undefined : <IWord[]> await response.json();
  }

  async getWord(id: string): Promise<IWord | undefined> {
    const response = await fetch(`${this.words}/${id}`).catch();
    return response.status !== 200 ? undefined : <IWord> await response.json();
  }

  async getUser(id: string, token: string): Promise<IUser | number> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? response.status
      : <IUser> await response.json();
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
    return response.status;
  }

  async updateUser(
    id: string,
    token: string,
    body: { email: string; password: string },
  ): Promise<IUser | number> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? response.status
      : <IUser> await response.json();
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

  async getUserToken(id: string, rToken: string): Promise<IToken | undefined> {
    const response = await fetch(`${this.users}/${id}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${rToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200 ? undefined : <IToken> await response.json();
  }

  async loginUser(body: {
    email: string;
    password: string;
  }): Promise<Response> {
    const response = await fetch(this.signin, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response;
  }

  async getUserWords(
    userId: string,
    token: string,
  ): Promise<IUserWord[] | undefined> {
    if (!userId || !token) return [];

    const response = await fetch(`${this.users}/${userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserWord[]> await response.json();
  }

  async createUserWord(
    userId: string,
    token: string,
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord | undefined> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(word),
      body: JSON.stringify({
        difficulty: word?.difficulty,
        optional: word?.optional,
      }),
    });
    return response.status !== 200
      ? undefined
      : <IUserWord> await response.json();
  }

  async getUserWord(
    userId: string,
    token: string,
    wordId: string,
  ): Promise<IUserWord | undefined> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserWord> await response.json();
  }

  async updateUserWord(
    userId: string,
    token: string,
    wordId: string,
    word?: IUserWord,
  ): Promise<IUserWord | undefined> {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(word),
      body: JSON.stringify({
        difficulty: word?.difficulty,
        optional: word?.optional,
      }),
    });
    // return (await response.json()) as IUserWord;
    return response.status !== 200
      ? undefined
      : <IUserWord> await response.json();
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
    userId: string,
    token: string,
    group: number,
    page: number,
    wordsPerPage: number,
    filter: string,
  ) {
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
    ).catch();
    return response.status !== 200 ? undefined : response.json();
  }

  async getUserAggregatedWordsFilter(
    userId: string,
    token: string,
    filter: string,
    wordsPerPage = 3600,
  ) {
    const response = await fetch(
      `${this.users}/${userId}/AggregatedWords?wordsPerPage=${wordsPerPage}&filter=${filter}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    ).catch();
    return response.status !== 200 ? undefined : response.json();
  }

  async getUserAggregatedWord(
    userId: string,
    token: string,
    wordId: string,
  ): Promise<IWord | undefined> {
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
    ).catch();
    return response.status !== 200 ? undefined : <IWord> await response.json();
  }

  async getUserStatistics(
    userId: string,
    token: string,
  ): Promise<IUserStatistics | undefined> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserStatistics> await response.json();
  }

  async updateUserStatistics(
    userId: string,
    token: string,
    body: IUserStatistics,
  ): Promise<IUserStatistics | undefined> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserStatistics> await response.json();
  }

  async getUserSettings(
    userId: string,
    token: string,
  ): Promise<IUserSettings | undefined> {
    const response = await fetch(`${this.users}/${userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserSettings> await response.json();
  }

  async updateUserSettings(
    userId: string,
    token: string,
    body: IUserSettings,
  ): Promise<IUserSettings | undefined> {
    const response = await fetch(`${this.users}/${userId}/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).catch();
    return response.status !== 200
      ? undefined
      : <IUserSettings> await response.json();
  }
}
export default Api;
