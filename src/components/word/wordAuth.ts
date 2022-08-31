import {
  IAggregatedWord,
  IUserWord,
  IWord,
  IWordAppForAuthUser,
} from '../../interfaces/interfaces';
import userApi from '../user/user';
import create from '../../utils/createElement';
import Word from './word';
import { createDefaultUserWord, createDefaultWord } from '../../utils/utils';

class WordAuth extends Word implements IWordAppForAuthUser {
  word: IAggregatedWord | IWord;

  constructor(word: IAggregatedWord | IWord) {
    super(word);
    this.word = word;
  }

  defineTarget(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.playAudio(element);

    if (element.classList.contains('word__hard')) {
      if ('userWord' in this.word) {
        if (this.word.userWord.optional.hard) this.deleteFromHardWords();
        else {
          if (this.word.userWord.optional.learned) this.deleteFromLearnedWords();
          this.updateToHardWords();
        }
      } else this.updateToHardWords();
    }

    if (element.classList.contains('word__learned')) {
      if ('userWord' in this.word) {
        if (this.word.userWord.optional.learned) this.deleteFromLearnedWords();
        else {
          if (this.word.userWord.optional.hard) this.deleteFromHardWords();
          this.updateToLearnedWords();
        }
      } this.updateToLearnedWords();
    }
  }

  /* bindAddToHardWord(callback) {
    const wordHard = document.getElementById('wordHard');
    wordHard?.addEventListener('click', callback);
  }
*/

  async updateToHardWords() {
    this.changeWord('hard', true);

    const word = await this.getUserWord();
    if (!word) this.addToHardWords();
    else {
      word.optional.hard = true;
      userApi.updateUserWord(this.word.id, word);
    }

    this.changeIcon();
  }

  async addToHardWords() {
    const newWord:IUserWord = createDefaultWord(this.word.id);
    newWord.optional.hard = true;

    userApi.createUserWord(this.word.id, newWord);
  }

  async deleteFromHardWords() {
    this.changeWord('hard', false);

    const word = await this.getUserWord();
    if (!word) throw new Error('User word were not found');
    word.optional.hard = false;
    userApi.updateUserWord(this.word.id, word);

    this.changeIcon();
  }

  async updateToLearnedWords() {
    this.changeWord('learned', true);

    const word = await this.getUserWord();
    if (!word) this.addToHardWords();
    else {
      word.optional.learned = true;
      userApi.updateUserWord(this.word.id, word);
    }

    this.changeIcon();
  }

  async addToLearnedWords() {
    const newWord:IUserWord = createDefaultWord(this.word.id);
    newWord.optional.learned = true;

    userApi.createUserWord(this.word.id, newWord);
  }

  async deleteFromLearnedWords() {
    if ('userWord' in this.word) this.word.userWord.optional.learned = false;
    this.changeWord('learned', false);

    const word = await this.getUserWord();
    if (!word) throw new Error('User word were not found');
    word.optional.learned = false;
    userApi.updateUserWord(this.word.id, word);

    this.changeIcon();
  }

  changeWord(option: 'hard' | 'learned', value: boolean) {
    if ('userWord' in this.word) this.word.userWord.optional[option] = value;
    else {
      const userWord = createDefaultUserWord(this.word.id);
      this.word = { ...this.word, ...userWord };
      if ('userWord' in this.word) this.word.userWord.optional[option] = value;
    }
  }

  changeIcon() {
    const word = <HTMLElement>document.getElementById(this.word.id);
    const wordIconHard = <HTMLElement>word.querySelector('.word__hard');
    const wordIconLearned = <HTMLElement>word.querySelector('.word__learned');

    if (wordIconHard.classList.contains('word__hard_active')) wordIconHard.classList.remove('word__hard_active');
    if (wordIconLearned.classList.contains('word__learned_active')) wordIconLearned.classList.remove('word__learned_active');

    if ('userWord' in this.word) {
      if (this.word.userWord.optional.hard) wordIconHard.classList.add('word__hard_active');
      if (this.word.userWord.optional.learned) wordIconLearned.classList.add('word__learned_active');
    }
  }

  async getUserWord() {
    const userWords = await userApi.getUserWords();
    if (!userWords) throw new Error('Not found user saved words');
    const userWord = userWords.find(
      (gettingWord) => gettingWord.wordId === this.word.id,
    );
    return userWord;
  }

  // eslint-disable-next-line max-lines-per-function
  drawForAuthUser() {
    this.draw();
    const word = <HTMLElement>document.getElementById(this.word.id);
    const wordHeader = <HTMLElement>word.querySelector('.word__header');
    const wordDescription = <HTMLElement>(
      word.querySelector('.word__description')
    );
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
    if ('userWord' in this.word) {
      if (this.word.userWord.optional.hard) {
        wordHard.classList.add('word__hard_active');
      }
    }
    const wordLearned = <HTMLElement>create({
      tagname: 'div',
      class: 'word__learned',
      parent: wordMarks,
    });
    if ('userWord' in this.word) {
      if (this.word.userWord.optional.learned) {
        wordLearned.classList.add('word__learned_active');
      }
    }

    const wordProgress = create({
      tagname: 'div',
      class: 'word__progress',
      parent: wordDescription,
    });
    console.log('word', this.word);
    if ('userWord' in this.word) {
      const rightAnswersSprint = this.word.userWord.optional.sprint.rightAnswer;
      const wrongAnswersSprint = this.word.userWord.optional.sprint.rightAnswer;
      const totalAnswersSprint = rightAnswersSprint + wrongAnswersSprint;

      const rightAnswersAudio = this.word.userWord.optional.audiocall.rightAnswer;
      const wrongAnswersAudio = this.word.userWord.optional.audiocall.rightAnswer;
      const totalAnswersAudio = rightAnswersAudio + wrongAnswersAudio;

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
        text: `${rightAnswersSprint}/${totalAnswersSprint}`,
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
        text: `${rightAnswersAudio}/${totalAnswersAudio}`,
      });
    }
  }
}
export default WordAuth;
