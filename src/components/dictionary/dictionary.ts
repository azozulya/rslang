import { IWord } from '../interfaces';
import create from '../utils/createElement';
import './dictionary.scss';
import './pagination.scss';

class DictionaryView {
  words: Array<IWord>;

  COUNT_OF_LEVELS: number;

  page: number;

  constructor(words: Array<IWord>) {
    this.words = words;
    this.COUNT_OF_LEVELS = 5;
    this.page = 0;
  }

  addHandlers() {
    const dictionaryLevels = <HTMLElement>(
      document.getElementById('dictionaryLevels')
    );
    // eslint-disable-next-line no-console
    console.log(dictionaryLevels);
    dictionaryLevels.addEventListener('click', (e: Event) => this.requestWords(e));
  }

  requestWords(event: Event) {
    const dictionaryLevel = <HTMLElement>event.target;
    if (dictionaryLevel.classList.contains('dictionary__levels_item')) {
      // eslint-disable-next-line no-console
      console.log('requestwords', event.target); // TODO - add request
    }
  }

  // eslint-disable-next-line max-lines-per-function
  draw() {
    const dictionary = create({
      tagname: 'div',
      class: 'dictionary',
      // parent: root,
    });
    create({
      tagname: 'h2',
      class: 'dictionary__title',
      parent: dictionary,
      text: 'Изучай новые слова',
    });
    const dictionaryLevels = create({
      tagname: 'div',
      class: 'dictionary__levels',
      id: 'dictionaryLevels',
      parent: dictionary,
    });
    const dictionaryLevelsList = create({
      tagname: 'ul',
      class: 'dictionary__levels_list',
      parent: dictionaryLevels,
    });
    for (let i = 0; i <= this.COUNT_OF_LEVELS; i += 1) {
      create({
        tagname: 'li',
        class: 'dictionary__levels_item',
        id: `${i}  уровень`,
        parent: dictionaryLevelsList,
        text: `${i + 1} уровень`,
      });
    }
    create({
      tagname: 'div',
      class: 'dictionary__hardwords',
      parent: dictionaryLevels,
    });
    const dictionaryWords = create({
      tagname: 'div',
      class: 'dictionary__words',
      parent: dictionary,
    });
    const dictionaryWordsList = create({
      tagname: 'div',
      class: 'dictionary__words_list',
      parent: dictionaryWords,
    });
    create({
      tagname: 'div',
      class: 'dictionary__word',
      parent: dictionaryWords,
    });

    this.words.forEach((word) => {
      const wordInDictionary = create({
        tagname: 'div',
        class: 'dictionary__words_item',
        parent: dictionaryWordsList,
        text: `${word.word}`,
      });
      create({
        tagname: 'div',
        class: 'dictionary__words_translate',
        parent: wordInDictionary,
        text: `${word.wordTranslate}`,
      });
    });
    const dictionaryPagination = create({
      tagname: 'div',
      class: 'dictionary__pagination',
      parent: dictionary,
    });
    create({
      tagname: 'div',
      class: 'dictionary__pagination_prev',
      parent: dictionaryPagination,
    });
    create({
      tagname: 'div',
      class: 'dictionary__pagination_cur',
      id: 'dictionaryPage',
      parent: dictionaryPagination,
      text: '1',
    });
    create({
      tagname: 'div',
      class: 'dictionary__pagination_next',
      parent: dictionaryPagination,
    });

    return dictionary;
  }
}
export default DictionaryView;
