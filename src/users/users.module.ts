import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { User } from './entities/user.entity';
import { GendersModule } from '../genders/genders.module';
import { PositionsModule } from '../positions/positions.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, User]),
    GendersModule,
    PositionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
