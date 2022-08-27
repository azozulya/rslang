import { isFromDictionaryPage } from '../../utils/utils';
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
  }

  draw(rootContainer: HTMLElement) {
    const isMenuLink = rootContainer.dataset.linkFrom === 'menu';
    const isFromDictionary = isFromDictionaryPage();
    console.log('isMenuLink: ', isMenuLink);
    console.log('Controller from dictionary page: ', isFromDictionary);

    rootContainer.append(this.view.draw());
  }
}

export default Games;
