import wordsList from '../utils/testWord';
import DictionaryView from './dictionary';

class Dictionary {
  private view: DictionaryView;

  constructor() {
    this.view = new DictionaryView(wordsList);
  }

  draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    container.append(this.view.draw());
  }
}

export default Dictionary;
