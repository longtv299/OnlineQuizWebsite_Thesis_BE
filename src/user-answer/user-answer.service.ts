import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { QuizzesResultService } from '../quizzes-result/quizzes-result.service';
import { QuizzesService } from '../quizzes/services/quizzes.service';
import { QuestionWithAnswer } from '../quizzes/domain/question';
import { difference, intersection } from 'lodash';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly repository: Repository<StudentAnswer>,
    private readonly quizzesService: QuizzesService,
    private readonly quizzResultService: QuizzesResultService,
  ) {}
  async create(createDto: CreateUserAnswerDto) {
    const quizDetail = await this.quizzesService.findOne(createDto.quiz.id);
    const result = await this.repository.save(createDto);
    console.log(createDto.studentQuizAnswer);
    // Chấm điểm từng câu
    const score = quizDetail.questions.reduce(
      (pre: number, cur: QuestionWithAnswer, index: number) => {
        if (cur.isChooseOne) {
          // cộng điểm khi trả lời đúng
          if (cur.answers[createDto.studentQuizAnswer[index].selectedAnswer]) {
            return pre + 1;
          }
        } else {
          // cộng điểm khi trả lời đúng
          const correctAnswer = intersection(
            cur.correctAnswer,
            createDto.studentQuizAnswer[index].selectedAnswer,
          );
          const selectedIncorrect = difference(
            createDto.studentQuizAnswer[index].selectedAnswer,
            cur.correctAnswer,
          );
          const notSelected = difference(
            cur.correctAnswer,
            createDto.studentQuizAnswer[index].selectedAnswer,
          );
          console.log(correctAnswer, selectedIncorrect, notSelected);
        }
        return pre;
      },
      0,
    );
    console.log(score);

    return result;
  }

  findAll() {
    return `This action returns all userAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
