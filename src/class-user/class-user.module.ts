import { Module } from '@nestjs/common';
import { ClassUserService } from './class-user.service';
import { ClassUserController } from './class-user.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassUser } from './entities/class-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassUser]), UsersModule],
  controllers: [ClassUserController],
  providers: [ClassUserService],
})
export class ClassUserModule {}
