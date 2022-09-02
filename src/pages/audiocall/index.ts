import AudioCallModel from './model';
import AudioCallView from './view';

class AudioCall {
  private view: AudioCallView;

  private model: AudioCallModel;

  constructor() {
    this.view = new AudioCallView();
    this.model = new AudioCallModel();

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

export default AudioCall;
