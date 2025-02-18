import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Invalid, NotFound } from '../../core/exceptions';
import { Question } from '../domain/question';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}
  async create(createDto: CreateQuizDto) {
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
      .leftJoinAndSelect('A.studentAnswers', 'B', 'B.studentId = :studentId')
      .andWhere('A.classId = :classId')
      .setParameters({ studentId, classId });
    return query.getMany();
  }

  findOne(id: number) {
    return this.quizRepository.findOne({
      relations: { class: true },
      where: { id },
    });
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
    // Nếu quiz đã có người giải thì không được phép sửa
    const isDone = await this.quizRepository.exists({
      where: {
        studentAnswers: {
          studentId: Not(IsNull()),
        },
      },
    });
    if (isDone) {
      throw new Invalid<Quiz>(undefined, 'Cannot update quiz');
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
    const curDate = new Date();
    // Kiểm tra đã đến ngày làm bài chưa? Nếu chưa thì khôg được làm
    console.log(quiz.startDate, curDate, curDate > quiz.startDate);

    return password === quiz.password;
  }
}
