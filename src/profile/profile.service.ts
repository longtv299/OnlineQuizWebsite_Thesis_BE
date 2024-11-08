import { Injectable } from '@nestjs/common';
import { GendersService } from '../genders/genders.service';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UsersService,
    private readonly genderService: GendersService,
  ) {}

  findOne(id: number) {
    return this.userService.findOne(id);
  }
  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.userService.update(id, updateProfileDto);
  }
}
