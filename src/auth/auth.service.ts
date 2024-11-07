import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './sign-in.dto';
import { compare } from 'bcrypt';
import { ConfigType } from '../config/config.type';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Incorrect, NotFound } from '../core/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigType>,
  ) {}

  async signIn({ username, password }: SignInDto) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFound<SignInDto>('username');
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Incorrect<SignInDto>('password');
    }
    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: ms(this.configService.get('JWT_EXPIRES_IN')),
    });
    return { token };
  }
}
