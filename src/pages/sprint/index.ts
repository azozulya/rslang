import { TPageHistory } from '../../types/interfaces';
import { PAGE_KEY } from '../../utils/constants';
import { getLocalStorage } from '../../utils/localStorage';
import SprintModel from './model';
import SprintView from './view';

class Sprint {
  private view: SprintView;

  private model: SprintModel;

  constructor() {
    this.view = new SprintView();
    this.model = new SprintModel();
  }

  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    // const isLoadFromDictionary =  rootContainer.dataset.arrivalFrom !== 'menu'
    const prevPage = getLocalStorage<TPageHistory>(PAGE_KEY)?.prevPage;

    container.innerHTML = `<br><br><br><br><br><br>Sprint page<br> Click: ${rootContainer.dataset.arrivalFrom} <br>prevPage: ${prevPage}`;
  }
}

export default Sprint;
