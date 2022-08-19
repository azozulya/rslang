import Dictionary from '../dictionary/dictionary';
import LangAPI from '../api/api';

class App {
  dictionary: Dictionary;

  api: LangAPI;

  constructor() {
    this.dictionary = new Dictionary();
    this.api = new LangAPI();
  }

  async start() {
    this.dictionary.init(this.api.getWords.bind(this.api));
    const login = await this.api.loginUser({ email: 'a@a.com', password: '11111111' });
    console.log(login);
  }
}
export default App;
