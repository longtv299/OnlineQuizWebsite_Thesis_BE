import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PositionEnum } from '../positions/position.enum';
import { User } from '../users/entities/user.entity';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Request() { user }, @Body() createClassDto: CreateClassDto) {
    return this.classesService.create(user, createClassDto);
  }

  @Get()
  findAll(@Request() { user }: { user: User }) {
    if (user.position.id === PositionEnum.Teacher) {
      return this.classesService.findAllByTeacher(user.id);
    } else {
      return this.classesService.findAllByStudent(user.id);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
