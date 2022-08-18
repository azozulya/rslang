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
  optional?: {};
}

export interface IUserStatistics {
  learnedWords: number;
  optional?: {};
}

export interface IUserSettings {
  wordsPerDay: number;
  optional?: {};
}
