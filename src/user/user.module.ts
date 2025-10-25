import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PlaceModule } from '../place/place.module';
import { UserService } from './user.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DrizzleModule, PlaceModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
