import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassUserService } from './class-user.service';
import { UpdateClassUserDto } from './dto/update-class-user.dto';

@Controller('classes')
export class ClassUserController {
  constructor(private readonly classUserService: ClassUserService) {}

  @Get(':id/students')
  findStudentsInClass(@Param('id') id: string) {
    return this.classUserService.findStudentsInClass(+id);
  }

  @Patch(':id/students')
  addStudentToClass(
    @Param('id') id: number,
    @Body() updateClassUserDto: UpdateClassUserDto,
  ) {
    return this.classUserService.addStudentToClass(+id, updateClassUserDto);
  }

  @Delete(':id/students/:studentId')
  removeStudentInClass(
    @Param('id') id: number,
    @Param('studentId') studentId: number,
  ) {
    return this.classUserService.removeStudentInClass(+id, +studentId);
  }
}
