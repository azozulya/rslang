import wordsList from './components/utils/testWord';
import Dictionary from './components/dictionary/dictionary';

const dictionary = new Dictionary(wordsList);
dictionary.draw(wordsList);
dictionary.addHandlers();
