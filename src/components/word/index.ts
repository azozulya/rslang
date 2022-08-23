import WordModel from './model';
// import WordView from './view';

class Word {
  // private view: WordView;

  private model: WordModel;

  constructor() {
    // this.view = new WordView();
    this.model = new WordModel();
  }
}

export default Word;
