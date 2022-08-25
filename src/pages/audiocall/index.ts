import AudioCallModel from './model';
import AudioCallView from './view';

class AudioCall {
  private view: AudioCallView;

  private model: AudioCallModel;

  constructor() {
    this.view = new AudioCallView();
    this.model = new AudioCallModel();
  }

  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    // const isLoadFromDictionary = Boolean(
    //   rootContainer.dataset.arrivalFrom !== 'menu'
    // );

    container.innerHTML = `<br><br><br><br><br><br>AudioCall page<br> Click: ${rootContainer.dataset.arrivalFrom}`;
  }
}

export default AudioCall;
