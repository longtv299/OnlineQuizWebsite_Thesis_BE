import { Module } from '@nestjs/common';
import { PositionsModule } from './positions/positions.module';
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
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './config/cache-config.service';
import { ProfileModule } from './profile/profile.module';
import { ClassUserModule } from './class-user/class-user.module';

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
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
    }),
    AuthModule,
    ProfileModule,
    PositionsModule,
    GendersModule,
    UsersModule,
    ClassesModule,
    QuizzesModule,
    QuestionsModule,
    AnswersModule,
    QuizzesResultModule,
    UserAnswerModule,
    ClassUserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
