import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Class } from '../../classes/entities/class.entity';
import { Type } from 'class-transformer';
import { ClassDto } from '../../classes/dto/class.dto';

export class QuizDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: () => ClassDto })
  @Type(() => ClassDto)
  @ValidateNested()
  class: Class;
}
