import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './update-profile.dto';
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne(@Request() { user }) {
    return this.profileService.findOne(user?.id ?? 0);
  }
  @Patch()
  update(@Request() { user }, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(user?.id ?? 0, updateProfileDto);
  }
}
