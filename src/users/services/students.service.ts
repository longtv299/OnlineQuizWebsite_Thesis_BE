import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  findOne(id: number) {
    return this.studentRepository.findOne({
      relations: {
        user: true,
      },
      where: { id },
    });
  }
  findByClass(classId: number) {
    return this.studentRepository.find({
      relations: {
        user: true,
        classStudents: {
          group: true,
        },
      },
      where: {
        classStudents: {
          group: {
            id: classId,
          },
        },
      },
    });
  }
}
