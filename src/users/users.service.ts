import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { GendersService } from '../genders/genders.service';
import { NotFound } from '../core/exceptions';
import { hash } from 'bcrypt';
import { PositionsService } from '../positions/positions.service';
import { PositionEnum } from '../positions/position.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly positionService: PositionsService,
    private readonly genderService: GendersService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const position = await this.positionService.findById(
      createUserDto.position.id,
    );
    if (!position) {
      throw new NotFound<User>('position');
    }

    const gender = await this.genderService.findById(createUserDto.gender.id);
    if (!gender) {
      throw new NotFound<User>('gender');
    }

    createUserDto.password = await hash(createUserDto.password, 12);

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    if (createUserDto.position.id === PositionEnum.Teacher) {
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
        position: true,
        student: true,
        teacher: true,
      },
    });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: {
        position: true,
        teacher: true,
        student: true,
      },
    });
  }
  findManyByUsernamesAndPosition(usernames: string[], positionId: number) {
    return this.userRepository.find({
      where: { username: In(usernames), position: { id: positionId } },
      relations: { student: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.position?.id) {
      const position = await this.positionService.findById(
        updateUserDto.position.id,
      );
      if (!position) {
        throw new NotFound<User>('position');
      }
    }

    if (updateUserDto.gender.id) {
      const gender = await this.genderService.findById(updateUserDto.gender.id);
      if (!gender) {
        throw new NotFound<User>('gender');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 12);
    }
    await this.userRepository.save({ ...updateUserDto, id });
  }

  async remove(id: number) {
    // const user = await this.findOne(id);
    await this.userRepository.delete(id);
    // if (user.position.id === PositionEnum.Teacher) {
    //   await this.teacherRepository.softRemove({ id: user.position.id });
    // } else {
    //   await this.studentRepository.softRemove({ id: user.position.id });
    // }
  }
}
