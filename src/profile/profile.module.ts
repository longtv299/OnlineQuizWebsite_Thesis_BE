import { Module } from '@nestjs/common';
import { GendersModule } from '../genders/genders.module';
import { UsersModule } from '../users/users.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
@Module({
  imports: [UsersModule, GendersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
