import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { AnswersService } from '../answers/answers.service';
import { Quiz } from '../quizzes/entities/quiz.entity';

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
  async createMany(quizId: number, createManyDto: CreateQuestionDto[]) {
    for (const question of createManyDto) {     
      const savedQuestion = await this.repository.save({
        quiz: {id: quizId},
        content: question.content,
        isChooseOne: question.isChooseOne,
      });
      
      await this.answerService.createManyInQuestion(
        savedQuestion.id,
        question.answers,
      );
    }
  }

  findAllByQuizWithoutCorrect(quizId: number) {
    return this.repository.find({
      select: {
        answers: {
          id: true,
          content: true,
          studentAnswers: true,
        },
      },
      where: { quiz: { id: quizId } },
      relations: { answers: true },
    });
  }
  findAllByQuizWithCorrect(quizId: number) {
    return this.repository.find({
      where: { quiz: { id: quizId } },
      relations: { answers: true },
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

  removeByQuizId(quizId: number) {
    return this.repository.delete({ quiz: { id: quizId } });
  }
}
