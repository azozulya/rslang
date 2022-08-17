import { IWord } from '../interfaces';
import create from '../utils/createElement';
import './dictionary.scss';

class Dictionary {
  words: Array<IWord>;

  COUNT_OF_LEVELS: number;

  page: number;

  constructor(words:Array<IWord>) {
    this.words = words;
    this.COUNT_OF_LEVELS = 5;
    this.page = 0;
  }

  draw(words: Array<IWord>) {
    const dictionary = create({ tagname: 'div', class: 'dictionary', parent: document.body });
    const dictionaryLevels = create({ tagname: 'div', class: 'dictionary__levels', parent: dictionary });
    const dictionaryLevelsList = create({ tagname: 'ul', class: 'dictionary__levels_list', parent: dictionaryLevels });
    for (let i = 0; i <= this.COUNT_OF_LEVELS; i += 1) {
      create({
        tagname: 'li', class: 'dictionary__levels_item', id: `${i}  level`, parent: dictionaryLevelsList, text: `${i + 1} level`,
      });
    }
    create({ tagname: 'div', class: 'dictionary__hardwords', parent: dictionaryLevels });
    const dictionaryWords = create({ tagname: 'div', class: 'dictionary__words', parent: dictionary });

    words.forEach((word) => {
      create({
        tagname: 'div', class: 'dictionary__words_item', parent: dictionaryWords, text: `${word.word}`,
      });
    });
    const dictionaryPagination = create({ tagname: 'div', class: 'dictionary__pagination', parent: dictionary });
    create({
      tagname: 'div', class: 'dictionary__pagination_prev', parent: dictionaryPagination, text: 'Prev',
    });
    create({
      tagname: 'div', class: 'dictionary__pagination_cur', id: 'garagePage', parent: dictionaryPagination, text: '1',
    });
    create({
      tagname: 'div', class: 'dictionary__pagination_next', parent: dictionaryPagination, text: 'Next',
    });
  }
}
export default Dictionary;
