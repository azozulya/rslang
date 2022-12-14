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

  async defineTarget(event: Event) {
    const element = <HTMLElement>event.target;
    if (element.classList.contains('word__audio')) this.playAudio(element);

    if (element.classList.contains('word__hard')) {
      if ('userWord' in this.word) {
        if (this.word.userWord.optional.hard) this.deleteWords('hard');
        else {
          this.updateWords('hard');
        }
      } else this.updateWords('hard');
    }

    if (element.classList.contains('word__learned')) {
      if ('userWord' in this.word) {
        if (this.word.userWord.optional.learned) this.deleteWords('learned');
        else {
          this.updateWords('learned');
        }
      } else this.updateWords('learned');
    }
  }

  async updateWords(type: 'hard' | 'learned') {
    this.changeWord(type, true);
    this.changeIcon();

    if (type === 'learned') userApi.updateWordStatistic(1);

    const userWord = await this.getUserWord();
    if (!userWord) this.addWords(type);
    else {
      const word: IUserWord = {
        wordId: userWord.wordId,
        difficulty: userWord.difficulty,
        optional: userWord.optional,
      };

      if (type === 'hard') {
        word.optional.hard = true;
        word.optional.learned = false;
      } else if (type === 'learned') {
        word.optional.learned = true;
        word.optional.hard = false;
      }
      userApi.updateUserWord(this.word.id, word);
    }
  }

  async addWords(type: 'hard' | 'learned') {
    const newWord: IUserWord = createDefaultWord(this.word.id);
    newWord.optional[type] = true;

    userApi.createUserWord(this.word.id, newWord);
  }

  async deleteWords(type: 'hard' | 'learned') {
    this.changeWord(type, false);
    this.changeIcon();

    if (type === 'learned') {
      userApi.updateWordStatistic(-1);
    }

    if (type === 'learned') userApi.updateWordStatistic(-1);

    const word = await this.getUserWord();
    if (!word) throw new Error('User word were not found');
    word.optional[type] = false;
    userApi.updateUserWord(this.word.id, word);
  }

  changeWord(option: 'hard' | 'learned', value: boolean) {
    if ('userWord' in this.word) {
      switch (option) {
        case 'hard':
          this.word.userWord.optional.hard = value;
          this.word.userWord.optional.learned = false;
          break;
        case 'learned':
          this.word.userWord.optional.learned = value;
          this.word.userWord.optional.hard = false;
          break;
        default: throw new Error('Incorrect changing status word');
      }
    } else {
      const userWord = createDefaultUserWord(this.word.id);
      this.word = { ...this.word, ...userWord };
      if ('userWord' in this.word) this.word.userWord.optional[option] = value;
    }
  }

  changeIcon() {
    if (!('userWord' in this.word)) return;
    const word = <HTMLElement>document.getElementById(this.word.id);
    const iconHard = word.querySelector('.word__hard');
    const iconLearned = word.querySelector('.word__learned');

    if (this.word.userWord.optional.learned) {
      iconLearned?.classList.add('word__learned_active');
    } else iconLearned?.classList.remove('word__learned_active');

    if (this.word.userWord.optional.hard) {
      iconHard?.classList.add('word__hard_active');
    } else iconHard?.classList.remove('word__hard_active');
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
    const wordImage = <HTMLElement>word.querySelector('.word__image');
    const wordDescription = <HTMLElement>(
      word.querySelector('.word__description')
    );
    const wordMarks = create({
      tagname: 'div',
      class: 'word__marks',
      parent: wordImage,
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

    if ('userWord' in this.word) {
      if (this.word.userWord.optional.sprint.rightAnswer !== 0
      || this.word.userWord.optional.sprint.wrongAnswer !== 0
      || this.word.userWord.optional.audiocall.rightAnswer !== 0
      || this.word.userWord.optional.audiocall.wrongAnswer !== 0
      ) {
        const rightAnswersSprint = this.word.userWord.optional.sprint.rightAnswer;
        const wrongAnswersSprint = this.word.userWord.optional.sprint.wrongAnswer;
        const totalAnswersSprint = rightAnswersSprint + wrongAnswersSprint;

        const rightAnswersAudio = this.word.userWord.optional.audiocall.rightAnswer;
        const wrongAnswersAudio = this.word.userWord.optional.audiocall.wrongAnswer;
        const totalAnswersAudio = rightAnswersAudio + wrongAnswersAudio;

        const wordSprint = create({
          tagname: 'div',
          class: 'word__sprint',
          parent: wordProgress,
          text: '????????????',
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
          text: '????????????????????',
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
}
export default WordAuth;
