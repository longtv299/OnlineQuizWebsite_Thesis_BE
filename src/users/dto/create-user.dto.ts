import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenderDto } from '../../genders/dto/gender.dto';
import { PositionDto } from '../../positions/dto/position.dto';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ type: PositionDto })
  @Type(() => PositionDto)
  @ValidateNested()
  position: PositionDto;

  @ApiProperty({ type: GenderDto })
  @Type(() => GenderDto)
  @ValidateNested()
  gender: GenderDto;
}
