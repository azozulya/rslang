import { IWord } from '../../interfaces/interfaces';
import WordModel from './model';
import WordView from './word';

class Word {
  words: WordView[];

  private model: WordModel;

  constructor(words: IWord[]) {
    this.model = new WordModel();
    this.words = [];
    words.forEach((word) => {
      const wordView = new WordView(word);
      this.words.push(wordView);
    });
    this.draw();
  }

  draw() {
    this.words.forEach((word) => word.draw);
  }

  /* makeWords(words: Array<IWord>) {
    this.words = [];
    words.forEach((word) => {
      const wordInDictionary = new Word(word);
      this.words.push(wordInDictionary);
    });
    this.onUpdateWords(this.words);
  } */

  /* addHandler() {
    this.view.bindAddToHardWord(this.handleAddToHardWord);
  }

  handleAddToHardWord = (wordId: string, word: IUserWord) => {
    this.model.addToHardWord(wordId, word);
  }; */
}

export default Word;
