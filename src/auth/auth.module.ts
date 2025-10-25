import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServerConfig, AuthConfig } from '../config/configuration';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true, // no need to import JwtModule in other modules
      useFactory: (configService: ConfigService<ServerConfig>) => {
        const authConfig = configService.get<AuthConfig>('auth')!;

        return {
          secret: authConfig.jwt.secret,
          signOptions: {
            expiresIn: `${authConfig.jwt.expirationInterval}s`,
            audience: authConfig.jwt.audience,
            issuer: authConfig.jwt.issuer,
          },
        };
      },
    }),
    DrizzleModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
