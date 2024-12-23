import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { AnswersModule } from '../answers/answers.module';
import { QuizzesResultModule } from '../quizzes-result/quizzes-result.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAnswer]), AnswersModule, QuizzesResultModule],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
