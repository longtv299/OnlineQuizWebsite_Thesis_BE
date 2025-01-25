import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { StudentDto } from '../../users/dto/student.dto';
import { Student } from '../../users/entities/student.entity';
import { IdentityDto } from '../../core/identity.dto';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { StudentQuizAnswer } from '../../quizzes/domain/question';

export class CreateUserAnswerDto {
  @ApiProperty({ type: () => StudentDto })
  @Type(() => StudentDto)
  @ValidateNested()
  student: Student;

  @ApiProperty({ type: () => IdentityDto })
  @Type(() => IdentityDto)
  @ValidateNested()
  quiz: Quiz;

  @IsArray()
  studentQuizAnswer: StudentQuizAnswer[];
}
