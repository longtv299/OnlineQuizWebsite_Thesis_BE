import { Injectable } from '@nestjs/common';
import { UpdateClassStudentDto } from './dto/update-class-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassStudent } from './entities/class-student.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/services/users.service';
import { NotFound } from '../core/exceptions';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassStudentService {
  constructor(
    @InjectRepository(ClassStudent)
    private readonly classUserRepository: Repository<ClassStudent>,
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
    updateClassStudentDto: UpdateClassStudentDto,
  ) {
    const user = await this.userService.findByUsername(
      updateClassStudentDto.username,
    );

    if (!user || !user.student?.id) {
      throw new NotFound<User>('username');
    }

    await this.classUserRepository.upsert(
      {
        group: { id: classId },
        student: { id: user.student.id },
      },
      {
        conflictPaths: {
          group: true,
          student: true,
        },
      },
    );
  }

  async removeStudentInClass(classId: number, studentId: number) {
    await this.classUserRepository.delete({
      group: { id: classId },
      student: { id: studentId },
    });
  }
}
