export interface ICreateElement {
  tagname: string;
  class?: string;
  id?: string;
  parent?: HTMLElement;
  child?: HTMLElement;
  text?: string;
}

export interface IWord {
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

export interface IWordApp {
  word: IWord;
  draw(): void;
}

export interface IWordAppForAuthUser {
  word: IAggregatedWord | IWord;
  drawForAuthUser(): void;
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
  wordId: string;
  difficulty: string;
  optional: IUserWordOption;
}

export interface IUserWordOption {
  learned: boolean;
  hard: boolean;
  sprint: {
    rightAnswer: number;
    wrongAnswer: number;
  };
  audiocall: {
    rightAnswer: number;
    wrongAnswer: number;
  };
}

export interface IUserStatistics {
  learnedWords: number;
  optional?: Record<string, unknown>;
}

export interface IUserSettings {
  wordsPerDay: number;
  optional?: Record<string, unknown>;
}

export interface IToken {
  token: string;
  refreshToken: string;
}

export interface IJwt {
  id: string;
  tokenId: string;
  iat: number;
  exp: number;
}

export type TPageHistory = {
  prevPage: string;
  currentPage: string;
};

export type TNavigate = {
  page: number;
  group: number;
  isActiveHardWords: boolean;
};

export interface IStatistic {
  L: number;
  sN: number;
  sR: number;
  sW: number;
  sB: number;
  aN: number;
  aR: number;
  aW: number;
  aB: number;
}

interface IGameWordCommon {
  id: string;
  audio: string;
  word: string;
  wordTranslate: string;
}
export interface IGameWord extends IGameWordCommon {
  pseudoTranslate: string;
  isRightAnswer?: boolean;
}

export interface IAudioCallWord extends IGameWordCommon {
  image: string;
  answerIndex: number;
  optionsTranslate: string [];
  isRightAnswer?: boolean;
}

export interface IGameStatistic {
  score: number;
  learnedWords: number;
  newWords: number;
  rightAnswer: number;
  wrongAnswer: number;
  seriesOfRightAnswer: number;
  winStreak: number;
}

export interface IPathOfAggregatedWord {
  _id: string;
  userWord: {
    difficulty: string;
    optional: IUserWordOption;
  };
}

export interface IAggregatedWord extends IWord, IPathOfAggregatedWord {}
