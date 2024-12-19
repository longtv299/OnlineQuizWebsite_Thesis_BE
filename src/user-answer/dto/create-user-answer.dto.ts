import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AnswerDto } from '../../answers/dto/answer.dto';
import { Answer } from '../../answers/entities/answer.entity';
import { StudentDto } from '../../users/dto/student.dto';
import { Student } from '../../users/entities/student.entity';

export class CreateUserAnswerDto {
  @ApiProperty({ type: () => StudentDto })
  @Type(() => StudentDto)
  @ValidateNested()
  student: Student;

  @ApiProperty({ type: () => [AnswerDto] })
  @Type(() => AnswerDto)
  @ValidateNested()
  @IsArray()
  answers: Answer[];
}
