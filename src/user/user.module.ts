import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PlaceModule } from '../place/place.module';
import { UserService } from './user.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [AuthModule, DrizzleModule, PlaceModule],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService,
  ],
})
export class UserModule {}
