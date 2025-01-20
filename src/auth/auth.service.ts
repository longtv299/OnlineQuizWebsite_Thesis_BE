import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './sign-in.dto';
import { compare } from 'bcrypt';
import { ConfigType } from '../config/config.type';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Incorrect, NotFound } from '../core/exceptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigType>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(signInDto: SignInDto) {
    const account = await this.usersService.findByUsername(signInDto.username);

    if (!account) {
      throw new NotFound<SignInDto>('username');
    }
    const { password, ...user } = account;
    const isValid = await compare(signInDto.password, password);
    if (!isValid) {
      throw new Incorrect<SignInDto>('password');
    }

    const token = await this.jwtService.signAsync(user, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: ms(this.configService.get('JWT_EXPIRES_IN')),
    });
    await this.cacheManager.set(token, user);
    return { token };
  }
  async signOut(token: string) {
    await this.cacheManager.del(token);
  }
}
