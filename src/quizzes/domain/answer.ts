export class Answer {
  content: string;
  isCorrect: boolean;

  constructor(a?: Answer) {
    if (a.content) {
      this.content = a.content;
    }
    if (a.isCorrect) {
      this.isCorrect = a.isCorrect;
    }
  }

  toWithoutAnswer() {
    this.isCorrect = undefined;
    return this;
  }
}
