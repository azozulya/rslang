import wordsList from '../utils/testWord';
import Dictionary from '../dictionary/dictionary';
import Word from '../word/word';

class App {
  dictionary: Dictionary;

  constructor() {
    this.dictionary = new Dictionary();
  }

  start() {
    this.dictionary.createWords(wordsList);
    this.dictionary.draw();
    this.dictionary.addHandlers();
  }
}
export default App;
