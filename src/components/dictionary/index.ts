import DictionaryView from './dictionary';
import API from '../api/api';
import DictionaryModel from './model';
import { IWord } from '../interfaces';

class Dictionary {
  private view: DictionaryView;

  private model: DictionaryModel;

  private api: API;

  constructor() {
    this.view = new DictionaryView();
    this.model = new DictionaryModel();

    this.api = API.getInstance();
  }

  // onReadyWords = (words: IWord[]) => {
  // this.view.init(words);
  // };

  draw(rootContainer: HTMLElement) {
    rootContainer.append(this.view.draw());
  }
}

export default Dictionary;
