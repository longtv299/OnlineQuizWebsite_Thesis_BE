import { Answer } from './answer';

export class Question {
  content: string;
  isChooseOne: boolean;
  answers: Answer[];

  constructor(q: Question) {
    if (q.content) {
      this.content = q.content;
    }
    if (q.isChooseOne) {
      this.isChooseOne = q.isChooseOne;
    }
    if (q.answers) {
      this.answers = q.answers.map((e) => new Answer(e).toWithoutAnswer());
    }
  }
}

export class QuestionWithAnswer extends Question {
  correctAnswer?: any;
}
export class StudentQuizAnswer extends Question {
  selectedAnswer?: any;
}
