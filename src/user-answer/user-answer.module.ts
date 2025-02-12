import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/user-answer.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentAnswer]),
    QuizzesModule,
    UsersModule,
  ],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
