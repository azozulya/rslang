/* eslint-disable max-lines-per-function */
import Api from '../api/api';
import { IWord, IWordApp, IUserWord } from '../interfaces';
import userApi from '../user/user';
import create from '../utils/createElement';

class Word implements IWordApp {
  word: IWord;

  hard:boolean;

  learned:boolean;

  constructor(word: IWord) {
    this.word = word;
    this.hard = false;
    this.learned = false;
  }

  addHandlers(word: HTMLElement) {
    word.addEventListener('click', (e) => this.defineTarget(e));
  }

  defineTarget(event:Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.listenWord();

    if (element.classList.contains('word__hard')) {
      if (this.hard) this.deleteFromHardWords();
      else {
        if (this.learned) this.deleteFromLearnedWords();
        this.addToHardWords();
      }
    }

    if (element.classList.contains('word__learned')) {
      if (this.learned) this.deleteFromLearnedWords();
      else {
        if (this.hard) this.deleteFromHardWords();
        this.addToLearnedWords();
      }
    }
  }

  /* bindAddToHardWord(callback) {
    const wordHard = document.getElementById('wordHard');
    wordHard?.addEventListener('click', callback);
  }
 */

  listenWord() {
    console.log(this.word.id);
  }

  async addToHardWords() {
    this.hard = true;
    const word: IUserWord = { difficulty: 'none', optional: { hard: this.hard } };
    const userWord = await userApi.getUserWord(this.word.id);
    if (userWord) userApi.updateUserWord(this.word.id, word);
    else {
      Api.getInstance().createUserWord(this.word.id, word);
    }
    console.log('2 add hard', this.word.word, this.hard);

    this.changeIcon();
  }

  async deleteFromHardWords() {
    this.hard = false;
    const word: IUserWord = { difficulty: 'none', optional: { hard: this.hard } };
    await userApi.updateUserWord(this.word.id, word);

    console.log('2 delete hard', this.word.word, this.hard);

    this.changeIcon();
  }

  async addToLearnedWords() {
    this.learned = true;
    const word: IUserWord = { difficulty: 'none', optional: { learned: this.learned } };
    const userWord = await userApi.getUserWord(this.word.id);
    if (userWord) userApi.updateUserWord(this.word.id, word);
    else {
      Api.getInstance().createUserWord(this.word.id, word);
    }

    console.log('2 add learned', this.word.word, this.learned);
    this.changeIcon();
  }

  async deleteFromLearnedWords() {
    this.learned = false;
    const word: IUserWord = { difficulty: 'none', optional: { learned: this.learned } };
    await userApi.updateUserWord(this.word.id, word);

    console.log('2 delete learned', this.word.word, this.learned);
    this.changeIcon();
  }

  changeIcon() {
    console.log('3 change icon hard', this.word.word, this.hard);
    console.log('3 change icon learned', this.word.word, this.learned);
    const word = <HTMLElement>document.getElementById(this.word.id);
    const wordIconHard = <HTMLElement>word.querySelector('.word__hard');
    const wordIconLearned = <HTMLElement>word.querySelector('.word__learned');

    if (wordIconHard.classList.contains('word__hard_active')) wordIconHard.classList.remove('word__hard_active');
    if (wordIconLearned.classList.contains('word__learned_active')) wordIconLearned.classList.remove('word__learned_active');

    if (this.hard) wordIconHard.classList.add('word__hard_active');
    if (this.learned) wordIconLearned.classList.add('word__learned_active');
  }
  /* async checkWord() {
    const userWord = await userApi.getUserWord(this.word.id);
    if (userWord) {
      this.hard = (userWord.difficulty === 'hard');
     // if (userWord.difficulty === 'learned') this.learned = true;
    }
    console.log('check', this.hard, this.word.word);
  } */

  async draw() {
    // await this.checkWord();
    // if (this.hard) console.log(this.word.word);
    const dictionary = <HTMLElement>document.getElementById('dictionaryWords');
    const wordInDictionary = create({
      tagname: 'div',
      class: 'word',
      parent: dictionary,
      id: `${this.word.id}`,
    });
    wordInDictionary.classList.add(`word_group-${this.word.group}`);
    const wordImage = <HTMLElement>create({
      tagname: 'div',
      class: 'word__image',
      parent: wordInDictionary,
    });
    wordImage.style.backgroundImage = `url(http://127.0.0.1:3000/${this.word.image})`; // TODO change url after deploy backend
    const wordDescription = create({
      tagname: 'div',
      class: 'word__description',
      parent: wordInDictionary,
    });
    const wordHeader = create({
      tagname: 'div',
      class: 'word__header',
      parent: wordDescription,
    });
    const wordItem = create({
      tagname: 'div',
      class: 'word__item',
      parent: wordHeader,
    });
    create({
      tagname: 'div',
      class: 'word__name',
      parent: wordItem,
      text: `${this.word.word}`,
    });
    create({
      tagname: 'div',
      class: 'word__transcription',
      parent: wordItem,
      text: `${this.word.transcription}`,
    });
    create({
      tagname: 'div',
      class: 'word__audio',
      parent: wordItem,
    });
    const wordMarks = create({
      tagname: 'div',
      class: 'word__marks',
      parent: wordHeader,
    });
    const wordHard = create({
      tagname: 'div',
      class: 'word__hard',
      parent: wordMarks,
    });
    // if (this.hard) wordHard.style.backgroundImage = 'url(../../assets/img/hard_word_active.svg)';
    create({
      tagname: 'div',
      class: 'word__learned',
      parent: wordMarks,
    });
    create({
      tagname: 'div',
      class: 'word__translate',
      parent: wordDescription,
      text: `${this.word.wordTranslate}`,
    });
    const wordText = create({
      tagname: 'div',
      class: 'word__text',
      parent: wordDescription,
    });
    create({
      tagname: 'div',
      class: 'word__meaning',
      parent: wordText,
      text: `${this.word.textMeaning}`,
    });
    create({
      tagname: 'div',
      class: 'word__meaning_translate',
      parent: wordText,
      text: `${this.word.textMeaningTranslate}`,
    });
    create({
      tagname: 'div',
      class: 'word__example',
      parent: wordText,
      text: `${this.word.textExample}`,
    });
    create({
      tagname: 'div',
      class: 'word__example_translate',
      parent: wordText,
      text: `${this.word.textExampleTranslate}`,
    });
    // TODO Check user login (need separate method)
    const wordProgress = create({ tagname: 'div', class: 'word__progress', parent: wordDescription });
    const wordSprint = create({
      tagname: 'div', class: 'word__sprint', parent: wordProgress, text: 'Спринт',
    });
    create({
      tagname: 'div', class: 'word__sprint_score', parent: wordSprint, text: '3/10',
    });
    const wordAudio = create({
      tagname: 'div', class: 'word__sprint', parent: wordProgress, text: 'Аудиовызов',
    });
    create({
      tagname: 'div', class: 'word__sprint_score', parent: wordAudio, text: '17/40',
    });
    this.addHandlers(wordInDictionary);
  }
}
export default Word;
