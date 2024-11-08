import { Controller, Get } from '@nestjs/common';
import { GendersService } from './genders.service';
import { Public } from '../auth/public.decorator';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Public()
  @Get()
  findAll() {
    return this.gendersService.findAll();
  }
}
