import {
  IWord, IUser, IAuth, ILogin,
} from '../interfaces';

export class LangAPI {
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
    return (await response.json()) as IWord[];
  }

  async getWordsId(id: string): Promise<IWord> {
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

  async createUser(user: IUser): Promise<IUser> {
    const response = await fetch(this.users, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return (await response.json()) as IUser;
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

  // async deleteUser(token: string, id: string): Promise<string> {
  //   const response = await fetch(`${this.users}/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   return (await response.json()) as string;
  // }

  async deleteUser(token: string, id: string): Promise<number> {
    const response = await fetch(`${this.users}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch();
    return response.status;
  }

  async getUserToken(id: string): Promise<IAuth | string> {
    const response = await fetch(`${this.users}/${id}/tokens`);
    return (await response.json()) as IAuth | string;
  }

  async loginUser(body: { email: string; password: string }): Promise<ILogin> {
    const response = await fetch(this.signin, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    return (await response.json()) as ILogin;
  }
}

export default LangAPI;
