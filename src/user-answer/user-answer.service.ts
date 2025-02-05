import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { QuizzesService } from '../quizzes/services/quizzes.service';
import { Question, QuestionWithAnswer, StudentQuizAnswer } from '../quizzes/domain/question';
import { difference, groupBy, intersection } from 'lodash';
import { Student } from '../users/entities/student.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly repository: Repository<StudentAnswer>,
    private readonly quizzesService: QuizzesService,
  ) {}
  async create(createDto: CreateUserAnswerDto) {
    const quizDetail = await this.quizzesService.findOne(createDto.quiz.id);
    let score = 0;
    // Tính điểm theo các phương thức được xác định trong đề
    switch (quizDetail.scoreMethod) {
      case 2:
        score = this.secondSituation(quizDetail.questions, createDto.studentQuizAnswer)
        break;
      case 3:
        score = this.thirdSituation(quizDetail.questions, createDto.studentQuizAnswer)
        break;
      default:
        score = this.firstSituation(quizDetail.questions, createDto.studentQuizAnswer)
        break;
    }
    return  await this.repository.save({...createDto, score});
  }

  // Chỉ tính điểm các câu trả lời đúng
  private firstSituation(questions: Question[], studentQuizAnswer: StudentQuizAnswer[]) {
    const scorePerQuestion = 10 / questions.length
    let isFullScore = true
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
          const isCorrect = !(difference(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          )?.length)
          if (isCorrect) {
            return pre + scorePerQuestion
          }
        }
        isFullScore = false
        return pre;
      },
      0,
    );
    if (isFullScore) {
      score = 10
    }
    return score
  }

  // Chỉ tính điểm các ý đúng
  private secondSituation(questions: Question[], studentQuizAnswer: StudentQuizAnswer[]) {
    const scorePerQuestion = 10 / questions.length
    let isFullScore = true
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
            isFullScore = false
          } 

          return pre + scorePerQuestion * (correctAnswer.length / (cur.correctAnswer.length ?? 1))
        }
        isFullScore = false
        return pre;
      },
      0,
    );
    if (isFullScore) {
      score = 10
    }
    return score
  }

  // Cộng điểm các ý đúng, trừ điểm các ý sai
  private thirdSituation(questions: Question[], studentQuizAnswer: StudentQuizAnswer[]) {
    const pWrongQs = 0.1;
    const pWrongOptions = 0.2;
    const scorePerQuestion = 10 / questions.length
    let isFullScore = true
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
          let scorePerOption = scorePerQuestion / cur.correctAnswer.length
          const correctAnswer = intersection(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          );
          
          if (correctAnswer.length === cur.correctAnswer.length) {
            pre += scorePerQuestion
          } else {
            isFullScore = false
            pre += scorePerOption * correctAnswer.length
          }
          // Trừ điểm các câu sai
          // Sai do chọn thiếu
          const notSelected = difference(
            cur.correctAnswer,
            studentQuizAnswer[index].selectedAnswer,
          );
          pre -= scorePerOption
          return pre

          // const selectedIncorrect = difference(
          //   studentQuizAnswer[index].selectedAnswer,
          //   cur.correctAnswer,
          // );
          
        }
      },
      0,
    );
    if (isFullScore) {
      score = 10
    }
    return score
  }

  async findByClass(classId: number) {
    const query = this.repository.createQueryBuilder('A').setFindOptions({
      relations: {
        student: {
          user: {
            gender: true
          }
        },
        quiz: true
      },
      where: {
        student: {
          classStudents: {
            group: {
              id: classId
            }
          }
        }
      }
    })

    const studentResults = await query.getMany();
    
    const res = Object.values(groupBy(studentResults, 'studentId')).map(studentResults => {
      return studentResults.reduce((p, c) => {
        p.id = c.studentId;
        p.user = c.student.user
        const studentAnswer = new StudentAnswer()
        const quiz = new Quiz()
        quiz.id = c.quizId;
        quiz.title = c.quiz.title
        studentAnswer.quiz = quiz
        studentAnswer.score = c.score
        
        if (!p.studentAnswers?.length) {
          p.studentAnswers = [studentAnswer]
        } else {
          p.studentAnswers.push(studentAnswer)
        }
        p.user.password= null
        return p
      }, new Student())
    })
    
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
