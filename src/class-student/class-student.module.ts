import { Module } from '@nestjs/common';
import { ClassStudentService } from './class-student.service';
import { ClassStudentController } from './class-student.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassStudent } from './entities/class-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassStudent]), UsersModule],
  controllers: [ClassStudentController],
  providers: [ClassStudentService],
})
export class ClassStudentModule {}
