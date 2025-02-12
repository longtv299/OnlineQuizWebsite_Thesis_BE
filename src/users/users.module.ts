import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { User } from './entities/user.entity';
import { GendersModule } from '../genders/genders.module';
import { PositionsModule } from '../positions/positions.module';
import { UsersService } from './services/users.service';
import { StudentsService } from './services/students.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, User]),
    GendersModule,
    PositionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, StudentsService],
  exports: [UsersService, StudentsService],
})
export class UsersModule {}
