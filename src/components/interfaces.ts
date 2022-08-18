export interface ICreateElement {
  tagname: string;
  class?: string;
  id?: string;
  parent?: HTMLElement;
  child?: HTMLElement;
  text?: string;
}

export interface IWord {
  [key: string]: string | number;

  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IUser {
  [key: string]: string;

  name: string;
  email: string;
  password: string;
}

export interface IAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IUserWord {
  difficulty: string;
  optional?: Record<string, unknown>;
}

export interface IUserStatistics {
  learnedWords: number;
  optional?: Record<string, unknown>;
}

export interface IUserSettings {
  wordsPerDay: number;
  optional?: Record<string, unknown>;
}
