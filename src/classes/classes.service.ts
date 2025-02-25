import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { NotFound } from '../core/exceptions';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async create(user: User, createClassDto: CreateClassDto) {
    await this.classRepository.save({ ...createClassDto, teacher: user?.teacher });
  }

  async findAll() {
    return await this.classRepository.find();
  }

  async findAllByTeacher(teacherId: number) {
    return await this.classRepository.find({
      where: {
        teacher: { id: teacherId },
      },
    });
  }
  async findAllByStudent(userId: number) {
    const result = await this.classRepository.find({
      where: {
        classStudent: {
          student: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
    return result;
  }

  async findOne(id: number) {
    return await this.classRepository.findOne({ where: { id } });
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const classValue = await this.findOne(id);
    if (!classValue) {
      throw new NotFound<UpdateClassDto>(undefined, 'Role is not found');
    }
    await this.classRepository.save(updateClassDto);
  }

  async remove(id: number) {
    const classValue = await this.findOne(id);
    if (!classValue) {
      throw new NotFound<UpdateClassDto>(undefined, 'Role is not found');
    }
    await this.classRepository.delete(id);
  }
}
