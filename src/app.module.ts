import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { GendersModule } from './genders/genders.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { QuizzesResultModule } from './quizzes-result/quizzes-result.module';
import { UserAnswerModule } from './user-answer/user-answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    RolesModule,
    GendersModule,
    UsersModule,
    ClassesModule,
    QuizzesModule,
    AuthModule,
    QuestionsModule,
    AnswersModule,
    QuizzesResultModule,
    UserAnswerModule,
  ],
})
export class AppModule {}
