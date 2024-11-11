import { Injectable } from '@nestjs/common';
import { UpdateClassUserDto } from './dto/update-class-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassUser } from './entities/class-user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PositionEnum } from '../positions/position.enum';
import { NotFound } from '../core/exceptions';

@Injectable()
export class ClassUserService {
  constructor(
    @InjectRepository(ClassUser)
    private readonly classUserRepository: Repository<ClassUser>,
    private readonly userService: UsersService,
  ) {}
  async findStudentsInClass(id: number) {
    const classUsers = await this.classUserRepository.find({
      where: {
        group: { id },
      },
      relations: { student: { user: { gender: true } } },
    });
    let response: any[] = [];
    if (classUsers.length) {
      response = classUsers.map(({ student }) => {
        const { user } = student;
        delete user.password;
        return { ...user, student: { id: student.id } };
      });
    }
    return response;
  }

  async addStudentToClass(
    classId: number,
    updateClassUserDto: UpdateClassUserDto,
  ) {
    const students = await this.userService.findManyByUsernamesAndPosition(
      updateClassUserDto.usernames,
      PositionEnum.Student,
    );

    if (!students?.length) {
      throw new NotFound<{ usernames: any }>('usernames');
    }
    const saveData = students.map((e) => {
      return {
        group: { id: classId },
        student: e.student,
      } as unknown as Partial<ClassUser>;
    });
    await this.classUserRepository.upsert(saveData, {
      conflictPaths: {
        group: true,
        student: true,
      },
    });
  }

  async removeStudentInClass(classId: number, studentId: number) {
    await this.classUserRepository.delete({
      group: { id: classId },
      student: { id: studentId },
    });
  }
}
