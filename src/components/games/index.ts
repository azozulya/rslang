import GamesModel from './model';
import GamesView from './view';

class Games {
  private view: GamesView;

  private model: GamesModel;

  constructor() {
    this.view = new GamesView();
    this.model = new GamesModel();

    this.model.bindGetWords(this.onGetWords);
  }

  onGetWords = () => {
    this.view.draw();
  };

  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = '<br><br><br><br><br><br>Games page';
  }
}

export default Games;
