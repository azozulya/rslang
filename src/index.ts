import App from './components/App';
import './assets/scss/index.scss';
import createStorage from './components/utils/initStorage';

createStorage();

const app = new App();
app.start();
