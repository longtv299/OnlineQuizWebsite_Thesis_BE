import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateClassStudentDto {
  @ApiProperty({ type: String })
  @IsString()
  username: string;
}
