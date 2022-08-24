import Menu from '../../utils/menu';
import GamesModel from './model';
import GamesView from './view';

class Games {
  private view: GamesView;

  private model: GamesModel;

  constructor() {
    this.view = new GamesView();
    this.model = new GamesModel();
  }

  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = '<br><br><br><br><br><br>Games page';
    container.append(Menu.currentPageName);
  }
}

export default Games;
