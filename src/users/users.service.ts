import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../roles/role.enum';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { RolesService } from '../roles/roles.service';
import { GendersService } from '../genders/genders.service';
import { NotFound } from '../core/exceptions';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly roleService: RolesService,
    private readonly genderService: GendersService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.findById(createUserDto.role.id);
    if (!role) {
      throw new NotFound<User>('role');
    }

    const gender = await this.genderService.findById(createUserDto.gender.id);
    if (!gender) {
      throw new NotFound<User>('gender');
    }

    createUserDto.password = await hash(createUserDto.password, 12);

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    if (createUserDto.role.id === RoleEnum.Teacher) {
      await this.teacherRepository.save({ user });
    } else {
      await this.studentRepository.save({ user });
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        gender: true,
        role: true,
        student: true,
        teacher: true,
      },
    });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.softRemove({ id });
    if (user.role.id === RoleEnum.Teacher) {
      await this.teacherRepository.softRemove({ id: user.role.id });
    } else {
      await this.studentRepository.softRemove({ id: user.role.id });
    }
  }
}
