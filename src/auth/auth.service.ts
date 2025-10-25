import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, ServerConfig } from '../config/configuration';
import * as argon2 from 'argon2';
import { User } from '../types/user';
import { JwtPayload } from '../types/auth';
import { LoginRequestDto } from '../session/session.dto';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Role } from './roles';
import { RegisterUserRequestDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ServerConfig>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.get<AuthConfig>('auth')!;

    return argon2.hash(password, {
      type: argon2.argon2id,
      hashLength: authConfig.hashLength,
      timeCost: authConfig.timeCost,
      memoryCost: authConfig.memoryCost,
    });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  private signJwt(user: User): string {
    const authConfig = this.configService.get<AuthConfig>('auth')!;

    return this.jwtService.sign(
      { sub: user.id, email: user.email, roles: user.roles },
      {
        secret: authConfig.jwt.secret,
        audience: authConfig.jwt.audience,
        issuer: authConfig.jwt.issuer,
        expiresIn: authConfig.jwt.expirationInterval,
      },
    );
  }

  async verifyJwt(token: string): Promise<JwtPayload> {
    const authConfig = this.configService.get<AuthConfig>('auth')!;
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: authConfig.jwt.secret,
      audience: authConfig.jwt.audience,
      issuer: authConfig.jwt.issuer,
    });

    if (!payload) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return payload;
  }

  async login({ email, password }: LoginRequestDto): Promise<string> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    const passwordValid = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    return this.signJwt(user);
  }

  async register({
    name,
    email,
    password,
  }: RegisterUserRequestDto): Promise<string> {
    const passwordHash = await this.hashPassword(password);

    const [newUser] = await this.db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: passwordHash,
        roles: [Role.USER],
      })
      .$returningId();

    const user = await this.db.query.users.findFirst({
      where: eq(users.id, newUser.id),
    });

    return this.signJwt(user!);
  }
}
