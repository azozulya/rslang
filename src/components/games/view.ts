import create from '../utils/createElement';

class GamesView {
  container: HTMLElement;

  constructor() {
    this.container = create({ tagname: 'div' });
  }

  draw() {}
}

export default GamesView;
