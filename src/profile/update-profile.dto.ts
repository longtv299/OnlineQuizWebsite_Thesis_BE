import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenderDto } from '../genders/dto/gender.dto';

export class UpdateProfileDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ type: GenderDto })
  @Type(() => GenderDto)
  @ValidateNested()
  gender: GenderDto;
}
