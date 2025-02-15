import { Controller, Get, Post, Body, Param, Query, Res, Req } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { ExcelUtil } from '../core/excel';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { NotFound } from '../core/exceptions';
import { Student } from '../users/entities/student.entity';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Post()
  create(@Req() request: Request, @Body() createDto: CreateUserAnswerDto) {
    const user: User | null = request['user'];
    if (!user.student) {
      throw new NotFound<Student>()
    }
    createDto.student = user.student;
    return this.userAnswerService.create(+user.student.id, createDto);
  }

  @Get('start/:quizId')
  start(@Req() request: Request, @Param('quizId') quizId: number) {
    const user: User | null = request['user'];
    if (!user.student) {
      throw new NotFound<Student>()
    }
    return this.userAnswerService.start(user?.student?.id ?? 0,+quizId);
  }

  @Get('find-many/by-class/:classId')
  findByClass(@Param('classId') classId: number) {
    return this.userAnswerService.findByClass(+classId);
  }

  @Get('find-many/by-student/:studentId')
  findByStudent(@Param('studentId') studentId: number) {
    return this.userAnswerService.findResultByStudent(+studentId);
  }

  @Get('find-one')
  findOne(
    @Query('studentId') studentId: string,
    @Query('quizId') quizId: string,
  ) {
    return this.userAnswerService.findOne(+studentId, +quizId);
  }
  @Get('export/by-quiz/:quizId')
  async exportByQuiz(@Res() res: Response, @Param('quizId') quizId: string) {
    const result = await this.userAnswerService.exportByQuizId(+quizId);
    res.set(ExcelUtil.header('result.xlsx')).send(result);
  }
  @Get('export/by-student/:studentId')
  async exportByStudent(
    @Res() res: Response,
    @Param('studentId') studentId: string,
  ) {
    const result = await this.userAnswerService.exportByStudent(+studentId);
    res.set(ExcelUtil.header('result.xlsx')).send(result);
  }
}
