import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
    private answerService: AnswersService,
  ) {}
  create(createDto: CreateQuestionDto) {
    return this.repository.save(createDto);
  }
  async createMany(createManyDto: CreateQuestionDto[]) {
    const createdQuestions = await Promise.all(
      createManyDto.map((e) => this.create(e)),
    );
    const createAnswers: Answer[] = [];
    const updateAnswers: Answer[] = [];
    createdQuestions.forEach((e) => {
      const { answers } = e;
      answers.forEach((a: Answer) => {
        if (a.id) {
          updateAnswers.push(a);
        } else {
          createAnswers.push({ ...a, question: e });
        }
      });
    });
    await this.answerService.createMany(createAnswers);
    console.log(createAnswers);
  }

  findAllByQuiz(quizId: number) {
    this.repository.find({
      where: { quiz: { id: quizId } },
    });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateDto: UpdateQuestionDto) {
    return this.repository.save({
      id,
      ...updateDto,
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
