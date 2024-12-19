import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassStudentService } from './class-student.service';
import { UpdateClassStudentDto } from './dto/update-class-user.dto';

@Controller('classes')
export class ClassStudentController {
  constructor(private readonly classUserService: ClassStudentService) {}

  @Get(':id/students')
  findStudentsInClass(@Param('id') id: string) {
    return this.classUserService.findStudentsInClass(+id);
  }

  @Patch(':id/students')
  addStudentToClass(
    @Param('id') id: number,
    @Body() updateClassStudentDto: UpdateClassStudentDto,
  ) {
    return this.classUserService.addStudentToClass(+id, updateClassStudentDto);
  }

  @Delete(':id/students/:studentId')
  removeStudentInClass(
    @Param('id') id: number,
    @Param('studentId') studentId: number,
  ) {
    return this.classUserService.removeStudentInClass(+id, +studentId);
  }
}
