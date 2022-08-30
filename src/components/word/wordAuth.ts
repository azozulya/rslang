import {
  IUserWord,
  IWordAppForAuthUser,
  IWordWithUserWord,
} from '../../interfaces/interfaces';
import userApi from '../user/user';
import create from '../../utils/createElement';
import Word from './word';

class WordAuth extends Word implements IWordAppForAuthUser {
  word: IWordWithUserWord;

  // check: () => boolean;

  constructor(word: IWordWithUserWord) {
    super(word);
    this.word = word;
  }

  defineTarget(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.playAudio(element);

    if (element.classList.contains('word__hard')) {
      if (this.word.optional?.hard) this.deleteFromHardWords();
      else {
        if (this.word.optional?.learned) this.deleteFromLearnedWords();
        this.addToHardWords();
      }
    }

    if (element.classList.contains('word__learned')) {
      if (this.word.optional?.learned) this.deleteFromLearnedWords();
      else {
        if (this.word.optional?.hard) this.deleteFromHardWords();
        this.addToLearnedWords();
      }
    }
  }

  /* bindAddToHardWord(callback) {
    const wordHard = document.getElementById('wordHard');
    wordHard?.addEventListener('click', callback);
  }
*/

  async addToHardWords() {
    if (this.word.optional) this.word.optional.hard = true;
    else this.word.optional = { hard: true };

    const word: IUserWord = {
      difficulty: 'none',
      optional: { hard: this.word.optional?.hard },
    };
    const isUserWord = await this.isUserWord();
    if (isUserWord) userApi.updateUserWord(this.word.id, word);
    else {
      userApi.createUserWord(this.word.id, word);
    }

    this.changeIcon();
  }

  async deleteFromHardWords() {
    if (this.word.optional) this.word.optional.hard = false;
    else this.word.optional = { hard: false };

    const word: IUserWord = {
      difficulty: 'none',
      optional: { hard: this.word.optional?.hard },
    };
    await userApi.updateUserWord(this.word.id, word);

    this.changeIcon();
  }

  async addToLearnedWords() {
    if (this.word.optional) this.word.optional.learned = true;
    else this.word.optional = { learned: true };

    const word: IUserWord = {
      difficulty: 'none',
      optional: {
        learned: this.word.optional?.learned,
      },
    };
    const isUserWord = await this.isUserWord();
    if (isUserWord) userApi.updateUserWord(this.word.id, word);
    else {
      userApi.createUserWord(this.word.id, word);
    }

    this.changeIcon();
  }

  async deleteFromLearnedWords() {
    if (this.word.optional) this.word.optional.learned = false;
    else this.word.optional = { learned: false };

    const word: IUserWord = {
      difficulty: 'none',
      optional: {
        learned: this.word.optional?.learned,
      },
    };
    await userApi.updateUserWord(this.word.id, word);

    this.changeIcon();
  }

  changeIcon() {
    const word = <HTMLElement>document.getElementById(this.word.id);
    const wordIconHard = <HTMLElement>word.querySelector('.word__hard');
    const wordIconLearned = <HTMLElement>word.querySelector('.word__learned');

    if (wordIconHard.classList.contains('word__hard_active')) wordIconHard.classList.remove('word__hard_active');
    if (wordIconLearned.classList.contains('word__learned_active')) wordIconLearned.classList.remove('word__learned_active');

    if (this.word.optional?.hard) wordIconHard.classList.add('word__hard_active');
    if (this.word.optional?.learned) wordIconLearned.classList.add('word__learned_active');
  }

  async isUserWord() {
    const userWords = await userApi.getUserWords();
    if (!userWords) throw new Error('Not found user saved words');
    const userWordIndex = userWords.findIndex((userWord) => userWord.wordId === this.word.id);
    return userWordIndex >= 0;
  }

  // eslint-disable-next-line max-lines-per-function
  drawForAuthUser() {
    this.draw();
    const word = <HTMLElement>document.getElementById(this.word.id);
    const wordHeader = <HTMLElement>word.querySelector('.word__header');
    const wordDescription = <HTMLElement>word.querySelector('.word__description');
    const wordMarks = create({
      tagname: 'div',
      class: 'word__marks',
      parent: wordHeader,
    });
    const wordHard = <HTMLElement>create({
      tagname: 'div',
      class: 'word__hard',
      parent: wordMarks,
    });
    if (this.word.optional?.hard) {
      wordHard.classList.add('word__hard_active');
    }
    const wordLearned = <HTMLElement>create({
      tagname: 'div',
      class: 'word__learned',
      parent: wordMarks,
    });
    if (this.word.optional?.learned) {
      wordLearned.classList.add('word__learned_active');
    }

    const wordProgress = create({
      tagname: 'div',
      class: 'word__progress',
      parent: wordDescription,
    });
    const wordSprint = create({
      tagname: 'div',
      class: 'word__sprint',
      parent: wordProgress,
      text: 'Спринт',
    });
    create({
      tagname: 'div',
      class: 'word__sprint_score',
      parent: wordSprint,
      text: '3/10',
    });
    const wordAudio = create({
      tagname: 'div',
      class: 'word__sprint',
      parent: wordProgress,
      text: 'Аудиовызов',
    });
    create({
      tagname: 'div',
      class: 'word__sprint_score',
      parent: wordAudio,
      text: '17/40',
    });
  }
}
export default WordAuth;
