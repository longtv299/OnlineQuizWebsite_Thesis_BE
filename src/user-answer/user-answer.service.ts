import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { AnswersService } from '../answers/answers.service';
import { QuizzesResultService } from '../quizzes-result/quizzes-result.service';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly repository: Repository<StudentAnswer>,
    private readonly answerService: AnswersService,
    private readonly quizzResultService: QuizzesResultService,
  ) {}
  async create(createDto: CreateUserAnswerDto) {
    
    const saveData = createDto.answers.map((e) => {
      return {
        student: createDto.student,
        selectedAnswer: e,
      };
    });
    const result = await this.repository.save(saveData);
    const [firstAns] = createDto.answers;
    if (firstAns) {
      const detail = await this.answerService.findOne(firstAns.id);
      await this.quizzResultService.create({
        quiz:  detail.question.quiz,
        student: createDto.student,
        score: 0,
      })
    }
    return result
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
