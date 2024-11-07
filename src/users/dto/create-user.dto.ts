import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '../../roles/dto/role.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GenderDto } from '../../genders/dto/gender.dto';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ type: RoleDto })
  @Type(() => RoleDto)
  @ValidateNested()
  role: RoleDto;

  @ApiProperty({ type: GenderDto })
  @Type(() => GenderDto)
  @ValidateNested()
  gender: GenderDto;
}
