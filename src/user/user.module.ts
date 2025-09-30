import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PlaceModule } from '../place/place.module';

@Module({
  imports: [PlaceModule],
  controllers: [UserController],
})
export class UserModule {}
