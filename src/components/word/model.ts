import Api from '../../api/api';
import { IUserWord } from '../../interfaces/interfaces';

class WordModel {
  async addToHardWord(wordId: string, word: IUserWord) {
    const api = Api.getInstance();
    api.createUserWord(wordId, word);
  }
}

export default WordModel;
