import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Post()
  create(@Body() createDto: CreateUserAnswerDto) {
    return this.userAnswerService.create(createDto);
  }

  @Get('find-many/by-class/:classId')
  findByClass(@Param('classId') classId: number) {
    return this.userAnswerService.findByClass(+classId);
  }

  @Get('find-one')
  findOne(
    @Query('studentId') studentId: string,
    @Query('quizId') quizId: string,
  ) {
    return this.userAnswerService.findOne(+studentId, +quizId);
  }
}
