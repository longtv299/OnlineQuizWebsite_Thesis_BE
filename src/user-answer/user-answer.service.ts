import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { QuizzesService } from '../quizzes/services/quizzes.service';
import {
  Question,
  QuestionWithAnswer,
  StudentQuizAnswer,
} from '../quizzes/domain/question';
import { difference, groupBy, intersection } from 'lodash';
import { Student } from '../users/entities/student.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { ExcelUtil } from '../core/excel';
import { center, left, mediumBold, SheetConfig } from '../core/excel/types';
import { StudentsService } from '../users/services/students.service';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly repository: Repository<StudentAnswer>,
    private readonly quizzesService: QuizzesService,
    private readonly studentsService: StudentsService,
  ) {}
  async create(createDto: CreateUserAnswerDto) {
    const quizDetail = await this.quizzesService.findOne(createDto.quiz.id);
    let score = 0;
    // Tính điểm theo các phương thức được xác định trong đề
    switch (quizDetail.scoreMethod) {
      case 2:
        score = this.secondSituation(
          quizDetail.questions,
          createDto.studentQuizAnswer,
        );
        break;
      case 3:
        score = this.thirdSituation(
          quizDetail.questions,
          createDto.studentQuizAnswer,
          quizDetail,
        );
        break;
      default:
        score = this.firstSituation(
          quizDetail.questions,
          createDto.studentQuizAnswer,
        );
        break;
    }
    return await this.repository.save({ ...createDto, score });
  }

  // Chỉ tính điểm các câu trả lời đúng
  private firstSituation(
    questions: Question[],
    studentQuizAnswer: StudentQuizAnswer[],
  ) {
    const scorePerQuestion = 10 / questions.length;
    let isFullScore = true;
    // Chấm điểm từng câu
    let score = questions.reduce(
      (pre: number, cur: QuestionWithAnswer, index: number) => {
        if (cur.isChooseOne) {
          // cộng điểm khi trả lời đúng
          if (cur.answers[studentQuizAnswer[index].selectedAnswer]) {
            return pre + scorePerQuestion;
          }
        } else {
          // cộng điểm khi chọn tất cả các đáp án đúng và không chọn đáp án sai
          // Nếu có sai khác giữa đáp án và câu trả lời => sai
          const isCorrect = !difference(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          )?.length;
          if (isCorrect) {
            return pre + scorePerQuestion;
          }
        }
        isFullScore = false;
        return pre;
      },
      0,
    );
    if (isFullScore) {
      score = 10;
    }
    return score;
  }

  // Chỉ tính điểm các ý đúng
  private secondSituation(
    questions: Question[],
    studentQuizAnswer: StudentQuizAnswer[],
  ) {
    const scorePerQuestion = 10 / questions.length;
    let isFullScore = true;
    // Chấm điểm từng câu
    let score = questions.reduce(
      (pre: number, cur: QuestionWithAnswer, index: number) => {
        if (cur.isChooseOne) {
          // cộng điểm khi trả lời đúng
          if (cur.answers[studentQuizAnswer[index].selectedAnswer]) {
            return pre + scorePerQuestion;
          }
        } else {
          // cộng điểm khi chọn 1 vài đáp án đúng
          const correctAnswer = intersection(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          );

          if (correctAnswer.length != cur.correctAnswer.length) {
            isFullScore = false;
          }

          return (
            pre +
            scorePerQuestion *
              (correctAnswer.length / (cur.correctAnswer.length ?? 1))
          );
        }
        isFullScore = false;
        return pre;
      },
      0,
    );
    if (isFullScore) {
      score = 10;
    }
    return score;
  }

  // Cộng điểm các ý đúng, trừ điểm các ý sai
  private thirdSituation(
    questions: Question[],
    studentQuizAnswer: StudentQuizAnswer[],
    quiz: Quiz,
  ) {
    const pWrongQs = quiz.pWrongQuestion;
    const pWrongOptions = quiz.pWrongOption;
    const scorePerQuestion = 10 / questions.length;
    let isFullScore = true;
    // Chấm điểm từng câu
    let score = questions.reduce(
      (pre: number, cur: QuestionWithAnswer, index: number) => {
        if (cur.isChooseOne) {
          // cộng điểm khi trả lời đúng
          if (cur.answers[studentQuizAnswer[index].selectedAnswer]) {
            return pre + scorePerQuestion;
          } else {
            // trừ điểm khi trả lời sai
            return pre - scorePerQuestion * pWrongQs;
          }
        } else {
          // cộng điểm khi chọn 1 vài đáp án đúng
          const scorePerOption = scorePerQuestion / cur.correctAnswer.length;
          const correctAnswer = intersection(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          );
          const wrongAnswers = cur.answers.length - correctAnswer.length;

          if (correctAnswer.length === cur.correctAnswer.length) {
            pre += scorePerQuestion;
          } else {
            isFullScore = false;
            pre += scorePerOption * correctAnswer.length;
          }

          // sai do chọn sai
          const selectedIncorrect = difference(
            studentQuizAnswer[index].selectedAnswer,
            cur.correctAnswer,
          );
          if (selectedIncorrect?.length) {
            isFullScore = false;
            pre -= (selectedIncorrect.length * pWrongOptions) / wrongAnswers;
          }
          return pre;
        }
      },
      0,
    );
    if (isFullScore) {
      score = 10;
    }
    return score;
  }

  async findByClass(classId: number) {
    const query = this.repository.createQueryBuilder('A').setFindOptions({
      relations: {
        student: {
          user: {
            gender: true,
          },
        },
        quiz: true,
      },
      where: {
        student: {
          classStudents: {
            group: {
              id: classId,
            },
          },
        },
      },
    });

    const studentResults = await query.getMany();

    const res = Object.values(groupBy(studentResults, 'studentId')).map(
      (studentResults) => {
        return studentResults.reduce((p, c) => {
          p.id = c.studentId;
          p.user = c.student.user;
          const studentAnswer = new StudentAnswer();
          const quiz = new Quiz();
          quiz.id = c.quizId;
          quiz.title = c.quiz.title;
          studentAnswer.quiz = quiz;
          studentAnswer.score = c.score;

          if (!p.studentAnswers?.length) {
            p.studentAnswers = [studentAnswer];
          } else {
            p.studentAnswers.push(studentAnswer);
          }
          p.user.password = null;
          return p;
        }, new Student());
      },
    );

    return res;
  }

  findOne(studentId: number, quizId: number) {
    return this.repository
      .createQueryBuilder('A')
      .setFindOptions({
        where: {
          quizId,
          studentId,
        },
        relations: {
          quiz: true,
          student: true,
        },
        relationLoadStrategy: 'query',
      })
      .getOne();
  }

  async exportByQuizId(quizId: number) {
    const quiz = await this.quizzesService.findOne(quizId);
    const students: any[] = await this.studentsService.findByClass(
      quiz.class.id,
    );
    const data = await this.repository.find({
      relations: {
        student: {
          user: true,
        },
        quiz: true,
      },
      where: {
        quizId,
      },
    });
    students.forEach((s: Student & { score?: any }) => {
      s.score = data.find((d) => d.studentId === s.id) ?? '';
    });

    const exporter = new ExcelUtil();
    await exporter.fillToBlank({
      sheets: [{ students }].map<SheetConfig>((e) => ({
        mergeAndCenterCells: [[1, 1, 1, 4]],
        name: 'Sheet 1',
        rowStart: 3,
        commonCellDataStyle: { alignment: left },
        columns: [
          {
            col: 1,
            code: 'stt',
            header: 'No.',
            cellDataStyle: { alignment: center },
          },
          {
            col: 2,
            code: 'user.fullName',
            header: 'Full name',
            width: 60,
          },
          {
            col: 3,
            code: 'classStudents.0.group.name',
            header: 'Class',
            width: 30,
          },
          { col: 4, code: 'score', header: 'Score', width: 20 },
        ],
        fillSpecCell: [
          {
            cell: [1, 1],
            value: `Result of Quiz: ${quiz.title}`,
            style: { font: mediumBold },
          },
        ],
        data: e.students,
      })),
    });
    return exporter.writeFile();
  }
  async exportByStudent(studentId: number) {
    const student = await this.studentsService.findOne(studentId);
    const data = await this.findResultByStudent(studentId);

    const exporter = new ExcelUtil();
    await exporter.fillToBlank({
      sheets: [{ data }].map<SheetConfig>((e) => ({
        mergeAndCenterCells: [[1, 1, 1, 4]],
        name: 'Sheet 1',
        rowStart: 3,
        commonCellDataStyle: { alignment: left },
        columns: [
          {
            col: 1,
            code: 'stt',
            header: 'No.',
            cellDataStyle: { alignment: center },
          },
          {
            col: 2,
            code: 'quiz.class.name',
            header: 'Class',
            width: 60,
          },
          {
            col: 3,
            code: 'quiz.title',
            header: 'Quiz',
            width: 30,
          },
          { col: 4, code: 'score', header: 'Score', width: 20 },
        ],
        fillSpecCell: [
          {
            cell: [1, 1],
            value: `Result of Student: ${student.user.fullName}`,
            style: { font: mediumBold },
          },
        ],
        data: e.data,
      })),
    });
    return exporter.writeFile();
  }

  async findResultByStudent(studentId: number) {
    const result = await this.repository.find({
      relations: {
        quiz: {
          class: true,
        },
      },
      where: {
        studentId,
      },
    });
    return result.map((e) => {
      return {
        quiz: {
          id: e.quiz.id,
          class: { name: e.quiz.class.name },
          title: e.quiz.title,
        },
        score: e.score,
      };
    });
  }
}
