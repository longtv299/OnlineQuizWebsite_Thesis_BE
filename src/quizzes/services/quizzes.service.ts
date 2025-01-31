import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository } from 'typeorm';
import { NotFound } from '../../core/exceptions';
import { compare, hash } from 'bcrypt';
import { Question } from '../domain/question';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}
  async create(createDto: CreateQuizDto) {
    if (createDto.password) {
      createDto.password = await hash(createDto.password, 12);
    }
    return this.quizRepository.save(createDto);
  }

  findQuizzesForClass(id: number) {
    return this.quizRepository.find({
      where: { class: { id } },
    });
  }
  findQuizzesByClassAndStudent(classId: number, studentId: number) {
    const query = this.quizRepository
      .createQueryBuilder('A')
      .leftJoinAndSelect('A.studentAnswers', 'B')
      .leftJoin('B.student', 'C', 'C.id = :studentId')
      .andWhere('A.classId = :classId')
      .setParameters({ studentId, classId });
    return query.getMany();
  }

  findOne(id: number) {
    return this.quizRepository.findOne({ where: { id } });
  }

  async findOneWithoutAnswer(id: number) {
    const quiz = await this.findOne(id);
    if (!quiz) {
      throw new NotFound<Quiz>(undefined, 'Not found');
    }
    const { questions, ...detail } = quiz;
    const quizResponse = detail;

    Object.assign(quizResponse, {
      questions: questions.map((e) => new Question(e)),
    });
    return quizResponse;
  }

  async update(id: number, updateDto: UpdateQuizDto) {
    if (updateDto.password) {
      updateDto.password = await hash(updateDto.password, 12);
    }
    const result = await this.quizRepository.save({
      id,
      ...updateDto,
    });

    return result;
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }
  async clone(id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: {
        class: true,
      },
    });
    if (!quiz) {
      throw new NotFound();
    }
    const cloneQuiz = await this.quizRepository.save({
      ...quiz,
      id: null,
    });

    return cloneQuiz;
  }
  async verifyPassword(id: number, password: string) {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz.password) {
      return false;
    }
    let isValid: boolean = false;
    isValid = await compare(password, quiz.password);
    return isValid;
  }
}
