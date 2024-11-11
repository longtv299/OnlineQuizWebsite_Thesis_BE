import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateClassUserDto {
  @ApiProperty({ type: [String], isArray: true })
  @IsArray()
  usernames: string[];
}
