import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAnswerService.findOne(+id);
  }
}
