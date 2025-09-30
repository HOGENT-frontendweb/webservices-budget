import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PlaceModule } from '../place/place.module';
import { UserService } from './user.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule, PlaceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
