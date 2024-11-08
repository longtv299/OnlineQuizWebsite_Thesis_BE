import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Public } from '../auth/public.decorator';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Public()
  @Get()
  findAll() {
    return this.positionsService.findAll();
  }
}
