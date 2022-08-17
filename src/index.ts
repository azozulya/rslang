import App from './components/App/index';
import './assets/scss/pages/main/index.scss';

import wordsList from './components/utils/testWord';
import Dictionary from './components/dictionary/dictionary';

const app = new App();
app.start();

const dictionary = new Dictionary(wordsList);
dictionary.draw(wordsList);
dictionary.addHandlers();

