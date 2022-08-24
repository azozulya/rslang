import Dictionary from '../dictionary/dictionary';
import Api from '../api/api';

class App {
  dictionary: Dictionary;

  api: Api;

  constructor() {
    this.dictionary = new Dictionary();
    this.api = Api.getInstance();
  }

  async start() {
    const login = await this.api.loginUser({ email: 'a@a.com', password: '11111111' });
    console.log(login);
  }
}
export default App;
