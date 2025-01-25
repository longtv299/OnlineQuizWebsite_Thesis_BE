import { IsNumber } from 'class-validator';

export class IdentityDto {
  @IsNumber()
  id: number;
}
