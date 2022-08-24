import GamesModel from './model';
import GamesView from './view';

class Games {
  private view: GamesView;

  private model: GamesModel;

  constructor() {
    this.view = new GamesView();
    this.model = new GamesModel();

    this.view.bindGetWords(this.model.getWordsForGame);
  }

  draw(rootContainer: HTMLElement) {
    rootContainer.append(this.view.draw());
  }
}

export default Games;
