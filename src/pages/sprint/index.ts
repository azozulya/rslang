import GamesModel from './model';
import GamesView from './view';

class Games {
  private view: GamesView;

  private model: GamesModel;

  constructor() {
    this.view = new GamesView();
    this.model = new GamesModel();

    this.view.bindGetWords(this.model.getWordsForGame);
    this.view.bindUpdateUserWord(this.model.updateUserWord);
    this.view.bindGetGameStatistic(this.model.getGameStatistic);
  }

  draw(rootContainer: HTMLElement) {
    const isMenuLink = rootContainer.dataset.linkFrom === 'menu';

    this.model.isMenuLink = isMenuLink;
    this.view.isMenuLink = isMenuLink;

    rootContainer.append(this.view.draw());
  }
}

export default Games;
